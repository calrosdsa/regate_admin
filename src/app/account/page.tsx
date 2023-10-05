"use client"

import EditComponent from "@/components/util/input/EditComponent";
import UpdatePassword from "@/components/util/input/UpdatePassword";
import { GetAccount } from "@/core/repository/account";
import moment from "moment";
import { useEffect, useState } from "react";

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
            console.log(err)
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
        <div>
        <div className="grid sm:grid-cols-2 p-3 max-w-6xl mx-auto gap-x-10">
            <span className="title text-2xl col-span-full pb-5 pt-3">Cuenta</span>

                <div className="flex flex-col gap-y-2">
                    <span className="title text-xl">Información personal</span>
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
                    edit={(addLoader,removeLoader,e)=>updateAccount("phone_number",e,addLoader,removeLoader)}
                    />
                    </>     
                   }
                </div>

                <div className="flex flex-col gap-y-2">
                    <span className="title text-xl">Inicio de sesión y seguridad</span>

                    {account != undefined &&
                   <>
                    <UpdatePassword/>
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
        </div>
    )
}

export default Page;