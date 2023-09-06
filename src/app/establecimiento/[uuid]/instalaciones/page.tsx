"use client"
import CreateInstalacion from "@/components/establecimiento/instalacion/CreateInstalacion";
import HorarioWeek from "@/components/establecimiento/instalacion/HorarioWeek";
import InstalacionCard from "@/components/establecimiento/instalacion/InstalacionCard";
import InstalacionDetail from "@/components/establecimiento/instalacion/InstalacionDetail";
import CreateInstalacionDialog from "@/components/establecimiento/instalacion/dialog/CreateInstalacionDialog";
import ReservaList from "@/components/reservas/ReservaList";
import { API_URL } from "@/context/config";
import { getInstalacion, getInstalacionDayHorario, getInstalaciones } from "@/core/repository/instalacion";
import { getInstalacionReservas } from "@/core/repository/reservas";
import { classNames } from "@/core/util";
import { Tab } from "@headlessui/react";
import Link from "next/link";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";


const Page = ({ params }: { params: { uuid: string } })=>{
    const searchParams = useSearchParams();
    const instalacionId = searchParams.get("id")
    const tabIndex = searchParams.get("tabIndex")
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    const pathname = usePathname();
    const router = useRouter()
    const currentDay = new Date().getDay()
    const [loadingReservas,setLoadingReservas] = useState(false)
    const [instalaciones,setInstalaciones] = useState<Instalacion[]>([])
    const [instalacion,setInstalacion] = useState<Instalacion | null>(null)
    const [reservas,setReservas] = useState<Reserva[]>([])
    const [cupos,setCupos] = useState<Cupo[]>([])
    const [selectedDay,setSelectedDay] = useState<number | null>(null)


    const [openCreateInstalacion,setOpenCreateInstalacion] = useState(false)
    const appendSerachParams = (key:string,value:string)=>{
        current.set(key,value);
        const search = current.toString();
        const query = search ? `?${search}` : "";
        router.push(`${pathname}${query}`);
    }
    const getReservas = async(id:number,forceLoad:boolean = false)=>{
        if(reservas.length > 0 && !forceLoad) return
        appendSerachParams("tabIndex","2")
        try{
            setReservas([])
            setLoadingReservas(true)
            const data:Reserva[] = await getInstalacionReservas(id)
            console.log("RESPONSE",data)
            setReservas(data)
            setLoadingReservas(false)
        }catch(err){
            setLoadingReservas(false)
        }
    }
  


    const getHorariosDay = async(day:number,id:number) =>{
        try{
                appendSerachParams("tabIndex","1")
                const res:Cupo[] =  await getInstalacionDayHorario(id,day)
                setCupos(res)
                setSelectedDay(day)
        }catch(err){
            console.log(err)
        }
    }

    const getData = async()=>{
        const instalaciones:Instalacion[] = await getInstalaciones(params.uuid)
        setInstalaciones(instalaciones)
        if(instalaciones.length > 0){
            if(instalacionId != null){
                getInstalacionData(instalacionId)
            }else{
                getInstalacionData(instalaciones[0].uuid)
            }
        }
    }
    const getInstalacionData = async(uuid:string) => {
        // console.log(uuid)
        const res:Instalacion = await getInstalacion(uuid)
        setInstalacion(res)
        appendSerachParams("id",res.uuid)
        if(tabIndex!= null){
            if(tabIndex == "2"){
                console.log(tabIndex,"TABINDEX")
                getReservas(res.id,true)
            }else if(tabIndex == "1"){
                console.log(tabIndex,"TABINDEX")
                getHorariosDay(currentDay,res.id)
            }
        }
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
        <div className="px-2 h-screen pt-10 xl:pt-0 w-full">
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
                     <Tab.Group defaultIndex={tabIndex != null ? Number(tabIndex):0}>
                    <Tab.List>
                        <Tab className={({ selected }) => `tab ${selected && "tab-enabled"}`}>Info</Tab>
                        <Tab className={({ selected }) => `tab ${selected && "tab-enabled"}`}
                        onClick={()=>{
                            if(cupos.length>0) {
                                appendSerachParams("tabIndex","1")
                                return
                            }
                            getHorariosDay(currentDay,instalacion.id)
                        }}>Horarios</Tab>
                        <Tab className={({ selected }) => `tab ${selected && "tab-enabled"}`}
                        onClick={()=>getReservas(instalacion.id)}>Reservas</Tab>
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
                            selectedDay={selectedDay}
                            cupos={cupos}
                            getHorarioDay={(day:number)=>getHorariosDay(day,instalacion.id)}
                            />
                        </Tab.Panel>
                        <Tab.Panel>
                            <ReservaList
                            loading={loadingReservas}
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