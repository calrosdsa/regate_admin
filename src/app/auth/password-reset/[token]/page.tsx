"use client"
import ButtonSubmit from "@/components/util/button/ButtonSubmit"
import InputPassword from "@/components/util/input/InputPassword"
import InputWithIcon from "@/components/util/input/InputWithIcon"
import { API_URL } from "@/context/config"
import { VerifyToken } from "@/core/repository/account"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChangeEvent, FormEvent, useEffect, useState } from "react"


export default function Page({params} : { params:{token:string}}){
    // const dispatch = useAppDispatch()
    // const uiState = useAppSelector(state=>state.ui)
    // const authtate = useAppSelector(state=>state.auth)
    const router = useRouter()
    const [formData,setFormData ] = useState({
      password:"",
      confirmPassword:""
    })
    const {confirmPassword,password} = formData
    const onChange = (e:ChangeEvent<HTMLInputElement>)=>{
    //   dispatch(authActions.setErrrorLogin(undefined))
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
    const verifyEmail = async()=>{
      const res = await fetch(`${API_URL}/account/admin/verify-token/`,{
        headers:{
          'Authorization':`Bearer ${params.token}`
        }
      })  
      console.log(res.status,"STATUS")
      if(res.status == 401){
          router.push("/auth/forgot-password")
          console.log("EXPIRADO")
      }else{
          console.log("VALID")
      }
    }

    const onSubmit = async(e:FormEvent<HTMLFormElement>) =>{
      try{
        e.preventDefault()
        // dispatch(login(email.trim(),password.trim()))
        // window.location.assign("/admin/establecimientos")
      }catch(err){
        console.log(err)
      }
      // window.location.assign("http://localhost:3000/establecimiento/1469058c-6084-4e1e-a191-de1d5fa3b9c5/instalaciones")
    }  

    useEffect(()=>{
      verifyEmail()
    },[])
  

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
      <form onSubmit={onSubmit} className="flex flex-col gap-4 ">
    <div className="">
        <InputPassword
        label='Contraseña'
        password={password}
        name='password'
        onChange={onChange}
        //    error={authtate.errorLogin?.password}
        className='pt-2'
        />
        <InputPassword
        label='Confirmar contraseña'
        password={confirmPassword}
        name='confirm_password'
        onChange={onChange}
    //    error={authtate.errorLogin?.password}
        className='pt-2'
        /> 
    
    </div>
  
    <ButtonSubmit
    title='Submit'
    loading={false}
    /> 
  
     
  </form>
      </div>
    )
}