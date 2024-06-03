

import {  ChangeEvent, FormEvent, Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import DialogLayout from '@/presentation/util/dialog/DialogLayout'
import InputWithIcon from '@/presentation/util/input/InputWithIcon'
import ButtonSubmit from '@/presentation/util/button/ButtonSubmit'
import { TooltipIcon } from '@/presentation/util/tooltips/Tooltip'
import { CreateUpdateCupos } from '@/core/repository/instalacion'
import { useParams } from 'next/navigation'
import moment from 'moment'
import { useAppDispatch } from '@/context/reduxHooks'
import { uiActions } from '@/context/slices/uiSlice'
import { toast } from 'react-toastify'
import { successfulMessage, unexpectedError } from '@/context/config'
import { Chip, MenuItem, TextField, Typography } from '@mui/material'

export const EditHorarioPrecio = ({open,close,cupos,updateCupos,setCupos}:{
    open:boolean
    close:()=>void
    cupos:Cupo[]
    updateCupos:(c:Cupo[])=>void
    setCupos:(c:Cupo)=>void
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
          precio:Math.floor(Number(price) /2),
          available:available
        }
        console.log(request)
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
      <Typography sx={{mb:1}} variant="body2">Precio por hora</Typography>
        

        <div className='flex overflow-auto space-x-2 pb-3 pt-1'>
        {cupos.map((item,idx)=>{
          return(
            <Chip key={idx} label={item.time} onDelete={()=>{
              setCupos(item)
            }} />
            // <div key={idx} className='w-min rounded-full bg-primary text-white px-2 py-1'>
            //   <span>{item.time}</span>
            // </div>
          )
        })}
        </div>

        <form onSubmit={onSubmit}>
            <div className='grid grid-cols-2 gap-3 items-end'>
            <div>
           <Typography  variant="body2">Precio por hora</Typography>
             <div className={`relative`}>
        <TextField
            id="password" type='telnet'
            size='small'
            required
            sx={{mt:0.5}}
            onChange={onChange} 
            value={price}
            className="z-0 "
             />
        </div>  

            </div>

            <div>
            {/* <TooltipIcon
            title='Habilitar'
            helpText='Decide si quieres que se hagan reservas en esta hora'
            tooltipId='tooltip2'
            /> */}
             <TooltipIcon
              title={
                <>
                  <Typography variant="body2" fontSize={13}>
                    {" "}
                    <b>Habilitar:</b> Selecciona esta opción para permitir que
                    se hagan reservas
                  </Typography>
                  <Typography variant="body2" fontSize={13}>
                    <b>Deshabilitar:</b> Selecciona esta opción para impedir que
                    se hagan reservas
                  </Typography>
                </>
              }
            >
              <Typography 
               variant="body2">Habilitar</Typography>
            </TooltipIcon>
           {/* <Typography sx={{mb:1}} variant="body2">Habilitar</Typography> */}
            

            <TextField size='small' value={available.toString()}
            select
            sx={{width:"100%"}}
             onChange={(e)=>{
              const bool = e.target.value == "true"
              setAvailable(bool) 
            }}>
                <MenuItem value="true" >Habilitar</MenuItem>
                <MenuItem value="false">Deshabilitar</MenuItem>
            </TextField>
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