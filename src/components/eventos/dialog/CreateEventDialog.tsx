import ButtonSubmit from "@/components/util/button/ButtonSubmit";
import DialogLayout from "@/components/util/dialog/DialogLayout";
import InputWithIcon from "@/components/util/input/InputWithIcon";
import TextAreaWithMaxLength from "@/components/util/input/TextAreaWithMaxLength";
import { successfulMessage, unexpectedError } from "@/context/config";
import { CreateEvento } from "@/core/repository/evento";
import { CreateEventoRequest, Evento, EventoPaginationResponse } from "@/core/type/evento";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "react-toastify";


const CreateEventDialog = ({open,close,establecimientoId,addEvento}:{
    open:boolean,
    close:()=>void
    addEvento:(e:Evento)=>void
    establecimientoId?:number 
}) =>{
    const [loading,setLoading] = useState(false)
    const [formData,setFormData] = useState({
        name:"",
        description:"",
    })

    const onChange = (e:ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData,[e.target.name]:e.target.value})
    }
    const onChangeTextArea = (e:ChangeEvent<HTMLTextAreaElement>) => {
        setFormData({...formData,[e.target.name]:e.target.value})
    }

    const onSumbit = async(e:FormEvent<HTMLFormElement>) => {
        try{
            e.preventDefault()
            if(establecimientoId == undefined) return 
            setLoading(true)
            const request:CreateEventoRequest = {
                name:formData.name,
                description:formData.description,
                establecimiento_id:establecimientoId
            } 
            console.log(request,"DATA")
            const res:Evento = await CreateEvento(request)
            addEvento(res)
            setLoading(false)
            toast.success(successfulMessage)
            // onUpdate(formData.name,formData.phone_numberx)
            close()
        }catch(err){
            toast.error(unexpectedError)
            setLoading(false)
            console.log(err)
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
             <TextAreaWithMaxLength
            label="Descripción"
            value={formData.description}
            name="description"
            onChangeValue={onChangeTextArea}
            max={255}
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

export default CreateEventDialog;