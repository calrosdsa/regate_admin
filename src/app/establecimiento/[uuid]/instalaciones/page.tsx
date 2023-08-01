"use client"
import CreateInstalacion from "@/components/establecimiento/instalacion/CreateInstalacion";
import HorarioWeek from "@/components/establecimiento/instalacion/HorarioWeek";
import InstalacionCard from "@/components/establecimiento/instalacion/InstalacionCard";
import InstalacionDetail from "@/components/establecimiento/instalacion/InstalacionDetail";
import CreateInstalacionDialog from "@/components/establecimiento/instalacion/dialog/CreateInstalacionDialog";
import ReservaList from "@/components/reservas/ReservaList";
import { API_URL } from "@/context/config";
import { getInstalacion, getInstalaciones } from "@/core/repository/instalacion";
import { getInstalacionReservas } from "@/core/repository/reservas";
import { classNames } from "@/core/util";
import { Tab } from "@headlessui/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";


const Page = ({ params }: { params: { uuid: string } })=>{
    const [instalaciones,setInstalaciones] = useState<Instalacion[]>([])
    const [instalacion,setInstalacion] = useState<Instalacion | null>(null)
    const [reservas,setReservas] = useState<Reserva[]>([])
    const [openCreateInstalacion,setOpenCreateInstalacion] = useState(false)
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
        console.log(uuid)
        const instalacion:Instalacion = await getInstalacion(uuid)
        setInstalacion(instalacion)
    }

    useEffect(()=>{
        getData()
    },[])

    // useEffect(()=>{
    //     if(instalacion != null){
    //         getReservas()
    //     }
    // },[instalacion])
    
    return(
        <>
        {openCreateInstalacion&&
        <CreateInstalacionDialog
        uuid={params.uuid}
        close={()=>setOpenCreateInstalacion(false)}
        open={openCreateInstalacion}
        addInstalacion={(e:Instalacion)=>setInstalaciones([...instalaciones,e])}
        />
        }
        <div className="h-screen ">
            <div className="md:grid md:grid-cols-8 gap-x-3">
            <div className="flex flex-col w-full col-span-2 p-2 border-[1px] shadow-lg md:h-screen overflow-auto ">
                <button onClick={()=>setOpenCreateInstalacion(true)} className="button-inv w-min whitespace-nowrap">Crear Cancha</button>
            <h2 className="title py-2">Cancha</h2>
                <div className="flex md:gap-y-2 w-fulll overflow-auto md:grid ">
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
                        <Tab.Panel className={"mx-auto flex justify-center w-full sm:w-3/4"}>
                            <InstalacionDetail 
                            uuid={params.uuid}
                            instalacion={instalacion}
                            update={(name,value)=>{
                                setInstalacion({...instalacion,[name]:value})
                            }}
                            />
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
    </>
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