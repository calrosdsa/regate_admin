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

const EditReservaDialog = ({open,close,reserva,update}:{
    open:boolean
    close:()=>void
    reserva:Reserva
    update:(paid:number,estado:number)=>void
}) =>{
    const [loading,setLoading] = useState(false)
    const [formData,setFormData] = useState({
        paid:reserva.paid.toString(),
        estado:reserva.estado.toString()
    })
    const {paid,estado} = formData

    const onSubmit = async(e:FormEvent<HTMLFormElement>) => {
        try{
            e.preventDefault()
            setLoading(true)
            const r:ReservaEditRequest = {
                id:reserva.id,
                amount:Number(paid),
                estado:Number(estado),
                reserva_uuid:reserva.uuid
            }
            await EditReserva(r)
            // reserva.paid = Number(paid)
            // reserva.estado = Number(estado)
            update( Number(paid), Number(estado))
            setLoading(false)
            close()
            toast.success(successfulMessage)
        }catch(err){
            setLoading(false)
            toast.error(unexpectedError)
            console.log(err)
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
            
            <ButtonSubmit
            loading={loading}
            title="Guardar cambios"
            />

            </form>

        </DialogLayout>
    )
}

export default EditReservaDialog;