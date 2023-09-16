import ConfirmationDialog from "@/components/util/dialog/ConfirmationDialog"
import DialogLayout from "@/components/util/dialog/DialogLayout"
import { useState } from "react"


const CancelReservaDialog = ({open,close}:{
    open:boolean
    close:()=>void
}) =>{
    const [openConfirmationDialog,setOpenConfirmationDialog] = useState(false)

    return(
        <>
        {openConfirmationDialog &&
        <ConfirmationDialog
        open={openConfirmationDialog}
        close={()=>setOpenConfirmationDialog(false)}
        description="Al cancelar la reserva, se notificará al usuario que su reserva
        ha sido cancelada y se le reembolsará el monto gastado."
        performAction={()=>{}}
        />
        }
        <DialogLayout
        open={open}
        close={close}
        title="Cancelar Reserva"
        >
            <div className="pt-1">
                <div>
                    close
                </div>
            </div>
        </DialogLayout>
        </>
    )
}

export default CancelReservaDialog;