

import {  ChangeEvent, FormEvent, Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import DialogLayout from '@/components/util/dialog/DialogLayout'
import InputWithIcon from '@/components/util/input/InputWithIcon'
import ButtonSubmit from '@/components/util/button/ButtonSubmit'
import { TooltipIcon } from '@/components/util/tooltips/Tooltip'
import { CreateUpdateCupos } from '@/core/repository/instalacion'
import { useParams } from 'next/navigation'
import moment from 'moment'
import { useAppDispatch } from '@/context/reduxHooks'
import { uiActions } from '@/context/slices/uiSlice'
import { toast } from 'react-toastify'
import { successfulMessage, unexpectedError } from '@/context/config'

export const EditHorarioPrecio = ({open,close,cupos,updateCupos}:{
    open:boolean
    close:()=>void
    cupos:Cupo[]
    updateCupos:(c:Cupo[])=>void
}) => {
    // const dispatch = useAppDispatch()
    const [loading,setLoading] = useState(false)
    const [price,setPrice] = useState<string>("")
    const [available,setAvailable] = useState<boolean>(true)
    const params = useParams()

    const onSubmit = async(e:FormEvent<HTMLFormElement>) =>{
      try{
          setLoading(true)
        e.preventDefault()
        const request:CreateUpdateCuposRequest =  {
          cupos:cupos,
          precio:Number(price),
          available:available
        }
        const res:Cupo[] = await CreateUpdateCupos(request)
        updateCupos(res)
        toast.success(successfulMessage)
        setLoading(false)

        // if(cupo != undefined){
        //   setLoading(true)
        //   // dispatch(uiActions.setLoaderDialog(true))
        //   const precio = Number(price)
        //     const cupoRequest = cupo
        //     cupoRequest.price = precio
        //     cupoRequest.available = available
        //     if(cupo.id == undefined){
        //       const res:Cupo = await createCupoInstalacion(cupoRequest,params.uuid)
        //       cupo.id = res.id
        //       cupo.price = res.price
        //       cupo.available = res.available

        //       close()
        //     }else {
        //       const res = await updateCupoInstalacion(cupo.id,precio,available)
        //       cupo.price = precio
        //       cupo.available = available
        //       close()
        //     }
        //   }
        }catch(err){
          toast.error(unexpectedError)
          setLoading(false)
        }
    }

    const onChange = (e:ChangeEvent<HTMLInputElement>) =>{
      setPrice(e.target.value)
    }

  return (
    <DialogLayout
    title='Editar horario de atención'
    className=' max-w-lg'
     open={open} close={close}>
      <div className="grid">
        <span className='label'>Horas a editar</span>

        <div className='flex overflow-auto space-x-2 py-2'>
        {cupos.map((item,idx)=>{
          return(
            <div key={idx} className='w-min rounded-full bg-primary text-white px-2 py-1'>
              <span>{item.time}</span>
            </div>
          )
        })}
        </div>

        <form onSubmit={onSubmit}>
            <div className='grid grid-cols-2 gap-3'>
            <div>
            <TooltipIcon
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
            className="input z-0 "
             />
        </div>  

            </div>

            <div>
            <TooltipIcon
            title='Habilitar'
            helpText='Decide si quieres que se hagan reservas en esta hora'
            tooltipId='tooltip2'
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
                loading={loading}
                title='Submit'
                />
              </div>
        </form>
      </div>
    </DialogLayout>
    // Use the `Transition` component at the root level
           
  )
}