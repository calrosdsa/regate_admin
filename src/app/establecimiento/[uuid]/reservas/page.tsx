
"use client"
import ReservaList from "@/components/reservas/ReservaList";
import CreateReservaDialog from "@/components/reservas/dialog/CreateReservaDialog";
import DialogReservaDetail from "@/components/reservas/dialog/DialogReservaDetail";
import RequestReporteReservaDialog from "@/components/reservas/dialog/RequestReporteReservaDialog";
import SearchInput from "@/components/util/input/SearchInput";
import Pagination from "@/components/util/pagination/Pagination";
import { downloadReporteReservasExcel } from "@/context/actions/download-actions";
import { useAppDispatch } from "@/context/reduxHooks";
import { uiActions } from "@/context/slices/uiSlice";
import { GetInstalaciones } from "@/core/repository/instalacion";
import { GetReservaDetail, getEstablecimientoReservas, getEstablecimientoReservasCount } from "@/core/repository/reservas";
import { Order, OrderQueue } from "@/core/type/enums";
import { appendSerachParams } from "@/core/util/routes";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { use, useEffect, useState } from "react";


export default function Page({params}:{params:{uuid:string}}){
    const searchParams = useSearchParams();
    const page = searchParams.get("page")
    const totalCount = searchParams.get("totalCount")
    const dispatch = useAppDispatch()
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    const [reservas ,setReservas ] = useState<Reserva[]>([])
    const [query,setQuery] = useState("")
    const [reservaDetail,setReservaDetail] = useState<ReservaDetail | null>(null)
    const [filterData,setFilterData] = useState<ReservaDataFilter>({
        uuid:params.uuid,
        query:"",
        order:Order.DESC,
        order_queue:OrderQueue.CREATED,
    })
    const [paginationProps,setPaginationProps] = useState<PaginationProps | undefined>(undefined)
    const [reservasCount,setReservasCount] = useState<number | undefined>(undefined)
    const [loading,setLoading] = useState(false)
    const [openReservaDetailDialog,setOpenReservaDetailDialog] = useState(false)
    const [order,setOrder] = useState<ReservaOrder>({
        order:Order.DESC,
        queue:OrderQueue.CREATED
    })

    const [instalaciones,setInstalaciones] = useState<Instalacion[]>([])
   const [openRequestReporteDialog,setOpenRequestReporteDialog] = useState(false)
    const appendSerachParams = (key:string,value:string)=>{
        current.set(key,value);
        const search = current.toString();
        const url  = window.location.pathname + '?' + search;
        history.pushState(null,'',url)
    }
    const openExportReservasDialog = () =>{
        if(instalaciones.length == 0){
            getInstalaciones()
        }else{
            setOpenRequestReporteDialog(true)
        }
    }
    const getInstalaciones = async() =>{
        try{
            dispatch(uiActions.setLoaderDialog(true))
            const res:Instalacion[] = await GetInstalaciones(params.uuid)
            setInstalaciones(res)
            setOpenRequestReporteDialog(true)
            dispatch(uiActions.setLoaderDialog(false))
        }catch(err){
            dispatch(uiActions.setLoaderDialog(false))
        }
    }
    const getReservaDetail = async(id:number) => {
        try{
            dispatch(uiActions.setLoaderDialog(true))
            const res = await GetReservaDetail(id)
            setReservaDetail(res)
            dispatch(uiActions.setLoaderDialog(false))
        }catch(err){
            dispatch(uiActions.setLoaderDialog(false))
        }
    }
    const getReservasCount = async()=>{
        try{
            const res:number = await getEstablecimientoReservasCount(params.uuid)
            setReservasCount(res)
            appendSerachParams("totalCount",`${res}`)
        }catch(err){
            console.log(err)
        }
    }

    const searchQuery = (query:string) =>{
        if(query == "") return
        appendSerachParams("page","1")
        // console.log(query.trim().replaceAll(/\s+/g,","))
        const q = query.trim().replaceAll(/\s+/g,":* & ") + ":*"
        const filterD:ReservaDataFilter = {
            ...filterData,
            query:q
        }
        if(paginationProps != undefined){
            setPaginationProps({
                ...paginationProps,
                count:paginationProps.pageSize
            })
        }
        setFilterData(filterD)
        getReservas(filterD,1)
    }
    const getReservas = async(data:ReservaDataFilter,page:number) =>{
        try{
            setReservas([])
            setLoading(true)
            const res:ReservaPaginationResponse =await getEstablecimientoReservas(data,page)
            setPaginationProps({
                pageSize:res.page_size,
                count:res.count > 0 ? res.count : 0,
                nextPage:res.next_page,
                currentPage:page
            })
            if(data.query != ""){
                setReservasCount(res.count)
            }else{
                if(totalCount != null){
                    setReservasCount(Number(totalCount))
                }
            }
            setReservas(res.results)
            setLoading(false)
        }catch(err){
            setLoading(false)
        }
    }
    const applyChange = (data:ReservaDataFilter) =>{
        setFilterData(data)
        if(page != null){
            getReservas(data,Number(page))
        }else{
            getReservas(data,1)
        }
    }

    const onChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        setQuery(e.target.value)
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

    useEffect(()=>{
        if(reservaDetail != null){
            setOpenReservaDetailDialog(true)
        }
    },[reservaDetail])

    useEffect(()=>{
        getReservasCount()
        if(page != null){
            getReservas(filterData,Number(page))
        }else{
            getReservas(filterData,1)
        }
    },[])

    return(
        <>
        {openRequestReporteDialog && 
        <RequestReporteReservaDialog
        open={openRequestReporteDialog}
        close={()=>setOpenRequestReporteDialog(false)}
        uuid={params.uuid}
        instalacionOptions={instalaciones}
        />
        }
        <div className="p-2 overflow-auto h-screen">
            <div className="pt-10 xl:pt-2">
                <span className="text-xl">Reservas({reservasCount})</span>

            <div className="flex space-x-3 py-2">
          
                <button className="button-inv" disabled={loading}  onClick={()=>{
                    setQuery("")
                    getReservas(filterData,1)
                    getReservasCount()
                    }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
  <path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z" clipRule="evenodd" />
                 </svg>
                </button>

                <button className="button-inv flex space-x-3" disabled={loading}  onClick={()=>{
                  openExportReservasDialog()
                    }}>
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75Z" />
                <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
                </svg>

                </button>
                
                {/* <button className="button-inv flex space-x-1" disabled={loading}  onClick={()=>setCreateReservaDialog(true)}>
                        <span>Crear Reserva</span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
  <path d="M10.75 6.75a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" />
                        </svg>
                </button>
     */}

            </div>
            <div className="pt-2 pb-4 sm:flex md:justify-between md:items-center grid gap-2 relative">
                <div className="flex space-x-2 items-center">
                <SearchInput
                className=" sm:w-64"
                placeholder="Buscar por nombre"
                onChange={onChange}
                value={query}
                clear={()=>{
                    setQuery("")
                    const filter  = {...filterData,query:""}
                    setFilterData(filter)
                    getReservas(filter,1)
                    if(paginationProps == undefined) return
                    setPaginationProps({
                        ...paginationProps,
                        count:0
                    })
                }}
                onEnter={(query)=>searchQuery(query)}
                />
                {(paginationProps != undefined && paginationProps.count > 0 && query != "") &&
                <span>{paginationProps.count} {paginationProps.count > 1 ? "coincidencias":"coincidencia"}</span>
                }
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
                    totalCount={reservasCount || 0}
                    pageSize={paginationProps.pageSize}
                    onPrev={onPrev}
                    onNext={onNext}
                    />
                }
            </div>
                {query != "" &&
                <span className="italic text-sm  text-gray-600">Pulse intro para filtrar por prefijo:{query}</span>
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
            {/* {JSON.stringify(reservas)} */}
        </div>

        {(openReservaDetailDialog && reservaDetail != null) &&
        <DialogReservaDetail
        open={openReservaDetailDialog}
        close={()=>setOpenReservaDetailDialog(false)}
        data={reservaDetail}
        update={()=>{}}
        />
        }
        </>
    )
}
