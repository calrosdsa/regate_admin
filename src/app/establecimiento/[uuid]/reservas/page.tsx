"use client"
import ReservaList from "@/components/reservas/ReservaList";
import SearchInput from "@/components/util/input/SearchInput";
import Pagination from "@/components/util/pagination/Pagination";
import { getEstablecimientoReservas } from "@/core/repository/reservas";
import { useEffect, useState } from "react";


const Page = ({params}:{params:{uuid:string}}) => {
    const [reservas ,setReservas ] = useState<Reserva[]>([])
    const [page,setPage] = useState(1)
    const [query,setQuery] = useState("")
    const [filterData,setFilterData] = useState<ReservaDataFilter>({
        uuid:params.uuid,
        query:""
    })
    const [loading,setLoading] = useState(false)

    const searchQuery = (query:string) =>{
        const q = query.replace(" "," | ")
        console.log(q)
        const filterD:ReservaDataFilter = {
            ...filterData,
            query:q
        }
        getReservas(filterD)
    }
    const getReservas = async(data:ReservaDataFilter) =>{
        try{
            setReservas([])
            setLoading(true)
            const res =await getEstablecimientoReservas(data)
            setReservas(res)
            setLoading(false)
        }catch(err){
            setLoading(false)
        }
    }
    const onChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        setQuery(e.target.value)
    }
    const onPrev = () => {
        // if(page)
    }
    useEffect(()=>{
        getReservas(filterData)
    },[])

    return(
        <div className="p-2 overflow-auto h-screen">
            <div className="pt-10 xl:pt-2">
                <span className="text-xl">Rservas(10)</span>

            <div className="flex space-x-4">
            <div className="pt-2 pb-2">
                <button className="button-inv" disabled={loading}  onClick={()=>getReservas(filterData)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
  <path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z" clipRule="evenodd" />
                 </svg>
                </button>
            </div>
        

            </div>

            <div className="pt-2 pb-4 sm:flex md:justify-between md:items-center grid gap-2">
                <SearchInput
                placeholder="Buscar por nombre"
                onChange={onChange}
                value={query}
                clear={()=>setQuery("")}
                onEnter={(query)=>searchQuery(query)}
                />
                <Pagination
                currentPage={page}
                setPage={(page)=>setPage(page)}
                totalCount={10}
                onPrev={()=>{}}
                onNext={()=>{}}
                />
            </div>

            </div>

            <div className=" overflow-auto">
            <ReservaList
            reservas={reservas}
            loading={loading}
            />
            </div>
            {/* {JSON.stringify(reservas)} */}
        </div>
    )
}

export default Page;