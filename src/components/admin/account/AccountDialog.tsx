import DialogLayout from "@/components/util/dialog/DialogLayout";


const AccountDialog = ({open,close}:{
    open:boolean
    close:()=>void
}) => {

    return(
        <>
        <DialogLayout
        open={open}
        close={close}
        allowFullScreen={true}
        >
            <div className="grid xl:grid-cols-2">

                <div>
                    <span className="title">Informacion personal</span>
                </div>

                <div>
                    <span className="title">Inicio de sesión y seguridad</span>
                </div>

            </div>
        </DialogLayout>
        </>
    )
}

export default AccountDialog;