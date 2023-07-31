

import {  ChangeEvent, FormEvent, Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import DialogLayout from '@/components/util/dialog/DialogLayout'
import InputWithIcon from '@/components/util/input/InputWithIcon'
import ButtonSubmit from '@/components/util/button/ButtonSubmit'
import { Tooltip } from '@/components/util/tooltips/Tooltip'
import { createCupoInstalacion, updateCupoInstalacion } from '@/core/repository/instalacion'
import { useParams } from 'next/navigation'
import moment from 'moment'

export const EditHorarioPrecio = ({open,close,cupo}:{
    open:boolean
    close:()=>void
    cupo:Cupo | undefined
}) => {
    const [price,setPrice] = useState<string>(cupo?.price?.toString()|| "")
    const [available,setAvailable] = useState<boolean>(cupo?.available || false)
    const params = useParams()

    const onSubmit = async(e:FormEvent<HTMLFormElement>) =>{
        e.preventDefault()
        // console.log("CUPO",cupo)
        if(cupo != undefined){
          const precio = Number(price)
            const cupoRequest = cupo
            cupoRequest.price = precio
            if(cupo.id == undefined){
              const res:Cupo = await createCupoInstalacion(cupoRequest,params.uuid)
              console.log(res)
              cupo.id = res.id
              cupo.price = res.price
              cupo.available = res.available

              close()
            }else {
              const res = await updateCupoInstalacion(cupo.id,precio,available)
              cupo.price = precio
              cupo.available = available
              console.log(res)
              close()
            }
        }
    }

    const onChange = (e:ChangeEvent<HTMLInputElement>) =>{
      setPrice(e.target.value)
    }

  return (
    <DialogLayout open={open} close={close}>
        <form onSubmit={onSubmit}>
            <div className='grid grid-cols-2 gap-3'>
            <div>
            <Tooltip
            title='Precio'
            helpText='Asigna un precio acorde a la hora y la disponibilidad'
            />
             <div className={`relative`}>
        <input id="password" type='telnet'
        required
            onChange={onChange} 
            value={price}
            // minLength={8}
            pattern='^[0-9]*$'
            className=" input"
             />
        </div>  

            </div>

            <div>
            <Tooltip
            title='Habilitar'
            helpText='Asigna un precio acorde a la hora y la disponibilidad'
            />

            <select className='input' value={available.toString()} onChange={(e)=>{
              const bool = e.target.value == "true"
              setAvailable(bool) 
            }}>
                <option value="true" >Habilitar</option>
                <option value="false">Deshabilitar</option>
            </select>
            </div>
            </div>

              <div className="mt-4">
                <ButtonSubmit
                loading={false}
                title='Submit'
                />
              </div>
        </form>
    </DialogLayout>
    // Use the `Transition` component at the root level
           
  )
}