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
        <div className="h-screen overflow-auto">

            <div className="mt-2">
         <Link href={"/create-establecimiento"}
          className="button">Crear Establecimiento</Link>   
          </div>
         <div className="h-4"/>

         <div className=" overflow-auto">

         <div className={`grid  relative ${loading && "h-20"}`}>
            <Loading
            loading={loading}
            className=" absolute top-12 left-1/2 -translate-x-1/2"
            />
    <table className="w-full  text-left">
        <thead className="text-xs text-gray-700 uppercase bg-gray-200  ">
            <tr>
                <th scope="col" className="px-6 py-3">
                    Nombre del Establecimiento
                </th>
                <th scope="col" className="px-6 py-3">
                    Color
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
                <td className="px-6 py-4">
                    Silver
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
