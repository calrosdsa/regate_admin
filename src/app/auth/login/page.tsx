"use client"
import ButtonSubmit from "@/presentation/util/button/ButtonSubmit";
import InputWithIcon from "@/presentation/util/input/InputWithIcon";
import InputPassword from "@/presentation/util/input/InputPassword";
import { login } from "@/context/actions/account-actions";
import { useAppDispatch, useAppSelector } from "@/context/reduxHooks";
import Image from "next/image";
import { ChangeEvent, FormEvent, useState } from "react";
import MailIcon from '@mui/icons-material/Mail';
import Link from "next/link";
import { Paper, Typography } from "@mui/material";
const Login = () =>{
    const dispatch = useAppDispatch()
    const uiState = useAppSelector(state=>state.ui)
    // const authtate = useAppSelector(state=>state.auth)
    const [formData,setFormData ] = useState({
      email:"",
      password:""
    })
    const {email,password} = formData
    const onChange = (e:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)=>{
    //   dispatch(authActions.setErrrorLogin(undefined))
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
    const onSubmit = async(e:FormEvent<HTMLFormElement>) =>{
      try{
        e.preventDefault()
        dispatch(login(email.trim(),password.trim()))
        // window.location.assign("/admin/establecimientos")
      }catch(err){
      }
      // window.location.assign("http://localhost:3000/establecimiento/1469058c-6084-4e1e-a191-de1d5fa3b9c5/instalaciones")
    }  
  

    return(
          <Paper elevation={2}>
        <div className='sm:w-[400px] shadow-md p-2 py-10 rounded-lg'>

      <div className=' grid place-content-center mb-10'>
      <Image
            src="/images/logo.png"
            height={40}
            width={100}
            priority 
            alt={'teclu-mobility'}/>
       </div>
    <form onSubmit={onSubmit} className="flex flex-col gap-4 ">
  <div className="">
  <InputWithIcon
   label='Email'
   value={email}
   name='email'
   size="small"
   //    error={authtate.errorLogin?.email}
   onChange={onChange}
   Icon={MailIcon}
   />
  
   <InputPassword
   label='Contraseña'
   password={password}
   name='password'
   size="small"
   onChange={onChange}
//    error={authtate.errorLogin?.password}
   className=''
   />
  </div>
  <Link href={`/auth/forgot-password`} className="labelText flex justify-end cursor-pointer">
    <Typography variant="body2">
    ¿Olvidaste tu contraseña?
    </Typography>
    </Link>

  <ButtonSubmit
  title='Submit'
  loading={uiState.innerLoading}
  /> 

   
</form>
    </div>
   </Paper>
    )
}
export default Login;