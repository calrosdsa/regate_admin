import ButtonSubmit from "@/components/util/button/ButtonSubmit";
import DialogHeader from "@/components/util/dialog/DialogHeader";
import DialogLayout from "@/components/util/dialog/DialogLayout";
import CommonImage from "@/components/util/image/CommonImage";
import InputWithIcon from "@/components/util/input/InputWithIcon";
import { CreateReserva } from "@/core/repository/reservas";
import { getFullName } from "@/core/util";
import moment from "moment";
import React, { useState } from "react";

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
}
const CreateReservaDialog = ({open,close,instalacion,reservaCupos}:{
    open:boolean
    close:()=>void
    instalacion:Instalacion
    reservaCupos:CupoReserva[]
}) => {
    const [loading,setLoading] = useState(false)
    const [formData,setFormData] = useState({
        paid:"",
        total_price:"",
        end_date:"",
        start_date:""
    })
    const onChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData,
            [e.target.name]:e.target.value
        })
    }

    const onSubmit = async(e:React.FormEvent<HTMLFormElement>) => {
        try{
            e.preventDefault()
            setLoading(true)
            const cupos:CupoR[] = reservaCupos.map(item=>{
                return {
                    start_date:item.time,
                    instalacion_id:instalacion.id,
                    precio:item.precio
                }
            })
            const totalPrice = reservaCupos.map(item=>item.precio).reduce((prev,curr)=>prev + curr)
            const requestData:CupoRequest = {
                cupos:cupos,
                instalacion_id:instalacion.id,
                total_price:totalPrice,
                paid:Number(formData.paid),
                end_time:moment(cupos[cupos.length - 1].start_date).utc().add(30,'minutes').toISOString()
            }
            console.log(requestData,"REQUEST DATA")
            const res = await CreateReserva(JSON.stringify(requestData))
            setLoading(false)
            console.log(res)
        }catch(err){
            setLoading(false)
            console.log(err)
        }
    }
    return(
        <>
     <DialogLayout open={open} close={close} title="Crear reserva">
        <div className='rounded-lg bg-white overflow-auto max-w-xl'>
            {JSON.stringify(instalacion)}
        <form onSubmit={onSubmit}>
            <InputWithIcon
            type="tel"
            label="Monto pagado"
            value={formData.paid}
            name="paid"
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