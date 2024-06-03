import DialogLayout from "../util/dialog/DialogLayout";


const CreateEmpresaDialog = ({open,close}:{
    open:boolean,
    close:()=>void
})=>{
    return (
        <>
        <DialogLayout
        allowFullScreen={true}
        className="max-w-lg"
        title="Crear empresa"
        open={open}
        close={close}
        >
<span>Empresa DIalog</span>
        </DialogLayout>
        </>
    )
}

export default CreateEmpresaDialog;