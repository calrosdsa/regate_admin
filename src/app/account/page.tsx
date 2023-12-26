"use client"

import EditComponent from "@/components/util/input/EditComponent";
import UpdatePasswordComponent from "@/components/util/input/UpdatePasswordComponent";
import Loader from "@/components/util/loaders/Loader";
import { GetAccount } from "@/core/repository/account";
import moment from "moment";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

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
         <ToastContainer
            position='bottom-center'
        />
        <div className="grid sm:grid-cols-2 p-3 max-w-6xl mx-auto gap-x-10">
            <span className="title text-2xl col-span-full pb-5 pt-3">Cuenta</span>

                <div className="flex flex-col gap-y-2">
                    <span className="title text-xl">Información personal</span>
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

                    <EditComponent
                    label='Número de Telefono'
                    content={account.phone || ""}
                    type='tel'
                    enableEdit={false}
                    edit={(addLoader,removeLoader,e)=>updateAccount("phone_number",e,addLoader,removeLoader)}
                    />
                    </>     
                   }
                </div>

                <div className="flex flex-col gap-y-2">
                    <span className="title text-xl">Inicio de sesión y seguridad</span>

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
                    edit={(addLoader,removeLoader,e)=>updateAccount("email",e,addLoader,removeLoader)}
                    />

                    </>     
                   }
                </div>

            </div>
        </>
    )
}

export default Page;