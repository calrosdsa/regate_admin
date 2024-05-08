"use client"
import ButtonSubmit from "@/components/util/button/ButtonSubmit"
import InputPassword from "@/components/util/input/InputPassword"
import InputWithIcon from "@/components/util/input/InputWithIcon"
import { API_URL } from "@/context/config"
import { ResetPassword, VerifyToken } from "@/core/repository/account"
import { Paper } from "@mui/material"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { toast } from "react-toastify"


export default function Page({params} : { params:{token:string}}){
    const router = useRouter()
    const [loading,setLoading] = useState(false)
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
      const res =await VerifyToken(params.token)
      if(res.status == 401){
          router.push("/auth/forgot-password")
      }
    }

    const onSubmit = async(e:FormEvent<HTMLFormElement>) =>{
      try{
        e.preventDefault()
        setLoading(true)
        const data = {
          password:password
        }
        await ResetPassword(data,params.token)
        toast.success("Nueva contraseña establecida correctamente.")
        router.push("/auth/login")

        setLoading(false)
      }catch(err){
        setLoading(false)
      }
      // window.location.assign("http://localhost:3000/establecimiento/1469058c-6084-4e1e-a191-de1d5fa3b9c5/instalaciones")
    }  

    useEffect(()=>{
      verifyEmail()
    },[])
  

    return(
      <Paper elevation={2}>
        <div className='sm:w-[400px] p-2 py-10 rounded-lg'>
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
        name='confirmPassword'
        onChange={onChange}
    //    error={authtate.errorLogin?.password}
        className='pt-2'
        /> 
    
    </div>
  
    <ButtonSubmit
    title='Submit'
    loading={loading}
    /> 
  
     
  </form>
      </div>
      </Paper>
    )
}