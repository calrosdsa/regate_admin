import ButtonSubmit from "@/components/util/button/ButtonSubmit";
import DialogLayout from "@/components/util/dialog/DialogLayout";
import InputWithIcon from "@/components/util/input/InputWithIcon";
import { successfulMessage, unexpectedError } from "@/context/config";
import { UpdateUserEmpresa } from "@/core/repository/users";
import { ChangeEvent,FormEvent, useState } from "react";
import { toast } from "react-toastify";


const EditUserEmpresaDialog = ({open,close,userEmpresa,onUpdate}:{
    open:boolean
    close:()=>void
    userEmpresa:UserEmpresa
    onUpdate:(name:string,phone_number:string)=>void
}) => {
    const [loading,setLoading] = useState(false)
    const [formData,setFormData] = useState<UserEmpresa>({
        name_evento:userEmpresa.name,
        phone_number:userEmpresa.phone_number,
        id:userEmpresa.id
    })

    const onChange = (e:ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData,[e.target.name]:e.target.value})
    }

    const onSumbit = async(e:FormEvent<HTMLFormElement>) => {
        try{
            e.preventDefault()
            setLoading(true)
            await UpdateUserEmpresa(formData)
            setLoading(false)
            toast.success(successfulMessage)
            onUpdate(formData.name,formData.phone_number)
            close()
        }catch(err){
            toast.error(unexpectedError)
            setLoading(false)
        }
    }

    return(
        <div>
            <DialogLayout
            title="Editar usuario"
            open={open}
            className="max-w-sm"
            close={close}
            >
                <form onSubmit={onSumbit} className="">
                <InputWithIcon
            type="text"
            label="Nombre"
            value={formData.name}
            name="name"
            // error={error}
            onChange={onChange}
            /> 
             <InputWithIcon
            type="text"
            label="Número de teléfono"
            value={formData.phone_number}
            name="phone_number"
            onChange={onChange}
            /> 
            <ButtonSubmit
            title="Submit"
            loading={loading}
            />
                </form>
            </DialogLayout>
        </div>
    )
}

export default EditUserEmpresaDialog;