import ButtonSubmit from "@/presentation/util/button/ButtonSubmit";
import DialogLayout from "@/presentation/util/dialog/DialogLayout";
import SelectComponent from "@/presentation/util/input/SelectCompenent";
import { successfulMessage, unexpectedError } from "@/context/config";
import { AddEstablecimientoUser } from "@/core/repository/manage";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";


const AddEstablecimientoUserDialog = ({open,close,establecimientosUser,currentUserUuid,updateCurrentList}:{
    open:boolean
    close:()=>void
    establecimientosUser:EstablecimientoUser[]
    currentUserUuid:string
    updateCurrentList:(e:EstablecimientoUser)=>void
}) =>{
    const [loading,setLoading] = useState(false)
    const [selectedEstablecimientoId,setSelectedEstablecimientoId] = useState("")

    const onSubmit = async(e:FormEvent<HTMLFormElement>) =>{
        try{
            e.preventDefault()
            setLoading(true)
            const eId = Number(selectedEstablecimientoId)
            if(eId != 0){
                const c = establecimientosUser.find(item=>item.id == eId)
                if(c != undefined){
                    c.admin_id = currentUserUuid
                    await AddEstablecimientoUser(c)
                    updateCurrentList(c)
                    toast.success(successfulMessage)
                }
            }
            close()
            setLoading(false)
        }catch(err){
            toast.error(unexpectedError)
            setLoading(false)
        }
    }

    return(
        <DialogLayout
        open={open}
        close={close}
        className=" max-w-sm"
        title="Asignar establecimiento"
        >
            <form onSubmit={onSubmit}>
                <SelectComponent
                value={selectedEstablecimientoId}
                onChange={(e)=>setSelectedEstablecimientoId(e.target.value)}
                items={establecimientosUser.map((item)=>{
                    return {value:item.id.toString(),name:item.name}
                })}
                required={true}
                name="establecimiento"
                label="Establecimientos"
                />
                <ButtonSubmit
                title="Asignar"
                loading={loading}
                />
            </form>
        </DialogLayout>
    )
}

export default AddEstablecimientoUserDialog;