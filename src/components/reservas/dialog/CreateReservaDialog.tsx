import ButtonSubmit from "@/components/util/button/ButtonSubmit";
import DialogHeader from "@/components/util/dialog/DialogHeader";
import DialogLayout from "@/components/util/dialog/DialogLayout";
import CommonImage from "@/components/util/image/CommonImage";
import InputWithIcon from "@/components/util/input/InputWithIcon";
import { useAppSelector } from "@/context/reduxHooks";
import { CreateReserva } from "@/core/repository/reservas";
import { getFullName } from "@/core/util";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

type CupoR = {
    start_date:string
    instalacion_id:number
    precio:number
}
type CupoRequest = {
    cupos:CupoR[]
    total_price:number
    paid:number
    end_time:string
    instalacion_id:number
    establecimiento_id:number
}
const CreateReservaDialog = ({open,close,instalacion,reservaCupos,refresh,uuid}:{
    open:boolean
    close:()=>void
    uuid:string
    instalacion:Instalacion
    reservaCupos:CupoReserva[]
    refresh:()=>void
}) => {
    const establecimientosUser = useAppSelector(state=>state.account.establecimientos)
    const [loading,setLoading] = useState(false)
    const [totalPrice,setTotalPrice] = useState(0)
    const [error,setError] = useState("")
    const [orderedCupo,setOrderedCupos] = useState<CupoReserva[]>([])
    const [formData,setFormData] = useState({
        paid:"",
    })
    const {paid} = formData
    const onChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData,
            [e.target.name]:e.target.value
        })
    }

    const onSubmit = async(e:React.FormEvent<HTMLFormElement>) => {
        try{
            e.preventDefault()
            setLoading(true)
            if(Number(paid)> totalPrice){
                setError("El importe pagado no debe superar el total de la reserva.")
                setLoading(false)
                return
            }
            const cupos:CupoR[] = reservaCupos.map(item=>{
                return {
                    start_date:item.time,
                    instalacion_id:instalacion.id,
                    precio:item.precio
                }
            })
            const requestData:CupoRequest = {
                cupos:cupos,
                instalacion_id:instalacion.id,
                total_price:totalPrice,
                paid:Number(formData.paid),
                end_time:moment(cupos[cupos.length - 1].start_date).utc().add(30,'minutes').toISOString(),
                establecimiento_id:establecimientosUser.find(item=>item.uuid == uuid)?.id || 0
            }
            console.log(requestData,"REQUEST DATA")
            const res = await CreateReserva(JSON.stringify(requestData))
            toast.success("Se ha creado exitosamente la reserva")
            refresh()
            close()
            setLoading(false)
            console.log(res)
        }catch(err){
            setLoading(false)
            console.log(err)
        }
    }
    useEffect(()=>{
        setFormData({
            ...formData,
            paid:totalPrice.toString()
        })
    },[totalPrice])
    useEffect(()=>{
        if(totalPrice == 0){
            setTotalPrice(reservaCupos.map(item=>item.precio).reduce((prev,curr)=>prev + curr))
        }
        if(orderedCupo.length == 0){
            const newCupos = reservaCupos.sort((left,right)=>{
                return moment.utc(left.time).diff(moment.utc(right.time))
            })
            // console.log(newCupos,"ordered")
            setOrderedCupos(newCupos)
        }
    },[])
    return(
        <>
     <DialogLayout
     className="max-w-lg"
      open={open} close={close} title="Crear reserva">
        <div className='rounded-lg bg-white overflow-auto max-w-xl'>
            <div className="p-2 ">
                    <div className="flex space-x-3">
                    <CommonImage
                        src={instalacion.portada}
                        h={100}
                        w={170}
                        className="rounded-lg"
                        />
                        <span className="text-sm font-semibold">{instalacion.name}</span>
                    </div>
                        <div className="grid">
                        <div className="grid sm:flex sm:justify-between sm:items-center sm:space-x-10 border-b-[1px] py-2">
                            <span className="label">Precio de la reserva</span>
                            <span className="text-xs ">{totalPrice}</span>
                        </div>
                        {orderedCupo.length > 0 &&
                        <div className="grid sm:flex sm:justify-between sm:items-center sm:space-x-10 border-b-[1px] py-2">
                            <span className="label">Fecha y hora de la reserva</span>
                            <span className="text-xs ">
                            {moment.utc(orderedCupo[0].time).format("ll")} de {' '}
                                {moment.utc(orderedCupo[0].time).format("LT")} a {' '}
                                {moment.utc(orderedCupo[orderedCupo.length -1].time).add(30,'minutes').format("LT")} 
                            </span>
                        </div>
                        }
                    </div>
            </div>
        <form onSubmit={onSubmit}>
            <InputWithIcon
            type="tel"
            label="Monto pagado"
            value={formData.paid}
            name="paid"
            className="mb-5"
            error={error}
            onChange={onChange}
            
            />
            <ButtonSubmit
            loading={loading}
            title="Crear Reserva"
            />
        </form>
         </div>   
     </DialogLayout>
    </>
    )
}

export default CreateReservaDialog;