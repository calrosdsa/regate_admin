

import ButtonWithLoader from "@/components/util/button/ButtonWithLoader"
import ConfirmationDialog from "@/components/util/dialog/ConfirmationDialog"
import DialogLayout from "@/components/util/dialog/DialogLayout"
import InputWithIcon from "@/components/util/input/InputWithIcon"
import SearchInput from "@/components/util/input/SearchInput"
import { unexpectedError } from "@/context/config"
import { GetUsersEmpresa } from "@/core/repository/manage"
import { CancelReserva } from "@/core/repository/reservas"
import { SearchUsersEmpresa } from "@/core/repository/users"
import { useState } from "react"
import { toast } from "react-toastify"


const SearchUserDialog = ({open,close}:{
    open:boolean
    close:()=>void
}) =>{
    const [openConfirmationDialog,setOpenConfirmationDialog] = useState(false)
    const [searchQuery,setSearchQuery] = useState("")
    const [users,setUsers] = useState<UserEmpresa[]>([])
    const onSearch = async() =>{
        try{
            const res = await SearchUsersEmpresa(searchQuery)
            setUsers(res)
        }catch(err){
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
            // cancelarReserva()
        }}
        />
        }
        <DialogLayout
        open={open}
        close={close}
        title="Cancelar Reserva"
        className=" max-w-lg"
        allowFullScreen={true}
        >
            <div className="pt-1">
            <div className="pt-2 w-full">
            <SearchInput
            value={searchQuery}
            onChange={(e)=>setSearchQuery(e.target.value)}
            clear={()=>{}}
            onEnter={()=>onSearch()}
            placeholder="Buscar por nombre"
            />
            {JSON.stringify(users)}
            </div>
            </div>
        </DialogLayout>
        </>
    )
}

export default SearchUserDialog;