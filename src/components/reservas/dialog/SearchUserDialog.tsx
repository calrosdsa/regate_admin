

import ButtonWithLoader from "@/components/util/button/ButtonWithLoader"
import ConfirmationDialog from "@/components/util/dialog/ConfirmationDialog"
import DialogLayout from "@/components/util/dialog/DialogLayout"
import CommonImage from "@/components/util/image/CommonImage"
import InputWithIcon from "@/components/util/input/InputWithIcon"
import SearchInput from "@/components/util/input/SearchInput"
import Loading from "@/components/util/loaders/Loading"
import { unexpectedError } from "@/context/config"
import { GetUsersEmpresa } from "@/core/repository/manage"
import { CancelReserva } from "@/core/repository/reservas"
import { SearchUsersEmpresa } from "@/core/repository/users"
import useDebounce from "@/core/util/hooks/useDebounce"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"


const SearchUserDialog = ({open,close,selectUserEmpresa}:{
    open:boolean
    close:()=>void
    selectUserEmpresa:(user:UserEmpresa)=>void
}) =>{
    const [openConfirmationDialog,setOpenConfirmationDialog] = useState(false)
    const [searchQuery,setSearchQuery] = useState("")
    const [loading,setLoading] = useState(false)
    const [users,setUsers] = useState<UserEmpresa[]>([])
    const debouncedValue = useDebounce(searchQuery,1000)
    const onSearch = async() =>{
        try{
            if(searchQuery == "") return
            setUsers([])
            setLoading(true)
            const q = searchQuery.trim().replaceAll(/\s+/g,":* & ") + ":*"
            const res = await SearchUsersEmpresa(q)
            setUsers(res)
            setLoading(false)
        }catch(err){
            setLoading(false)
        }
    }

    useEffect(() => {
        onSearch()
        // Do fetch here...
        // Triggers when "debouncedValue" changes
      }, [debouncedValue])
  
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
            clear={()=>{
                setSearchQuery("")
                setUsers([])
            }}
            onEnter={()=>onSearch()}
            placeholder="Buscar por nombre"
            />
            <div className="mt-2 overflow-auto relative sm:h-[70vh]">
            {searchQuery != "" &&
                <span className="italic text-sm  text-gray-600">Pulse intro para filtrar por prefijo:{searchQuery}</span>
            }
                <Loading
                loading={loading}
                className="flex justify-center mt-2"
                />
            {users.map((item,idx)=>{
                return(
                    <div key={idx} className="record"
                    onClick={()=>selectUserEmpresa(item)}>
                        <span className="">{item.name}</span>
                    </div>
                )
            })}

            </div>
            </div>

            </div>
        </DialogLayout>
        </>
    )
}

export default SearchUserDialog;