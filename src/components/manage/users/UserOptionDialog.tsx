import ConfirmationDialog from "@/components/util/dialog/ConfirmationDialog"
import DialogLayout from "@/components/util/dialog/DialogLayout"
import { UserEstado } from "@/core/type/enums"
import { useState } from 'react'


const UserOptionDialog = ({close,open,changeUserEstado,user}:{
    close:()=>void
    open:boolean
    user:User
    changeUserEstado:(estado:UserEstado)=>void
}) =>{
    const [openConfirmationDialog,setOpenConfirmationDialog] = useState(false)
    const [currentUserEstado,setCurrentUserEstado] = useState<UserEstado | null>(null)

    const selectUserEstado = (estado:UserEstado) => {
        setCurrentUserEstado(estado)
        setOpenConfirmationDialog(true)
    }
    const getMessage = (estado:UserEstado | null) =>{
        switch(estado){
            case UserEstado.ENABLED:
                return `La cuenta del usuario ${user.username} será habilitada.`
            case UserEstado.DISABLED:
                return `La cuenta del usuario ${user.username} será deshabilitada.`
            case UserEstado.DELETED:
                return `La cuenta del usuario ${user.username} será eliminada`
            default:
                return ""
        }
    }
    return(
        <>
        {openConfirmationDialog&&
        <ConfirmationDialog
        open={openConfirmationDialog}
        description={`${getMessage(currentUserEstado )}`}
        close={()=>setOpenConfirmationDialog(false)}
        performAction={()=>{
            if(currentUserEstado != null){
                changeUserEstado(currentUserEstado)
            }
            setOpenConfirmationDialog(false)
        }}
        />
        }
        <DialogLayout
        close={close}   
        open={open}
        className="max-w-sm"
        >
            <div className="w-full flex flex-col">
                <button disabled={user.estado == UserEstado.ENABLED}
                onClick={()=>selectUserEstado(UserEstado.ENABLED)}
                className={`p-2 border-b-[1px] cursor-pointer hover:bg-gray-200
                ${user.estado == UserEstado.ENABLED && "disabled"}`}>Habilitar usuario</button>
                <button disabled={user.estado == UserEstado.DISABLED}
                 onClick={()=>selectUserEstado(UserEstado.DISABLED)}
                className={`p-2 border-b-[1px] cursor-pointer hover:bg-gray-200
                ${user.estado == UserEstado.DISABLED && "disabled"}`}>Deshabilitar usuario</button>
                <button disabled={user.estado == UserEstado.DELETED}
                onClick={()=>selectUserEstado(UserEstado.DELETED)}
                className="p-2 border-b-[1px] cursor-pointer hover:bg-gray-200">Eliminar usuario</button>
                {/* {user.last_login == null &&
                    <button className="p-2 border-b-[1px] cursor-pointer hover:bg-gray-200">Reenviar email</button>
                } */}
            </div>
        </DialogLayout>
        </>
    )
}

export default UserOptionDialog;