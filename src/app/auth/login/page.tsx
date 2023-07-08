"use client"
import ButtonSubmit from "@/components/util/button/ButtonSubmit";
import InputWithIcon from "@/components/util/input/InputWithIcon";
import InputPassword from "@/components/util/input/InputPassword";
import { login } from "@/context/actions/account-actions";
import { useAppDispatch, useAppSelector } from "@/context/reduxHooks";
import { uiActions } from "@/context/slices/uiSlice";
import axios from "axios";
import Image from "next/image";
import { ChangeEvent, FormEvent, useState } from "react";
const Login = () =>{
    const dispatch = useAppDispatch()
    const uiState = useAppSelector(state=>state.ui)
    // const authtate = useAppSelector(state=>state.auth)
    const [formData,setFormData ] = useState({
      email:"jorge@gmail.com",
      password:"12ab34cd56ef"
    })
    const [showPassword,setShowPassword] = useState(false)
    const {email,password} = formData
    const onChange = (e:ChangeEvent<HTMLInputElement>)=>{
    //   dispatch(authActions.setErrrorLogin(undefined))
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
    const onSubmit = async(e:FormEvent<HTMLFormElement>) =>{
        e.preventDefault()
      dispatch(login(email,password))
      window.location.assign("http://localhost:3000/establecimiento/48cadbda-2c81-46de-88a7-ca760d399828/instalaciones")
    }  
  

    return(
        <div className='sm:w-[400px] bg-gray-50 p-2 py-10 rounded-lg'>
      <div className=' grid place-content-center mb-10'>
      <Image
            src="/images/logo.png"
            height={40}
            width={100}
            priority 
            alt={'teclu-mobility'}/>
       </div>
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
  <div>
  <InputWithIcon
   label='Email'
   value={email}
   name='email'
//    error={authtate.errorLogin?.email}
   onChange={onChange}
   icon={()=>{
    return(
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
      className="w-5 h-5 absolute bottom-[10px] left-[5px] text-gray-400">
   <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
 </svg>
  )}}
  />
  
   <InputPassword
   label='Contraseña'
   password={password}
   name='password'
   onChange={onChange}
//    error={authtate.errorLogin?.password}
   className='pt-2'
   />
  </div>
  <ButtonSubmit
  title='Submit'
  loading={uiState.innerLoading}
  /> 

   
</form>
    </div>
    )
}
export default Login;