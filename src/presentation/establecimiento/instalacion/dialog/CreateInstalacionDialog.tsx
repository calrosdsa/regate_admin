import DialogLayout from "@/presentation/util/dialog/DialogLayout"
import CreateInstalacionComponent from "../CreateInstalacion"


const CreateInstalacionDialog = ({open,close,uuid,addInstalacion}:{
    open:boolean
    close:()=>void
    uuid:string
    addInstalacion:(value:Instalacion)=>void
}) => {
    return(
        <DialogLayout
        className="max-w-lg "
        allowFullScreen={true}
        title="Crear nueva cancha"
         open={open} close={close}>
            <CreateInstalacionComponent
            uuid={uuid}
            addInstalacion={addInstalacion}
            close={close}
            />
        </DialogLayout>
    )
}

export default CreateInstalacionDialog;