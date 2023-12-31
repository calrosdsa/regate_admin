
import {useState} from "react"
import ButtonWithLoader from "../button/ButtonWithLoader"
import { Transition } from "@headlessui/react"
import ButtonSubmit from "../button/ButtonSubmit"
import moment from "moment"
import { UpdatePassword } from "@/core/repository/account"
import { toast } from "react-toastify"
import { successfulMessage, unexpectedError } from "@/context/config"

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
               <span className="label">Contraseña</span>
               <span className="text-sm">{last_updated_password != undefined ? moment(last_updated_password).utc().format('LLLL'):""}</span>
           </div>
            <span onClick={()=>setShow(!show)} className=" underline font-medium cursor-pointer">Actualizar</span>
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

        <form onSubmit={onSubmit} className="grid gap-y-3">
            <div >
            <label className="label"
            htmlFor="currentPassword">Contraseña actual</label>
           <input 
            id="currentPassword"
            type='password' name="currentPassword"
            className="input"
            value={currentPassword} 
            onChange={onChange}
            />
            </div>

            <div >
            <label className="label"
            htmlFor="newPassword">Nueva contraseña</label>
           <input 
            id="newPassword"
            type='password' name="newPassword"
            className="input"
            value={newPassword} 
            onChange={onChange}
            />
            </div>

            <div >
            <label className="label"
            htmlFor="newPasswordConfirm">Repetir nueva contraseña</label>
           <input 
            id="newPasswordConfirm"
            type='password' name="newPasswordConfirm"
            className="input"
            value={newPasswordConfirm} 
            onChange={onChange}
            />
            </div>

           <ButtonSubmit
           loading={loading}
           title="Actualizar contraseña"
           />

           </form>
         {/* <ButtonWithLoader
         onClick={()=>edit(()=>setLoading(true),()=>{
           setLoading(false)
           setShow(false)
       },value)}
         title="Guardar"
         loading={loading}
         className="mt-2 w-28"
         /> */}
         {/* <button onClick={()=>edit(()=>setLoading(true),()=>setLoading(false),value)} */}
          {/* className=" button">Guardar Cambios</button> */}
       </Transition>
   </div>
    )
}

export default UpdatePasswordComponent;