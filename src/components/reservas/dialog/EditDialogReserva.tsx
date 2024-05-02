import DialogLayout from "@/components/util/dialog/DialogLayout"
import InputWithIcon from "@/components/util/input/InputWithIcon"
import { FormEvent, useState } from "react"
import { getEstadoReserva } from "../ReservaList"
import SelectComponent from "@/components/util/input/SelectCompenent"
import { reservaEstados } from "@/core/util/data"
import ButtonSubmit from "@/components/util/button/ButtonSubmit"
import { EditReserva } from "@/core/repository/reservas"
import { toast } from "react-toastify"
import { successfulMessage, unexpectedError } from "@/context/config"
import moment from "moment"

const EditReservaDialog = ({open,close,reserva,update}:{
    open:boolean
    close:()=>void
    reserva:Reserva
    update:(paid:number,estado:number,endTime:string)=>void
}) =>{
    const [loading,setLoading] = useState(false)
    const [formData,setFormData] = useState({
        paid:reserva.paid.toString(),
        estado:reserva.estado.toString(),
        extra_time:"0"
    })
    const {paid,estado,extra_time} = formData

    const onSubmit = async(e:FormEvent<HTMLFormElement>) => {
        try{
            e.preventDefault()
            setLoading(true)
            const r:ReservaEditRequest = {
                id:reserva.id,
                amount:Number(paid),
                estado:Number(estado),
                reserva_uuid:reserva.uuid,
                extra_time:Number(extra_time),
                start_date:reserva.start_date,
                end_date:reserva.end_date
            }
            console.log("DATA",r)
            await EditReserva(r)
            setLoading(false)
            toast.success(successfulMessage)
            update( Number(paid), Number(estado), 
            moment(reserva.end_date).clone().add(Number(extra_time),"minutes").utc().format())
            close()
        }catch(err){
            setLoading(false)
            toast.error(unexpectedError)
        }
    }
    return(
        <DialogLayout
        open={open}
        close={close}
        className=" max-w-sm"
        title="Editar reserva"
        >
            <form onSubmit={onSubmit}>
                
                <InputWithIcon
                value={paid}
                onChange={(e)=>setFormData({
                    ...formData,
                    paid:e.target.value
                })}
                label="Cantidad pagada"
                type="tel"
                name="paid"
                />

           <SelectComponent
            label="Estado"
            items={reservaEstados.slice(1,reservaEstados.length)}
            onChange={(e)=>{
               setFormData({
                ...formData,
                estado:e.target.value
               })
                // setFilterDataReporte({...filterDataReporte,estado:v == "undefinded"? undefined:Number(v)})
            }}
            name="estado"
            value={estado}
            />

            <SelectComponent
            label="Tiempo extra"
            required={false}
            items={[
                {value:"30",name:"30 minutos"},
                {value:"60",name:"1 hora"},
                {value:"90",name:"1.5 horas"},
                {value:"120",name:"2 horas"},
                {value:"150",name:"2.5 horas"},
                {value:"180",name:"3 horas"},
                {value:"210",name:"3.5 horas"},
                {value:"240",name:"4 horas"},

            ]}
            onChange={(e)=>{
                setFormData({
                 ...formData,
                 extra_time:e.target.value
                })
             }}
             name="extra_time"
             value={extra_time}
            />
            
            <ButtonSubmit
            loading={loading}
            title="Guardar cambios"
            />

            </form>

        </DialogLayout>
    )
}

export default EditReservaDialog;