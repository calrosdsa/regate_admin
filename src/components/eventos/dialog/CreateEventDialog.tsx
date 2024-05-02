import ButtonSubmit from "@/components/util/button/ButtonSubmit";
import DialogLayout from "@/components/util/dialog/DialogLayout";
import AutocompleteMui from "@/components/util/input/AutocompleteMui";
import InputWithIcon from "@/components/util/input/InputWithIcon";
import SearchInput from "@/components/util/input/SearchInput";
import TextAreaWithMaxLength from "@/components/util/input/TextAreaWithMaxLength";
import Loading from "@/components/util/loaders/Loading";
import { successfulMessage, unexpectedError } from "@/context/config";
import { CreateEvento } from "@/core/repository/evento";
import { SearchUsersEmpresa } from "@/core/repository/users";
import useDebounce from "@/core/util/hooks/useDebounce";
import { Typography } from "@mui/material";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";


const CreateEventDialog = ({open,close,establecimientoId,addEvento,onCreateEvento}:{
    open:boolean,
    close:()=>void
    addEvento:(e:Evento)=>void
    establecimientoId:number 
    onCreateEvento:(e:Evento)=>void
}) =>{
    const [loading,setLoading] = useState(false)
    const [formData,setFormData] = useState<CreateEventoRequest>({
        name:"",
        description:"",
        establecimiento_id:establecimientoId,
        user_empresa:{
            id:0,
            name:"",
            phone_number:""
        }
    })
    const [searchQuery,setSearchQuery] = useState("")
    const debouncedValue = useDebounce(searchQuery,500)
    const [confirmUserRepeat,setConfirmUserRepeat] = useState(false)
    const [loadingUsers,setLoadingUsers] = useState(false)
   
    const [users,setUsers] = useState<UserEmpresa[]>([])
    const { name } = formData

    const onSearch = async() =>{
        try{
            if(name == searchQuery) return
            if(searchQuery == "") {
                setUsers([])
                return
            }
            setUsers([])
            setLoadingUsers(true)
            const q = searchQuery.trim().replaceAll(/\s+/g,":* & ") + ":*"
            const res = await SearchUsersEmpresa(q)
            setFormData({
                ...formData,
                user_empresa:{
                    ...formData.user_empresa,
                    name:searchQuery
                }
            })
            setUsers(res)
            setLoadingUsers(false)
        }catch(err){
            setLoadingUsers(false)
        }
    }

    
    
    
    
    const onChange = (e:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({...formData,[e.target.name]:e.target.value})
    }
  
    const onSumbit = async(e:FormEvent<HTMLFormElement>) => {
        try{
            e.preventDefault()
            if(establecimientoId == undefined) return 
            setLoading(true)
            // const request:CreateEventoRequest = {
            //     name:formData.name,
            //     description:formData.description,
            //     establecimiento_id:establecimientoId,
            //     user_empresa:userEmpresa
            // } 
            const res:Evento = await CreateEvento(formData)
            addEvento(res)
            setLoading(false)
            toast.success(successfulMessage)
            // onUpdate(formData.name,formData.phone_numberx)
            close()
            onCreateEvento(res)
        }catch(err){
            toast.error(unexpectedError)
            setLoading(false)
        }
    }
    useEffect(() => {
        onSearch()
        // Do fetch here...
        // Triggers when "debouncedValue" changes
      }, [debouncedValue])
    return(
        <div>
            <DialogLayout
            title="Crear Evento"
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
                label="Descripción"
                value={formData.description}
                name="description"
                onChange={onChange}
                multiline={true}
                /> 

        <div className="pt-3">
        <span className="title text-[17px]">Usuario para quien se realizará la reserva</span>
        <div className="pt-1 w-full relative">
        <AutocompleteMui
        label="Nombre"
        options={users}
        loading={loadingUsers}
        setQuery={(e)=>{
            setSearchQuery(e)
            
        }}
        query={searchQuery}
        onSelect={(e)=>{
            console.log(e)
            if(e == null) return
            setFormData({
                ...formData,
                user_empresa:e
            })
            setSearchQuery(e.name)
            setUsers([])
        }}
        value={formData.user_empresa}
        />
        

        </div>
        <InputWithIcon
        type="tel"
        label="Número de teléfono."
        value={formData.user_empresa.phone_number}
        name="phone_number"
        // error={error}
        onChange={(e)=>setFormData({
            ...formData,
            user_empresa:{
                ...formData.user_empresa,
                phone_number:e.target.value
            }
        })}
        />    
        </div>    

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