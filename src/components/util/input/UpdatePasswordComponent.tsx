
import {useState} from "react"
import ButtonWithLoader from "../button/ButtonWithLoader"
import { Transition } from "@headlessui/react"
import ButtonSubmit from "../button/ButtonSubmit"
import moment from "moment"
import { UpdatePassword } from "@/core/repository/account"
import { toast } from "react-toastify"
import { successfulMessage, unexpectedError } from "@/context/config"
import { Button, TextField, Typography } from "@mui/material"

const UpdatePasswordComponent = ({
    last_updated_password
}:{
    last_updated_password?:string
}) =>{
    const [formData,setFormData] = useState({
        currentPassword:"",
        newPassword:"",
        newPasswordConfirm:"",
    })
    const {currentPassword,newPassword,newPasswordConfirm} = formData
    const [show,setShow] = useState(false)
    const [loading,setLoading] = useState(false)

    const onChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        })
    }

    const onSubmit = async(e:React.FormEvent<HTMLFormElement>)=>{
        try{
            setLoading(true)
            e.preventDefault()
            const request:PasswordUpdateRequest = {
                current_password:currentPassword,
                new_password:newPassword
            }
            const res:Response = await UpdatePassword(request)
            const data = await res.json()
            switch(res.status){
                case 400:
                    toast.error(data.message)
                    break;
                case 200:
                    toast.success(successfulMessage)
                    break;
                default:
                    toast.info(unexpectedError)    
            }
            setLoading(false)
        }catch(err){
            toast.error(unexpectedError)
        }
    }

    return (
        <div>
        <div className=" flex justify-between items-center space-x-5 py-3 divider">
           <div className="grid">
           <Typography fontWeight={500} fontSize={16.5}>Contraseña</Typography>
           <Typography variant="subtitle1" >{last_updated_password != undefined ? moment(last_updated_password).utc().format('LLLL'):""}</Typography>
               {/* <span className="text-sm">{last_updated_password != undefined ? moment(last_updated_password).utc().format('LLLL'):""}</span> */}
           </div>
           <Button onClick={()=>setShow(!show)} color="inherit">Actualizar</Button>
       </div>
       <Transition
       show={show}
       enter="transition ease-out duration-100"
       enterFrom="transform opacity-0 scale-95"
       enterTo="transform opacity-100 scale-100"
       leave="transition ease-in duration-75"
       leaveFrom="transform opacity-100 scale-100"
       leaveTo="transform opacity-0 scale-95"
       >

        <form onSubmit={onSubmit} className="grid gap-y-3 mt-3">
                <TextField
                size="small"
                label="Contraseña actual"
                id="currentPassword"
                required
                sx={{width:"100%"}}
                type='password' 
                name="currentPassword"
                value={currentPassword} 
                onChange={onChange}
                />
               
                <TextField
                size="small"
                label="Nueva contraseña"
                id="newPassword"
                type='password' 
                name="newPassword"
                value={newPassword} 
                onChange={onChange}
                required
                sx={{width:"100%"}}
                />

                <TextField
                size="small"
                label="Repetir nueva contraseña"
                id="newPasswordConfirm"
                type='password' 
                name="newPasswordConfirm"
                className="input"
                value={newPasswordConfirm} 
                onChange={onChange}
                required
                sx={{width:"100%"}}
                />

                <ButtonSubmit
                loading={loading}
                title="Actualizar contraseña"
                />

           </form>
         
       </Transition>
   </div>
    )
}

export default UpdatePasswordComponent;