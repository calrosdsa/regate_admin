"use client"
import ReservaList from "@/components/reservas/ReservaList";
import CreateReservaDialog from "@/components/reservas/dialog/CreateReservaDialog";
import DialogReservaDetail from "@/components/reservas/dialog/DialogReservaDetail";
import RequestReporteReservaDialog from "@/components/reservas/dialog/RequestReporteReservaDialog";
import SearchInput from "@/components/util/input/SearchInput";
import SelectComponent from "@/components/util/input/SelectCompenent";
// import Pagination from "@/components/util/pagination/Pagination";
import { downloadReporteReservasExcel } from "@/context/actions/download-actions";
import { useAppDispatch, useAppSelector } from "@/context/reduxHooks";
import { dataActions } from "@/context/slices/dataSlice";
import { uiActions } from "@/context/slices/uiSlice";
import { GetInstalaciones } from "@/core/repository/instalacion";
import { GetReservaDetail, getEstablecimientoReservas, getEstablecimientoReservasCount } from "@/core/repository/reservas";
import { Order, OrderQueue } from "@/core/type/enums";
import { appendSerachParams } from "@/core/util/routes";
import { Button } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { use, useEffect, useState } from "react";
import RefreshIcon from '@mui/icons-material/Refresh';
import DownloadIcon from '@mui/icons-material/Download';
import Pagination from "@/components/util/pagination/Pagination";


export default function Page({params}:{params:{uuid:string}}){
    const searchParams = useSearchParams();
    const pageParam = searchParams.get("page")
    const totalCount = searchParams.get("totalCount")
    const dispatch = useAppDispatch()
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    const reservas = useAppSelector(state=>state.data.reservas)
    // const [reservas ,setReservas ] = useState<Reserva[]>([])
    const [query,setQuery] = useState("")
    const [reservaDetail,setReservaDetail] = useState<ReservaDetail | null>(null)
    const [filterData,setFilterData] = useState<ReservaDataFilter>({
        uuid:params.uuid,
        query:"",
        order:Order.DESC,
        order_queue:OrderQueue.CREATED,
        instalacion_id:""
    })
    const [paginationProps,setPaginationProps] = useState<PaginationProps | undefined>(undefined)
    // const [reservasCount,setReservasCount] = useState<number | undefined>(undefined)
    const [loading,setLoading] = useState(false)
    const [openReservaDetailDialog,setOpenReservaDetailDialog] = useState(false)
    const [order,setOrder] = useState<ReservaOrder>({
        order:Order.DESC,
        queue:OrderQueue.CREATED
    })

    const [instalaciones,setInstalaciones] = useState<Instalacion[]>([])
    const [selectedInstalacion,setSelectedInstalacion]= useState("0")
    const [openRequestReporteDialog,setOpenRequestReporteDialog] = useState(false)
    const appendSerachParams = (key:string,value:string)=>{
        current.set(key,value);
        const search = current.toString();
        const url  = window.location.pathname + '?' + search;
        history.pushState(null,'',url)
    }
    const openExportReservasDialog = () =>{
        if(instalaciones.length == 0){
        //     getInstalaciones()
        }
            setOpenRequestReporteDialog(true)
    }
    const getInstalaciones = async() =>{
        try{
            if(instalaciones.length == 0){
                // dispatch(uiActions.setLoaderDialog(true))
                const res:Instalacion[] = await GetInstalaciones(params.uuid)
                setInstalaciones(res)
                // setOpenRequestReporteDialog(true)
                // dispatch(uiActions.setLoaderDialog(false))
            }
        }catch(err){
            // dispatch(uiActions.setLoaderDialog(false))
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
    // const getReservasCount = async()=>{
    //     try{
    //         const res:number = await getEstablecimientoReservasCount(params.uuid)
    //         setReservasCount(res)
    //         appendSerachParams("totalCount",`${res}`)
    //     }catch(err){
    //         console.log(err)
    //     }
    // }

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
        // setFilterData(filterD)
        getReservas(filterD,1)
    }
    const getReservas = async(data:ReservaDataFilter,page:number) =>{
        try{
            dispatch(dataActions.setReservas([]))
            setFilterData(data)
            setLoading(true)
            const res:ReservaPaginationResponse =await getEstablecimientoReservas(data,page)
            setPaginationProps({
                pageSize:res.page_size,
                count:res.count > 0 ? res.count : 0,
                nextPage:res.next_page,
                currentPage:page
            })
            console.log(res)
            dispatch(dataActions.setReservas(res.results))
            setLoading(false)
        }catch(err){
            setLoading(false)
        }
    }
    const applyChange = (data:ReservaDataFilter) =>{
        setFilterData(data)
        if(pageParam != null){
            getReservas(data,Number(pageParam))
        }else{
            getReservas(data,1)
        }
    }

    const onChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        setQuery(e.target.value)
    }


    useEffect(()=>{
        if(reservaDetail != null){
            setOpenReservaDetailDialog(true)
        }
    },[reservaDetail])

    useEffect(()=>{
        getInstalaciones()
        if(pageParam != null){
            getReservas(filterData,Number(pageParam))
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
        <div className="p-2 overflow-auto">
            <div className="">
                <span className="text-xl">Reservas({paginationProps?.count})</span>

            <div className="flex space-x-3 py-2">
          
                <Button
                sx={{height:35}}
                variant="outlined"  disabled={loading}  onClick={()=>{
                    setQuery("")
                    getReservas(filterData,1)
                    }}>
                        <RefreshIcon/>
                </Button>

                <Button 
                sx={{height:35}}
                variant="outlined" disabled={loading}  onClick={()=>{
                  openExportReservasDialog()
                    }}>
                        <DownloadIcon/>
                </Button>
                <SelectComponent
                value={selectedInstalacion}
                items={instalaciones.map((t)=>{
                    return {
                        value:t.id.toString(),
                        name:t.name
                    } 
                }).concat({name:"Todas las canchas",value:"0"})}
                onChange={(e)=>{
                    const filterD:ReservaDataFilter = {
                        ...filterData,
                        instalacion_id:e.target.value
                    }
                    setSelectedInstalacion(e.target.value)
                    getReservas(filterD,1)
                }}
                name={"Instalaciones"}
                containerClassName="h-9"
                />
                
                {/* <button className="button-inv flex space-x-1" disabled={loading}  onClick={()=>setCreateReservaDialog(true)}>
                        <span>Crear Reserva</span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
  <path d="M10.75 6.75a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" />
                        </svg>
                </button>
     */}

            </div>
            <div className="pt-2 pb-4 sm:flex md:justify-between md:items-center grid gap-2 relative">
                {/* <div className="flex space-x-2 items-center">
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
                </div> */}

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
                    totalCount={paginationProps.count || 0}
                    pageSize={paginationProps.pageSize}
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
        uuid={params.uuid}
        update={(reserva?:Reserva)=>{
            if(reserva == undefined) return
            dispatch(dataActions.updateReservas(reserva))
        }}
        getReservas={()=> getReservas(filterData,Number(pageParam))}
        />
        }
        </>
    )
}
