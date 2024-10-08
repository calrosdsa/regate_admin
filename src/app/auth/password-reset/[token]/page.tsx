"use client"
import ButtonSubmit from "@/presentation/util/button/ButtonSubmit"
import InputPassword from "@/presentation/util/input/InputPassword"
import InputWithIcon from "@/presentation/util/input/InputWithIcon"
import { API_URL } from "@/context/config"
import { Paper } from "@mui/material"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { toast } from "react-toastify"
import { accountRepository } from "@/data/repository"


export default function Page({params} : { params:{token:string}}){
    const router = useRouter()
    const accountRepo = accountRepository
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
    const verifyToken = async()=>{
      const res =await accountRepo.VerifyToken(params.token)
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
        await accountRepo.ResetPassword(data,params.token)
        toast.success("Nueva contraseña establecida correctamente.")
        router.push("/auth/login")

        setLoading(false)
      }catch(err){
        setLoading(false)
      }
      // window.location.assign("http://localhost:3000/establecimiento/1469058c-6084-4e1e-a191-de1d5fa3b9c5/instalaciones")
    }  

    useEffect(()=>{
      verifyToken()
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