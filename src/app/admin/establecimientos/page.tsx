"use client"

import { getEstablecimientos } from "@/core/repository/establecimiento"
import Link from "next/link"
import { useEffect, useState } from "react"





  export default async function Page(){
    const [establecimientos,setEstablecimientos] = useState<Establecimiento[]>([])
    const getData = async()=>{
            const data:Establecimiento[] = await getEstablecimientos()
            console.log("RESPONSE",data)
            setEstablecimientos(data)
            // setReservas(data)
    }

    useEffect(()=>{
        getData()
    },[])
    // const data:Establecimiento[] = await getData()

    return (
        <div className="w-full  xl:w-10/12 mx-auto">
            
         <button className="button">Crear Establecimiento</button>   
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
