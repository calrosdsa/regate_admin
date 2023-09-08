"use client"
import ButtonSubmit from "@/components/util/button/ButtonSubmit"
import InputWithIcon from "@/components/util/input/InputWithIcon"
import { useAppDispatch, useAppSelector } from "@/context/reduxHooks"
import { SendResetPasswordEmail } from "@/core/repository/account"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ChangeEvent, FormEvent, useState } from "react"
import { toast } from "react-toastify"
import { isConstructorDeclaration } from "typescript"


export default function Page(){
    // const dispatch = useAppDispatch()
    // const uiState = useAppSelector(state=>state.ui)
    const router = useRouter()
    const [loading,setLoading] = useState(false)
    const [emailSended,setEmailSended] = useState(false)
    // const authtate = useAppSelector(state=>state.auth)
    const [email,setEmail] = useState("")
    const onChange = (e:ChangeEvent<HTMLInputElement>)=>{
        setEmail(e.target.value)
    //   dispatch(authActions.setErrrorLogin(undefined))
    }
    const onSubmit = async(e:FormEvent<HTMLFormElement>) =>{
      try{
        e.preventDefault()
        setLoading(true)
        const res:Response = await SendResetPasswordEmail(email)
        console.log(res)
        console.log(res.status)
        const data = await res.json()
        switch(res.status){
            case 200:
              setEmailSended(true)
            break;
            case 400:
              toast.error(data.message)
              break;
            default:
              toast.error("Se produjo un error inesperado.")
              break;
        }
        setLoading(false)
      }catch(err){
        setLoading(false)
        toast.error("Se produjo un error inesperado.")
        console.log(err)
      }
      // window.location.assign("http://localhost:3000/establecimiento/1469058c-6084-4e1e-a191-de1d5fa3b9c5/instalaciones")
    }  
  


    return(
        <div className='sm:w-[400px] bg-gray-50 p-2 py-10 rounded-lg'>
        <div className=' grid place-content-center place-items-center mb-6'>
        <Image
              src="/images/logo.png"
              height={40}
              width={100}
              priority 
              alt={'teclu-mobility'}/>
            <span className="py-4 text-lg">Restablecer su contraseña</span>
         </div>
         {emailSended ?
    <div className="border-2 bg-gray-100 rounded-lg p-2 flex flex-col justify-center">
        <p className="text-sm">Revise su correo electrónico para obtener un enlace para restablecer su contraseña. 
        Si no aparece en unos minutos, revisa tu carpeta de spam.</p>
        <span className="h-5"/>
        <button className="button" onClick={()=>router.push('/auth/login')}>
        Volver a iniciar sesión
        </button>
    </div>
    :
         <>
         <div className="border-2 bg-gray-100 rounded-lg p-2 flex flex-col justify-center">
         <p className="text-sm">Ingrese la dirección de correo electrónico verificada de su cuenta de usuario y le 
            enviaremos un enlace para restablecer su contraseña.</p>
         </div>
      <form onSubmit={onSubmit} className="flex flex-col gap-4 ">
    <div className="">
    <InputWithIcon
    placeholder="Introduce tu dirección de correo electrónico" 
    //  label='Email'
     value={email}
     name='email'
     //    error={authtate.errorLogin?.email}
     onChange={onChange}
     
     />

    </div>
    <ButtonSubmit
    title='Submit'
    loading={loading}
    />  
  </form>
    </>
}
    

      </div>
    )
}