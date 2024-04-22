"use client"
import EventoListTable from "@/components/eventos/EventoListTable"
import CreateEventDialog from "@/components/eventos/dialog/CreateEventDialog"
import UserListTable from "@/components/user/UserListTable"
import EditUserEmpresaDialog from "@/components/user/dialog/EditUserEmpresaDialog"
import ConfirmationDialog from "@/components/util/dialog/ConfirmationDialog"
import SearchInput from "@/components/util/input/SearchInput"
import Pagination from "@/components/util/pagination/Pagination"
import { successfulMessage, unexpectedError } from "@/context/config"
import { useAppDispatch, useAppSelector } from "@/context/reduxHooks"
import { uiActions } from "@/context/slices/uiSlice"
import { DeleteEvento, GetEventos } from "@/core/repository/evento"
import { GetUsersEmpresaPagination } from "@/core/repository/users"
import useEffectOnce from "@/core/util/hooks/useEffectOnce"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { toast } from "react-toastify"
const Page = ({ params }: { params: { uuid: string } }) =>{
    const dispatch = useAppDispatch()
    const searchParams = useSearchParams();
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    const [loading,setLoading] = useState(false)
    const [query,setQuery] = useState("")
    const [paginationProps,setPaginationProps] = useState<PaginationProps | undefined>(undefined)
    const [eventos,setEventos] = useState<Evento[]>([])
    const [createEventoDialog,setCreateEventoDialog] = useState(false)
    const establecimientos = useAppSelector(state=>state.account.establecimientos)

    const [selectedId,setSelectedId] = useState<number | undefined>(undefined)
    const [deleteEventoConfirmationDialog,setDeleteConfirmationDialog] = useState(false)

    const deleteEvento = async() =>{
        try{
            dispatch(uiActions.setLoaderDialog(true))
            if(selectedId != undefined){
                setDeleteConfirmationDialog(false)
                await DeleteEvento(selectedId)
                const filterList = eventos.filter(item=>item.id != selectedId)
                setEventos(filterList)
                toast.success(successfulMessage)
            }
            dispatch(uiActions.setLoaderDialog(false))
        }catch(err){
            toast.error(unexpectedError)
            dispatch(uiActions.setLoaderDialog(false))
        }
    }

    const appendSerachParams = (key:string,value:string)=>{
        current.set(key,value);
        const search = current.toString();
        const url  = window.location.pathname + '?' + search;
        history.pushState(null,'',url)
    }
  
    const getUsersEmpresa = async(page:number) =>{
        try{
            setEventos([])
            setLoading(true)
            const res:EventoPaginationResponse = await GetEventos(params.uuid,page)
            setPaginationProps({
                pageSize:res.page_size,
                count:res.count > 0 ? res.count : 0,
                nextPage:res.next_page,
                currentPage:page
            })
            setEventos(res.results)
            setLoading(false)
        }catch(err){
            setLoading(false)
        }
    }

    useEffectOnce(()=>{
        getUsersEmpresa(1)
    })
    return(
        <>
        {deleteEventoConfirmationDialog&&
        <ConfirmationDialog
        open={deleteEventoConfirmationDialog}
        close={()=>setDeleteConfirmationDialog(false)}
        performAction={()=>deleteEvento()}
        
        />
        }
        {createEventoDialog &&
        <CreateEventDialog
        addEvento={(e)=>setEventos([e,...eventos])}
        open={createEventoDialog}
        close={()=>setCreateEventoDialog(false)}
        establecimientoId={establecimientos.find(item=>item.uuid == params.uuid)?.id}
        />
        }
        <div className="p-2 overflow-auto h-screen">

            <div>
                <span className="subtitle">Eventos</span>
            </div>

            <div className="pt-10 xl:pt-2">
                <span className="text-xl">Eventos({paginationProps?.count})</span>

            <div className="flex space-x-3 py-2">
          
                <button className="button-inv" disabled={loading}  onClick={()=>{
                  setQuery("")
                  getUsersEmpresa(1)
                    }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
  <path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z" clipRule="evenodd" />
                 </svg>
                </button>

                <button onClick={()=>setCreateEventoDialog(true)} className="button-inv flex space-x-1">
                    <span>Crear evento</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
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
                {/* {(paginationProps != undefined && paginationProps.count > 0 && query != "") &&
                <span>{paginationProps.count} {paginationProps.count > 1 ? "coincidencias":"coincidencia"}</span>
                } */}
                </div>
                {paginationProps != undefined &&
                    <Pagination
                    currentPage={paginationProps.currentPage}
                    setPage={(page)=>{
                        // console.log(Math.ceil(paginationProps.count/paginationProps.pageSize))
                        appendSerachParams("page",page.toString())
                        getUsersEmpresa(page)
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
            <EventoListTable
            eventos={eventos}
            loading={loading}
            uuid={params.uuid}
            deleteEvento={(id:number)=>{
                setSelectedId(id)
                setDeleteConfirmationDialog(true)
            }}
            />
        </div>

        </div>
        </>
    )
}

export default Page;