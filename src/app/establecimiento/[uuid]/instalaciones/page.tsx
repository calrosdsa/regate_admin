"use client"
import HorarioWeek from "@/components/instalacion/HorarioWeek";
import InstalacionCard from "@/components/instalacion/InstalacionCard";
import InstalacionDetail from "@/components/instalacion/InstalacionDetail";
import ReservaList from "@/components/reservas/ReservaList";
import { API_URL } from "@/context/config";
import { getInstalacion, getInstalaciones } from "@/core/repository/instalacion";
import { getInstalacionReservas } from "@/core/repository/reservas";
import { classNames } from "@/core/util";
import { Tab } from "@headlessui/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";


const Page = ()=>{
    const params = useParams()
    const [instalaciones,setInstalaciones] = useState<Instalacion[]>([])
    const [instalacion,setInstalacion] = useState<Instalacion | null>(null)
    const [reservas,setReservas] = useState<Reserva[]>([])
    // const data:Instalacion[] = await getInstalaciones(params.uuid)
    const getReservas = async()=>{
        if(instalacion != null) {
            const data:Reserva[] = await getInstalacionReservas(instalacion?.id)
            console.log("RESPONSE",data)
            setReservas(data)
        }
    }

    const getData = async()=>{
        const instalaciones:Instalacion[] = await getInstalaciones(params.uuid)
        setInstalaciones(instalaciones)
        if(instalaciones.length > 0){
            getInstalacionData(instalaciones[0].uuid)
        }
    }
    const getInstalacionData = async(uuid:string) => {
        const instalacion:Instalacion = await getInstalacion(uuid)
        setInstalacion(instalacion)
    }

    useEffect(()=>{
        getData()
    },[])

    useEffect(()=>{
        if(instalacion != null){
            getReservas()
        }
    },[instalacion])
    
    return(
        <div className="h-screen ">
            <div className="grid grid-cols-8 gap-x-3">
            <div className="flex flex-col col-span-2 p-2 border-[1px] shadow-lg h-screen overflow-auto">
                <button className="button-inv w-min whitespace-nowrap">Crear Instalacion</button>
            <h2 className="title">Instalaciones</h2>
                <div className="grid gap-y-2">
                {instalaciones.map((item)=>{
                    return(
                        <div key={item.uuid} onClick={()=>getInstalacionData(item.uuid)}>
                        <InstalacionCard
                        instalacion={item}
                        />
                        </div>
                    )})}
                        </div>
                    </div>

            <div className="flex flex-col col-start-3 col-span-full p-2 border-[1px] shadow-lg h-screen overflow-auto">
                {instalacion!= null && 
                <div>
                     <Tab.Group>
                    <Tab.List>
                        <Tab className={({ selected }) => `tab ${selected && "tab-enabled"}`}>Info</Tab>
                        <Tab className={({ selected }) => `tab ${selected && "tab-enabled"}`}>Horarios</Tab>
                        <Tab className={({ selected }) => `tab ${selected && "tab-enabled"}`}
                        onClick={()=>getReservas()}>Reservas</Tab>
                    </Tab.List>
                    <Tab.Panels className={"p-2"}>
                        <Tab.Panel className={"mx-auto flex justify-center w-3/4"}>
                            <InstalacionDetail instalacion={instalacion}/>
                        </Tab.Panel>
                        <Tab.Panel>
                            <HorarioWeek
                            instalacionId={instalacion.id}
                            />
                        </Tab.Panel>
                        <Tab.Panel>
                            <ReservaList
                            reservas={reservas}
                            />
                        </Tab.Panel>
                    </Tab.Panels>
                    </Tab.Group>
                </div>
                }
            {/* <Suspense fallback={<div>Loading...</div>}>
        <Instalacion instalacionUuid={uuid} />
             </Suspense> */}
            </div>
        
            </div>
        </div>
    )
}

export default Page;


async function Instalacion({instalacionUuid }: { instalacionUuid:string }) {
    // Wait for the instalacion promise to resolve
    const instalacion = await getInstalacion(instalacionUuid)
   
    return (
      <ul>
        {JSON.stringify(instalacion)}
      </ul>
    )
  }