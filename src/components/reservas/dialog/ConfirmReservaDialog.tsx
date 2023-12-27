import ButtonSubmit from "@/components/util/button/ButtonSubmit"
import ButtonWithLoader from "@/components/util/button/ButtonWithLoader"
import ConfirmationDialog from "@/components/util/dialog/ConfirmationDialog"
import DialogLayout from "@/components/util/dialog/DialogLayout"
import InputWithIcon from "@/components/util/input/InputWithIcon"
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
    const [value,setValue] = useState(`${reserva.total_price-reserva.paid}`)

    const onChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value)
    }

    const onSubmit= async(e:FormEvent<HTMLFormElement>) => {
        try{
            e.preventDefault()
            setLoading(true)
            const request:ConfirmReservaRequest = {
                amount_added:Number(value),
                reserva_id:reserva.id
            }
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
        title="Cancelar Reserva"
        className=" max-w-xl"
        >
            <form onSubmit={onSubmit} className="pt-1">
                <InputWithIcon
                onChange={(e)=>onChange(e)}
                value={value}
                name="content"
                type="number"
                required={true}
                label="Motivo de cancelación de la reserva."
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