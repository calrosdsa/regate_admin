"use client"

import Loading from "@/components/util/loaders/Loading"
import { GetEstablecimientos } from "@/core/repository/establecimiento"
import Link from "next/link"
import { useEffect, useState } from "react"

    
  export default function Page(){
    const [establecimientos,setEstablecimientos] = useState<EstablecimientoData[]>([])
    const [loading,setLoading] = useState(false)
    const getDataEstablecimientos = async()=>{
        try{
            setEstablecimientos([])
            setLoading(true)
            const data:EstablecimientoData[] = await GetEstablecimientos()
            console.log("RESPONSE",data)
            setEstablecimientos(data)
            setLoading(false)
        }catch(err){
            setLoading(true)
            console.log("ERROR",err)
        }
            // setReservas(data)
    }

    useEffect(()=>{
        getDataEstablecimientos()
    },[])
    // const data:Establecimiento[] = await getData()

    return (
        <div className=" px-2">

            <div className=" flex space-x-3 pt-2">
         <Link href={"/create-establecimiento"}
          className="button">Crear Establecimiento</Link>   
          <button className="button w-min " disabled={loading} onClick={()=>getDataEstablecimientos()}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z" clipRule="evenodd" />
                                </svg>
                </button>
          </div>
         <div className="h-4"/>

         <div className=" overflow-auto">

         <div className={`  relative ${loading && "h-20"}`}>
            <Loading
            loading={loading}
            className=" absolute top-12 left-1/2 -translate-x-1/2"
            />
    <table className="w-full  text-left">
        <thead className="text-xs text-gray-700 uppercase bg-gray-200 ">
            <tr>
                <th scope="col" className="px-6 py-3 h">
                    Nombre del Establecimiento
                </th>
                <th scope="col" className="px-6 py-3 ">
                </th>
               
            </tr>
        </thead>
        <tbody>
            {establecimientos.map((item,index)=>{
                return(
                    <tr key={item.uuid} className={`${index % 2 && "bg-gray-100"}`}>
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    <Link href={`./establecimiento/${item.uuid}`}>
                    {item.name}
                    </Link>
                </th>
                <td className="px-6 py-4 underline text-primary cursor-pointer">
                <Link href={`./establecimiento/${item.uuid}`}>Ver</Link>
                </td>
            </tr>
       )})}
           
        </tbody>
    </table>
         </div>
       </div>

        </div>
    )
}
