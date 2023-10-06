"use client"
import AccountBank from "@/components/admin/billing/AccountBank";
import Depositos from "@/components/admin/billing/Depositos";
import Loader from "@/components/util/loaders/Loader";
import Pagination from "@/components/util/pagination/Pagination";
import { useAppDispatch } from "@/context/reduxHooks";
import { GetBankAccountEstablecimiento, GetBankAccounts, GetBanks, GetDepositos } from "@/core/repository/billing";
import { Order } from "@/core/type/enums";
import { Tab } from "@headlessui/react"
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const Page = ({params}:{params:{uuid:string}}) => {
    const searchParams = useSearchParams();
    const tabIndex = searchParams.get("tabIndex")
    const page = searchParams.get("page") || "1"
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    const dispatch = useAppDispatch()
    const pathname = usePathname();
    const router = useRouter()
    const [banks,setBanks] = useState<Bank[]>([])
    const [accountBank,setAccontBank] = useState<AccountBank | null>(null)
    const [loadingAccountBank,setLoadingAccountBank] = useState(false)
    const [loadingDepositos,setLoadingDepositos] = useState(false)
    const [depositosResponse,setDepositosResponse] = useState<DepositoPaginationResponse  | undefined>(undefined)
    const [order,setOrder] =useState(Order.DESC)
    const [paginationProps,setPaginationProps] = useState<PaginationProps | undefined>(undefined)


    const appendSerachParams = (key:string,value:string)=>{
        current.set(key,value);
        const search = current.toString();
        const query = search ? `?${search}` : "";
        router.push(`${pathname}${query}`);
    }

    const getAccountBank = async() =>{
        try{
            setLoadingAccountBank(true)
            const res = await GetBankAccountEstablecimiento(params.uuid)
            setAccontBank(res)
            setLoadingAccountBank(false)
        }catch(err){
            setLoadingAccountBank(false)
            console.log(err)
        }
    }
    const getDeposits = async(page:number) =>{
        try{
            // setDepositosResponse({...depositosResponse,
            //     results:[]
            // })
            setLoadingDepositos(true)
            const res:DepositoPaginationResponse = await GetDepositos(page,params.uuid)
            setPaginationProps({
                pageSize:res.page_size,
                count:res.count > 0 ? res.count : 0,
                nextPage:res.next_page,
                currentPage:Number(page)
            })
            console.log(res)
            setDepositosResponse(res)
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

    
    const onPrev = () => {
        if(paginationProps == undefined) return
        if(paginationProps.currentPage == 1){
            return
        }else {
            const pagePrev = paginationProps.currentPage -1
            appendSerachParams("page",pagePrev.toString())
                        // getReservas(filterData,page)
                        setPaginationProps({
                            ...paginationProps,
                            currentPage:pagePrev
                        })
                        getDeposits(Number(pagePrev))
            // appendSerachParams("page",pagePrev.toString
            // getReservas(filterData,pagePrev)
        }
    }
    const onNext = () => {
        if(paginationProps == undefined) return
        if(paginationProps.nextPage == 0){
            return
        }else {
            const nextPage = paginationProps.currentPage + 1
            appendSerachParams("page",nextPage.toString())
            // getReservas(filterData,page)
            setPaginationProps({
                ...paginationProps,
                currentPage:nextPage
            })
            getDeposits(Number(nextPage))
        }
    }

    const getData = (tab:string) =>{
        switch(tab){
            case "0":
                getDeposits(Number(page))
                break;
            case "1":
                getAccountBank()
                getBanks()
                break;
            default:
                getDeposits(Number(page))
        }
    }
   

    useEffect(()=>{
        if(tabIndex != null){
            getData(tabIndex)
        }else{
            getData("0")
        }
    },[])
    return(
        <div>
          
             <Tab.Group defaultIndex={tabIndex != null ? Number(tabIndex):0}>

                    <Tab.List className={" sticky top-0 bg-gray-50  w-full z-10 py-3"}>
                        <Tab className={({ selected }) => `tab ${selected && "tab-enabled"}`}
                        onClick={()=>{
                            appendSerachParams("tabIndex","0")
                            // if(depositosResponse != undefined) return
                            getData("0")
                            }}>Depositos</Tab>
                        <Tab className={({ selected }) => `tab ${selected && "tab-enabled"}`}
                        onClick={()=>{
                            appendSerachParams("tabIndex","1")
                            // if(accountBank != null) return
                            getData('1')
                        }}>Cuenta</Tab>
                        {/* <Tab className={({ selected }) => `tab ${selected && "tab-enabled"}`}
                        onClick={()=>{      
                            appendSerachParams("tabIndex","2")
                            }}>Reservas</Tab> */}
                    </Tab.List>


                    <Tab.Panels className={"p-2"}>
                        <Tab.Panel className={"w-full relative"}>
                            
              <span className="text-xl font-medium">Depositos
              <span className="text-xl text-gray-500  font-normal">({depositosResponse?.count || 0})</span></span>
            <div className="pt-2 pb-4 flex flex-wrap justify-between md:items-center relative h-[70px]">
                
        <div className="flex space-x-3 py-2">
                
                <button className="button-inv" disabled={loadingDepositos}  onClick={()=>{
                    setDepositosResponse(undefined)
                    getDeposits(Number(page))
                    // getReservas(filterData,1)
                    }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z" clipRule="evenodd" />
                </svg>
                </button>
      </div>
            {paginationProps != undefined &&
                    <Pagination
                    currentPage={paginationProps.currentPage}
                    setPage={(page)=>{
                        // console.log(Math.ceil(paginationProps.count/paginationProps.pageSize))
                        appendSerachParams("page",page.toString())
                        // getReservas(filterData,page)
                        setPaginationProps({
                            ...paginationProps,
                            currentPage:page
                        })
                        getDeposits(Number(page))
                    }}
                    totalCount={paginationProps.count}
                    pageSize={paginationProps.pageSize}
                    onPrev={onPrev}
                    onNext={onNext}
                    />
                }

            </div>

                            <Depositos
                            loading={loadingDepositos}
                            depositos={depositosResponse?.results || []}
                            order={order}
                            uuid={params.uuid}
                            changeOrder={(order)=>setOrder(order)}
                            />
                            {/* Depositos */}
                        </Tab.Panel>
                        <Tab.Panel className={"mx-auto w-full "}>

                            {loadingAccountBank &&
                                <Loader
                                className="flex justify-center items-center mt-5 w-full"
                                />
                            }
                            <AccountBank
                            enableEdit={false}
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