import ButtonSubmit from "@/components/util/button/ButtonSubmit";
import DialogLayout from "@/components/util/dialog/DialogLayout";
import SelectComponent from "@/components/util/input/SelectCompenent";
import { successfulMessage, unexpectedError } from "@/context/config";
import { AssignBankAccount } from "@/core/repository/billing";
import { useState } from "react";
import { toast } from "react-toastify";


const AssignBankAccountToEstablecimientos = ({close,open,accounts,establecimientos}:{
    close:()=>void
    open:boolean
    accounts:AccountBank[]
    establecimientos:EstablecimientoUser[]
}) =>{
    const [formData,setFormData] = useState({
        id:"",
        establecimientoId:"",
    })
    const [loading,setLoading] = useState(false)
    const {id,establecimientoId} = formData

    const onChange = (e:React.ChangeEvent<HTMLInputElement | HTMLSelectElement>)=>{
        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        })
    }

    const onSumbit = async(e:React.FormEvent<HTMLFormElement>)=>{
        try{
            e.preventDefault()
            setLoading(true)
            const request:AssignBankAccountRequest = {
                id:Number(id),
                establecimiento_id:Number(establecimientoId)
            }
            await AssignBankAccount(request)
            toast.success(successfulMessage)
            setLoading(false) 
            // setAccountBank(res)
            close()
            // console.log(res)
        }catch(err){
            toast.error(unexpectedError)
            setLoading(false) 
            console.log(err)
        }
    }
    return(
        <>
         <DialogLayout
        close={close}
        open={open}
        // allowFullScreen={true}
        title="Nueva cuenta"
        className="max-w-lg"
        >
            <form action="" onSubmit={onSumbit}>
            <SelectComponent
                name="id"
                value={id}
                onChange={onChange}
                items={accounts.map(item=>{
                    return {value:item.id?.toString() || "0",name:item.name}
                })}
                label="Cuenta"
                />

            <SelectComponent
                name="establecimientoId"
                value={establecimientoId}
                onChange={onChange}
                items={establecimientos.map(item=>{
                    return {value:item.id.toString(),name:item.name}
                })}
                label="Establecimiento"
                />    

            <ButtonSubmit
                loading={loading}
                title="Asiganar cuenta"
                />
            </form>

        </DialogLayout>
        </>
    )
}

export default AssignBankAccountToEstablecimientos;