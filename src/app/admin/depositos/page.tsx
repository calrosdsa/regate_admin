"use client"
import AccountBank from "@/components/admin/billing/AccountBank";
import Depositos from "@/components/admin/billing/Depositos";
import { useAppDispatch } from "@/context/reduxHooks";
import { GetBankAccount, GetBanks, GetDepositos } from "@/core/repository/billing";
import { Order } from "@/core/type/enums";
import { Tab } from "@headlessui/react"
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
    const searchParams = useSearchParams();
    const tabIndex = searchParams.get("tabIndex")
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    const dispatch = useAppDispatch()
    const pathname = usePathname();
    const router = useRouter()
    const [banks,setBanks] = useState<Bank[]>([])
    const [accountBank,setAccontBank] = useState<AccountBank | null>(null)
    const [loadingAccountBank,setLoadingAccountBank] = useState(false)
    const [loadingDepositos,setLoadingDepositos] = useState(false)
    const [depositos,setDepositos] = useState<Deposito[]>([])
    const [order,setOrder] =useState(Order.DESC)

    const appendSerachParams = (key:string,value:string)=>{
        current.set(key,value);
        const search = current.toString();
        const query = search ? `?${search}` : "";
        router.push(`${pathname}${query}`);
    }

    const getAccountBank = async() =>{
        try{
            setLoadingAccountBank(true)
            const res = await GetBankAccount()
            setAccontBank(res)
            setLoadingAccountBank(false)
        }catch(err){
            setLoadingAccountBank(false)
            console.log(err)
        }
    }
    const getDeposits = async() =>{
        try{
            setLoadingDepositos(true)
            const res = await GetDepositos()
            setDepositos(res)
            setLoadingDepositos(false)
        }catch(err){
            setLoadingDepositos(false)
        }
    }

    const getBanks = async() => {
        try{
            const res = await GetBanks()
            setBanks(res)
        }catch(err){

        }
    }

    const getData = () =>{
        switch(tabIndex){
            case "0":
                getDeposits()
                break;
            case "1":
                getAccountBank()
                getBanks()
                break;
            default:
                getDeposits()
        }
    }

    useEffect(()=>{
        getData()
    },[])
    return(
        <div>
             <Tab.Group defaultIndex={tabIndex != null ? Number(tabIndex):0}>

                    <Tab.List className={" sticky top-0 bg-gray-50  w-full z-10 py-3"}>
                        <Tab className={({ selected }) => `tab ${selected && "tab-enabled"}`}
                        onClick={()=>{
                            appendSerachParams("tabIndex","0")
                            getData()
                            }}>Depositos</Tab>
                        <Tab className={({ selected }) => `tab ${selected && "tab-enabled"}`}
                        onClick={()=>{
                            appendSerachParams("tabIndex","1")
                            if(accountBank != null) return
                            getData()
                        }}>Cuenta</Tab>
                        {/* <Tab className={({ selected }) => `tab ${selected && "tab-enabled"}`}
                        onClick={()=>{      
                            appendSerachParams("tabIndex","2")
                            }}>Reservas</Tab> */}
                    </Tab.List>


                    <Tab.Panels className={"p-2"}>
                        <Tab.Panel className={"mx-auto flex justify-center w-full "}>

                            <Depositos
                            loading={loadingDepositos}
                            depositos={depositos}
                            order={order}
                            changeOrder={(order)=>setOrder(order)}
                            />
                            {/* Depositos */}
                        </Tab.Panel>
                        <Tab.Panel className={"mx-auto flex justify-center w-full "}>
                            <AccountBank
                            accountBank={accountBank}
                            loading={loadingAccountBank}
                            banks={banks}
                            setAccountBank={(account)=>setAccontBank(account)}
                            />
                        </Tab.Panel>

                        </Tab.Panels>
             </Tab.Group>
        </div>
    )
}

export default Page;