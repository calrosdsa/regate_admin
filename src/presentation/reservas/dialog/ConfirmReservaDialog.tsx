import ButtonSubmit from "@/presentation/util/button/ButtonSubmit"
import ButtonWithLoader from "@/presentation/util/button/ButtonWithLoader"
import ConfirmationDialog from "@/presentation/util/dialog/ConfirmationDialog"
import DialogLayout from "@/presentation/util/dialog/DialogLayout"
import InputWithIcon from "@/presentation/util/input/InputWithIcon"
import { unexpectedError } from "@/context/config"
import { CancelReserva, ConfirmReserva } from "@/core/repository/reservas"
import { FormEvent, useState } from "react"
import { toast } from "react-toastify"


const ConfirmReservaDialog = ({open,close,update,reserva}:{
    open:boolean
    reserva:Reserva
    close:()=>void
    update:(amount:number)=>void
}) =>{
    const [loading,setLoading] = useState(false)
    const [value,setValue] = useState("")

    const onChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value)
    }

    const onSubmit= async(e:FormEvent<HTMLFormElement>) => {
        try{
            e.preventDefault()
            setLoading(true)
            const request:ConfirmReservaRequest = {
                amount_added:Number(value),
                reserva_id:reserva.id,
                reserva_uuid:reserva.uuid,
                start_date:reserva.start_date,
                end_date:reserva.end_date
            }
            // console.log("CONFIRMRESERVAREQUEST",request)
             await ConfirmReserva(request)
             setLoading(false)
             update(Number(value))
             close()
            toast.success("Reserva confirmada")
        }catch(err){
            setLoading(false)
            toast.error(unexpectedError)
        }
    }

    return(
        <>
        <DialogLayout
        open={open}
        close={close}
        title="Confirmar reserva"
        className=" max-w-xl"
        >
            <form onSubmit={onSubmit} className="pt-1">
                <InputWithIcon
                onChange={(e)=>onChange(e)}
                value={value}
                name="content"
                type="tel"
                required={true}
                placeholder={`${reserva.total_price - reserva.paid} para completar la reserva`}
                label="Monto extra"
                />
                <div className=" flex justify-end">
                <ButtonSubmit
                loading={loading}
                title="Confirmar"
                className="mt-2 w-28"
                />
                </div>
            </form>
        </DialogLayout>
        </>
    )
}

export default ConfirmReservaDialog;