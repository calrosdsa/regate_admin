import ButtonWithLoader from "@/components/util/button/ButtonWithLoader"
import ConfirmationDialog from "@/components/util/dialog/ConfirmationDialog"
import DialogLayout from "@/components/util/dialog/DialogLayout"
import InputWithIcon from "@/components/util/input/InputWithIcon"
import { unexpectedError } from "@/context/config"
import { CancelReserva } from "@/core/repository/reservas"
import { useState } from "react"
import { toast } from "react-toastify"


const CancelReservaDialog = ({open,close,reserva}:{
    open:boolean
    reserva:Reserva
    close:()=>void
}) =>{
    const [openConfirmationDialog,setOpenConfirmationDialog] = useState(false)
    const [loading,setLoading] = useState(false)
    const [value,setValue] = useState("")

    const onChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value)
    }

    const cancelarReserva = async() => {
        try{
            setLoading(true)
            const request:ReservaCancelRequest = {
                content:value,
                establecimiento_id:reserva.establecimiento_id,
                reserva_id:reserva.id,
                profile_id:reserva.profile_id
            }
             await CancelReserva(request)
             setLoading(false)
             close()
            toast.success("Reserva Cancelada")
        }catch(err){
            setLoading(false)
            toast.error(unexpectedError)
            console.log(err)
        }
    }

    return(
        <>
        {openConfirmationDialog &&
        <ConfirmationDialog
        open={openConfirmationDialog}
        close={()=>setOpenConfirmationDialog(false)}
        description="Al cancelar la reserva, se notificará al usuario que su reserva
        ha sido cancelada y se le reembolsará el monto gastado."
        performAction={()=>{
            setOpenConfirmationDialog(false)
            cancelarReserva()
        }}
        />
        }
        <DialogLayout
        open={open}
        close={close}
        title="Cancelar Reserva"
        className=" max-w-xl"
        >
            <div className="pt-1">
                <InputWithIcon
                onChange={(e)=>onChange(e)}
                value={value}
                name="content"
                label="Motivo de cancelación de la reserva."
                />
                <div className=" flex justify-end">
                <ButtonWithLoader
                loading={loading}
                onClick={()=>setOpenConfirmationDialog(true)}
                title="Confirmar"
                className="mt-2 w-28"
                />
                </div>
            </div>
        </DialogLayout>
        </>
    )
}

export default CancelReservaDialog;