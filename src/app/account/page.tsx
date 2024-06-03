"use client"

import EditComponent from "@/presentation/util/input/EditComponent";
import UpdatePasswordComponent from "@/presentation/util/input/UpdatePasswordComponent";
import Loader from "@/presentation/util/loaders/Loader";
import { GetAccount } from "@/core/repository/account";
import { Divider, IconButton, Typography } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
const Page = () =>{
    const [account,setAccount] = useState<User | undefined>(undefined)
    const [loadingAccount,setLoadingAccount] = useState(false)

    const getAccount = async()=>{
        try{
            setLoadingAccount(true)
            const res = await GetAccount()
            setAccount(res)
            setLoadingAccount(false)
        }catch(err){
            setLoadingAccount(false)
        }
    }

    const updateAccount = async(name:string,value:string,addLoader:()=>void,removeLoader:()=>void) =>{
        
    }

    useEffect(()=>{
        if(account == undefined){
            getAccount()
        }
    },[])

    return(
        <>
        <div className="max-w-6xl mx-auto p-3">
            <IconButton sx={{mb:1}} onClick={()=>{
            if(window != undefined){
                window.history.back()
            }
        }}>
                <ArrowBackIcon/>
            </IconButton>
            <Divider/>
            <Typography variant="h5" className="py-3">Cuenta</Typography>

        <div className="grid sm:grid-cols-2 gap-x-10">


                <div className="flex flex-col gap-y-2">
                    <Typography variant="h6">Información personal</Typography>
                    {loadingAccount &&
                    <Loader className=" flex justify-center w-full pt-10"/>
                    }
                    {account != undefined &&
                   <>
                    <EditComponent
                    label='Username'
                    content={account.username}
                    edit={(addLoader,removeLoader,e)=>updateAccount("name",e,addLoader,removeLoader)}
                    enableEdit={false}
                    />
                    <EditComponent
                    label='Email'
                    type='email'
                    enableEdit={false}
                    content={account.email}
                    edit={(addLoader,removeLoader,e)=>updateAccount("email",e,addLoader,removeLoader)}
                    />

                    {/* <EditComponent
                    label='Número de Telefono'
                    content={account.phone || ""}
                    type='tel'
                    enableEdit={false}
                    edit={(addLoader,removeLoader,e)=>updateAccount("phone_number",e,addLoader,removeLoader)}
                    /> */}
                    </>     
                   }
                </div>

                <div className="flex flex-col gap-y-2">
                    <Typography variant="h6">Inicio de sesión y seguridad</Typography>

                    {loadingAccount &&
                    <Loader className=" flex justify-center w-full pt-10"/>
                }

                    {account != undefined &&
                   <>
                    <UpdatePasswordComponent
                    last_updated_password={account.last_updated_password}
                    />
                    <EditComponent
                    label='Último inicio de sesión'
                    type='email'
                    enableEdit={false}
                    content={account.last_login != null ? moment(account.last_login).utc().format('LLLL'):""}
                    />

                    </>     
                   }
                </div>

            </div>
            </div>
        </>
    )
}

export default Page;