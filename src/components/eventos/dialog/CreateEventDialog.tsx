import ButtonSubmit from "@/components/util/button/ButtonSubmit";
import DialogLayout from "@/components/util/dialog/DialogLayout";
import InputWithIcon from "@/components/util/input/InputWithIcon";
import SearchInput from "@/components/util/input/SearchInput";
import TextAreaWithMaxLength from "@/components/util/input/TextAreaWithMaxLength";
import Loading from "@/components/util/loaders/Loading";
import { successfulMessage, unexpectedError } from "@/context/config";
import { CreateEvento } from "@/core/repository/evento";
import { SearchUsersEmpresa } from "@/core/repository/users";
import useDebounce from "@/core/util/hooks/useDebounce";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";


const CreateEventDialog = ({open,close,establecimientoId,addEvento,onCreateEvento}:{
    open:boolean,
    close:()=>void
    addEvento:(e:Evento)=>void
    establecimientoId?:number 
    onCreateEvento:(e:Evento)=>void
}) =>{
    const [loading,setLoading] = useState(false)
    const [formData,setFormData] = useState({
        name_evento:"",
        description:"",
        phone_number:"",
        name:""
    })
    const [searchQuery,setSearchQuery] = useState("")
    const debouncedValue = useDebounce(searchQuery,500)
    const [confirmUserRepeat,setConfirmUserRepeat] = useState(false)
    const [loadingUsers,setLoadingUsers] = useState(false)
    const [userEmpresa,setUserEmpresa] = useState<null | UserEmpresa>(null)
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
            setFormData({...formData,name:searchQuery})
            setUsers(res)
            setLoadingUsers(false)
        }catch(err){
            setLoadingUsers(false)
        }
    }

    
    
    
    
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
                name:formData.name_evento,
                description:formData.description,
                establecimiento_id:establecimientoId
            } 
            const res:Evento = await CreateEvento(request)
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
            value={formData.name_evento}
            name="name_evento"
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

        {/* <div className="pt-3">
        <span className="title text-[17px]">Usuario para quien se realizará la reserva</span>
        <div className="pt-1 w-full relative">
        <span className="label">Nombre</span>
        <SearchInput
        value={searchQuery}
        onChange={(e)=>{
            setSearchQuery(e.target.value)
            setUserEmpresa(null)
        }}
        clear={()=>{
            setSearchQuery("")
            setUsers([])
        }}
        className="h-10 rounded-lg items-center"
        onEnter={()=>onSearch()}
        placeholder=""
        required={true}
        />
        {(loadingUsers || users.length > 0) &&
            <div className="pt-2 overflow-auto absolute bg-white z-10 w-full h-36 shadow-lg">
            <div className="flex justify-end px-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
            className="w-7 h-7 icon-button noSelect p-1" onClick={()=>setUsers([])}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
            </svg>
            </div>
            <Loading
            loading={loadingUsers}
            className="flex justify-center mt-2"
            />

            {users.map((item,idx)=>{
                return(
                    <div key={idx} className="record"
                    onClick={()=>{
                        setFormData({
                            ...formData,
                            name:item.name,
                            phone_number:item.phone_number  
                        })
                        setSearchQuery(item.name)
                        setUserEmpresa(item)
                        setUsers([])
                    }}>
                        <span className="text-xs">{item.name}</span>
                    </div>
                )
            })}
            </div>
        }

        </div>
        <InputWithIcon
        type="tel"
        label="Número de teléfono."
        value={formData.phone_number}
        name="phone_number"
        className="mb-5"
        // error={error}
        onChange={onChange}
        />    
        </div>     */}

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