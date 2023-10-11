"use client"

import Deposito from "@/components/admin/billing/Deposito";
import ReservaList from "@/components/reservas/ReservaList";
import DialogReservaDetail from "@/components/reservas/dialog/DialogReservaDetail";
import Pagination from "@/components/util/pagination/Pagination";
import { downloadReporteDeposito } from "@/context/actions/download-actions";
import { API_URL } from "@/context/config";
import { useAppDispatch } from "@/context/reduxHooks";
import { uiActions } from "@/context/slices/uiSlice";
import { GetDeposito, GetReservasPagadas } from "@/core/repository/billing";
import { GetReservaDetail } from "@/core/repository/reservas";
import { Order, OrderQueue, ReporteId } from "@/core/type/enums";
import { adminRoutes, rootEstablecimiento } from "@/core/util/routes";
import { Tab } from "@headlessui/react";
import axios from "axios";
import moment from "moment";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const Page = ({params}:{params:{uuid:string}}) =>{
    const searchParams = useSearchParams();
    const gloss = searchParams.get("gloss")
    const tabIndex = searchParams.get("tabIndex")
    const page = searchParams.get("page")
    const depositoUuid = searchParams.get("depositoUuid")
    const dispatch = useAppDispatch()
    const pathname = usePathname();
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    const router = useRouter()
    const [reservas,setReservas] = useState<Reserva[]>([])
    const [reservaDetail,setReservaDetail] = useState<ReservaDetail | null>(null)
    const [loading,setLoading] = useState(false)
    const [openReservaDetailDialog,setOpenReservaDetailDialog] = useState(false)
    const [paginationProps,setPaginationProps] = useState<PaginationProps | undefined>(undefined)
    const [order,setOrder] = useState<ReservaOrder>({
        order:Order.DESC,
        queue:OrderQueue.CREATED
    })
    const [filterData,setFilterData] = useState<ReservaDataFilter>({
        uuid:depositoUuid || "",
        query:"",
        order:Order.DESC,
        order_queue:OrderQueue.CREATED,
    })
    // const [totalAmountReservas,setTotalAmountReserva] = useState(0)
    const appendSerachParams = (key:string,value:string)=>{
        current.set(key,value);
        const search = current.toString();
        const query = search ? `?${search}` : "";
        router.push(`${pathname}${query}`);
    }
    const [deposito,setDeposito] = useState<Deposito | null>(null)
    const [loadingDeposito,setLoadingDeposito]=useState(false)

    const getReservaDetail = async(id:number) => {
        try{
            dispatch(uiActions.setLoaderDialog(true))
            const res = await GetReservaDetail(id)
            console.log(res)
            setReservaDetail(res)
            dispatch(uiActions.setLoaderDialog(false))
        }catch(err){
            dispatch(uiActions.setLoaderDialog(false))
        }
    }

    const getReservas = async(data:ReservaDataFilter,page:number) =>{
        try{
            setReservas([])
            setLoading(true)
            const res:ReservaPaginationResponse = await GetReservasPagadas(data,page)
            setPaginationProps({
                pageSize:res.page_size,
                count:res.count > 0 ? res.count : 0,
                nextPage:res.next_page,
                currentPage:page
            })
            // const total = res.results.map(item=>item.paid).reduce((acc,curr)=>acc + curr,0)
            // setTotalAmountReserva(total)
            setReservas(res.results)
            setLoading(false)
        }catch(err){
            setLoading(false)
            console.log(err)
        }
    }
    const getDeposito = async() =>{
        try{
            setLoadingDeposito(true)
            if(depositoUuid == null) return
            const res:Deposito = await GetDeposito(depositoUuid)
            console.log(res)
            setDeposito(res)
            setLoadingDeposito(false)
        }catch(err){
            setLoadingDeposito(false)
        }
    }


    const applyChange = (data:ReservaDataFilter) =>{
        setFilterData(data)
        console.log("FILTER DATA",data)
        if(page != null){
            getReservas(data,Number(page))
        }else{
            getReservas(data,1)
        }
    }

    const onPrev = () => {
        if(paginationProps == undefined) return
        if(paginationProps.currentPage == 1){
            return
        }else {
            const pagePrev = paginationProps.currentPage -1
            // appendSerachParams("page",pagePrev.toString
            getReservas(filterData,pagePrev)
        }
    }
    const onNext = () => {
        if(paginationProps == undefined) return
        if(paginationProps.nextPage == 0){
            return
        }else {
            const nextPage = paginationProps.currentPage + 1
            // appendSerachParams("page",nextPage.toString
            getReservas(filterData,nextPage)
        }
    }
    const getData = (tab:string)=>{
        switch(tab){
            case '0':
                getDeposito()
                break;
            case '1':
                if(page != null){
                    getReservas(filterData,Number(page))
                }else{
                    getReservas(filterData,1)
                }
                break;
            default:
                getDeposito()
        }
    }
    const downloadReport = async()=>{
        if(deposito == null) return
       dispatch(downloadReporteDeposito(deposito.id,ReporteId.DEPOSITO))
    }

    useEffect(()=>{
        if(reservaDetail != null){
            setOpenReservaDetailDialog(true)
        }
    },[reservaDetail])
    useEffect(()=>{
        if(tabIndex == null){
            getData("0")
        }else{
            getData(tabIndex)
        }
    },[])
    return(
        <>
        <div className="default-padding h-screen">
            <div className="flex space-x-2 items-center p-1">
                <Link href={`${rootEstablecimiento}/${params.uuid}/depositos`} className="link">Depositos</Link>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                 className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                <span className="text-sm text-gray-500 font-medium noSelect">{gloss}</span>
            </div>
            <Tab.Group defaultIndex={tabIndex != null ? Number(tabIndex):0}>

            <Tab.List className={" sticky top-0 bg-gray-50  w-full z-10 py-3"}>
            <Tab className={({ selected }) => `tab ${selected && "tab-enabled"}`}
                onClick={()=>{
                    appendSerachParams("tabIndex","0")
                    if(deposito != null) return
                    getDeposito()
                    // getData()
                    }}>Detalles</Tab>
              
                <Tab className={({ selected }) => `tab ${selected && "tab-enabled"}`}
                onClick={()=>{
                    appendSerachParams("tabIndex","1")
                    if(reservas.length != 0) return
                    getReservas(filterData,1)
                    // getData()
                    }}>Reservas Pagadas</Tab>
              
                {/* <Tab className={({ selected }) => `tab ${selected && "tab-enabled"}`}
                onClick={()=>{      
                    appendSerachParams("tabIndex","2")
                    }}>Reservas</Tab> */}
            </Tab.List>


            <Tab.Panels className={"p-2"}>
            <Tab.Panel className={"w-full"}>
                <div className="pb-3">
                    <button onClick={()=>downloadReport()} className="button">Descargar Reporte</button>
                </div>
                <Deposito
                deposito={deposito}
                loading={loadingDeposito}
                />
            </Tab.Panel>

                <Tab.Panel className={"w-full"}>
                
        
              <span className="text-xl font-medium">Reservas 
              <span className="text-xl text-gray-500  font-normal">({paginationProps != undefined && paginationProps.count})</span></span>
            <div className="pt-2 pb-4 flex flex-wrap justify-between md:items-center relative h-[70px]">
                
        <div className="flex space-x-3 py-2">      
                <button className="button-inv" disabled={loading}  onClick={()=>{
                    getReservas(filterData,1)
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
                        getReservas(filterData,page)
                        setPaginationProps({
                            ...paginationProps,
                            currentPage:page
                        })
                    }}
                    totalCount={paginationProps.count}
                    pageSize={paginationProps.pageSize}
                    onPrev={onPrev}
                    onNext={onNext}
                    />
                }

            </div>


            <div className=" overflow-auto">
            <ReservaList
            reservas={reservas}
            loading={loading}
            order={order}
            getReservaDetail={(id)=>getReservaDetail(id)}
            changeOrder={(order)=>{
                if(order.order == Order.DESC){
                    setOrder({
                        ...order,
                        order:Order.ASC
                    })
                    const data = {
                        ...filterData,
                        order:Order.ASC,
                        order_queue:order.queue
                    }
                    applyChange(data)
                }else{
                    setOrder({
                        ...order,
                        order:Order.DESC
                    })
                    const data = {
                        ...filterData,
                        order:Order.DESC,
                        order_queue:order.queue
                    }
                    applyChange(data)
                }
            }}
            />
            </div>
            </Tab.Panel>
        
        
            </Tab.Panels>
        </Tab.Group>
        </div>
        {(openReservaDetailDialog && reservaDetail != null) &&
        <DialogReservaDetail
        open={openReservaDetailDialog}
        close={()=>setOpenReservaDetailDialog(false)}
        data={reservaDetail}
        />
        }
        </>
    )
}

export default Page;