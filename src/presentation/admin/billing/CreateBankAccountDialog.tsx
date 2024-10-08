import ButtonSubmit from "@/presentation/util/button/ButtonSubmit";
import DialogLayout from "@/presentation/util/dialog/DialogLayout";
import InputWithIcon from "@/presentation/util/input/InputWithIcon";
import SelectComponent from "@/presentation/util/input/SelectCompenent";
import { successfulMessage, unexpectedError } from "@/context/config";
import { CreateBankAccount } from "@/core/repository/billing";
import React, { useState } from "react";
import { toast } from "react-toastify";


const CreateBankAccountDialog = ({close,open,items,setAccountBank}:{
    close:()=>void
    open:boolean
    items:Bank[]
    setAccountBank:(e:AccountBank)=>void
}) =>{
    const [formData,setFormData] = useState({
        name_evento:"",
        account_number:"",
        account_name:"",
        bank_id:""
    })
    const [loading,setLoading] = useState(false)
    const {name,account_name,account_number,bank_id} = formData

    const onChange = (e:React.ChangeEvent<HTMLInputElement | HTMLSelectElement>)=>{
        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        })
    }

    const onSumbit = async(e:React.FormEvent<HTMLFormElement>)=>{
        try{
            setLoading(true)
            e.preventDefault()
            const requestData:AccountBank = {
                name:name,
                account_name:account_name,
                account_number:account_number,
                bank_id:Number(bank_id)
            }
            const res:AccountBank = await CreateBankAccount(requestData)
            toast.success(successfulMessage)
            setLoading(false) 
            setAccountBank(res)
            close()
        }catch(err){
            toast.error(unexpectedError)
            setLoading(false) 
        }
    }

    return (
        <>
        <DialogLayout
        close={close}
        open={open}
        // allowFullScreen={true}
        title="Nueva cuenta"
        className="max-w-lg"
        >
            <form onSubmit={onSumbit} className="">
                <InputWithIcon
                name="name"
                value={name}
                onChange={onChange}
                label="Nombre de la cuenta"
                />
                <InputWithIcon
                name="account_number"
                value={account_number}
                onChange={onChange}
                label="Número de cuenta"
                />
                <InputWithIcon
                name="account_name"
                value={account_name}
                onChange={onChange}
                label="Nombre del usuario de la cuenta"
                />

                <SelectComponent
                name="bank_id"
                value={bank_id}
                onChange={onChange}
                items={items.map(item=>{
                    return {value:item.id.toString(),name:item.name}
                })}
                label="Institucion bancario"
                />

                <ButtonSubmit
                loading={loading}
                title="Crear cuenta"
                />
            </form>
        </DialogLayout>
        </>
    )
}

export default CreateBankAccountDialog;