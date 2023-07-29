"use client"

import { GetEstablecimientos } from "@/core/repository/establecimiento"
import Link from "next/link"
import { useEffect, useState } from "react"

interface EstablecimientoData {
    description:string
    is_open:boolean
    name:string
    id:number
    photo:string
    uuid:string
}
  export default function Page(){
    const [establecimientos,setEstablecimientos] = useState<EstablecimientoData[]>([])
    const getDataEstablecimientos = async()=>{
        try{

            const data:EstablecimientoData[] = await GetEstablecimientos()
            console.log("RESPONSE",data)
            setEstablecimientos(data)
        }catch(err){
            console.log("ERROR",err)
        }
            // setReservas(data)
    }

    useEffect(()=>{
        getDataEstablecimientos()
    },[])
    // const data:Establecimiento[] = await getData()

    return (
        <div className="w-full  xl:w-10/12 mx-auto">
            
         <Link href={"/create-establecimiento"}
          className="button">Crear Establecimiento</Link>   
         <div className="h-4"/>
    <table className="w-full text-sm text-left text-gray-500 ">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100  ">
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
            {establecimientos.map((item)=>{
                return(
            <tr key={item.uuid} className="bg-white border-b">
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
    )
}
