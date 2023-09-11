"use client"
import HorarioWeek from "@/components/establecimiento/instalacion/HorarioWeek";
import InstalacionCard from "@/components/establecimiento/instalacion/InstalacionCard";
import InstalacionDetail from "@/components/establecimiento/instalacion/InstalacionDetail";
import ReservaInstalacionCupos from "@/components/establecimiento/instalacion/ReservaInstalacionCupos";
import CreateInstalacionDialog from "@/components/establecimiento/instalacion/dialog/CreateInstalacionDialog";
import CreateReservaDialog from "@/components/reservas/dialog/CreateReservaDialog";
import DialogReservaDetail from "@/components/reservas/dialog/DialogReservaDetail";
import Loading from "@/components/util/loaders/Loading";
import { TooltipIcon, TooltipContainer } from "@/components/util/tooltips/Tooltip";
import { API_URL } from "@/context/config";
import { useAppDispatch, useAppSelector } from "@/context/reduxHooks";
import { uiActions } from "@/context/slices/uiSlice";
import { GetCupoReservaInstalciones, getInstalacion, getInstalacionDayHorario, getInstalaciones } from "@/core/repository/instalacion";
import { GetReservaDetail, getInstalacionReservas } from "@/core/repository/reservas";
import { Order } from "@/core/type/enums";
import { classNames } from "@/core/util";
import useDebounce from "@/core/util/hooks/useDebounce";
import { appendSerachParams } from "@/core/util/routes";
import { Tab } from "@headlessui/react";
import { spawn } from "child_process";
import moment from "moment";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
// import { Tooltip } from 'react-tooltipp

const Page = ({ params }: { params: { uuid: string } })=>{
    const options: any | undefined = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const searchParams = useSearchParams();
    const instalacionId = searchParams.get("id")
    const tabIndex = searchParams.get("tabIndex")
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    const currentDay = new Date().getDay()
    const dispatch = useAppDispatch()
    const pathname = usePathname();
    const router = useRouter()
    const uiState = useAppSelector(state=>state.ui)
    const [createReservaDialog,setCreateReservaDialog] = useState(false)
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [loadingReservas,setLoadingReservas] = useState(false)
    const [instalaciones,setInstalaciones] = useState<Instalacion[]>([])
    const [instalacion,setInstalacion] = useState<Instalacion | null>(null)
    const [reservaDetail,setReservaDetail] = useState<Reserva | null>(null)
    const [cupos,setCupos] = useState<Cupo[]>([])
    const [cuposReservas,setCuposReservas] = useState<CupoReserva[]>([])
    const [selectedDay,setSelectedDay] = useState<number | null>(null)
    const [openCreateInstalacion,setOpenCreateInstalacion] = useState(false)
    const [openReservaDetailDialog,setOpenReservaDetailDialog] = useState(false)
    const [selectedCupos,setSelectedCupos] = useState<CupoReserva[]>([])
  
    const getCuposReservaInstalacion = async(instalacionId:number) => {
        try{
            setCuposReservas([])
            setLoadingReservas(true)
            let filterData:CupoReservaRequest;
            if(startDate == null){
                const date = new Date()
                filterData = {
                    day_week:date.getDay(), 
                    date:date.toJSON().slice(0,10),
                    instalacion_id:instalacionId
                }
            }else{
                filterData = {
                    day_week:startDate.getDay(),
                    date:startDate.toJSON().slice(0,10),
                    instalacion_id:instalacionId
                }
            }
            console.log(filterData)
            const data = await GetCupoReservaInstalciones(filterData)
            setCuposReservas(data)
            setLoadingReservas(false)
            setSelectedCupos([])
        }catch(err){
            setLoadingReservas(false)
            console.log(err)
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
    const getHorariosDay = async(day:number,id:number) =>{
        try{
                appendSerachParams("tabIndex","1",router,current,pathname)
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
        const res:Instalacion = await getInstalacion(uuid)
        setInstalacion(res)
        appendSerachParams("id",res.uuid,router,current,pathname)
        if(tabIndex!= null){
            if(tabIndex == "2"){
                console.log(tabIndex,"TABINDEX")
                // getCupos(res.id,true)
                getCuposReservaInstalacion(res.id)
            }else if(tabIndex == "1"){
                console.log(tabIndex,"TABINDEX")
                getHorariosDay(currentDay,res.id)
            }
        }
    }

    const selectReservaCupo = (cupo:CupoReserva) => {
        console.log(cupo)
        if(selectedCupos.map((item=>item.time)).includes(cupo.time)){
            const newList = selectedCupos.filter(item=>item.time != cupo.time)
            setSelectedCupos(newList)
        }else{
            setSelectedCupos([...selectedCupos,cupo])
        }
        console.log(selectedCupos)
    }

    useEffect(()=>{
        getData()
    },[])

    useEffect(()=>{
        console.log(startDate,"START DATE")
        if(startDate != null){
            if(instalacion != null){
                getCuposReservaInstalacion(instalacion.id)
            }
        }
    },[startDate])
    useEffect(()=>{
        if(reservaDetail != null){
            setOpenReservaDetailDialog(true)
        }
    },[reservaDetail])
   
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
        <div className="px-1 h-screen pt-10 xl:pt-0 w-full">
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

            <div className="flex flex-col col-start-3 col-span-full p-2 md:border-[1px] md:shadow-lg h-screen md:overflow-auto">
                {instalacion!= null && 
                <div>
                     <Tab.Group defaultIndex={tabIndex != null ? Number(tabIndex):0}>
                    <Tab.List>
                        <Tab className={({ selected }) => `tab ${selected && "tab-enabled"}`}>Info</Tab>
                        <Tab className={({ selected }) => `tab ${selected && "tab-enabled"}`}
                        onClick={()=>{
                            if(cupos.length>0) {
                                appendSerachParams("tabIndex","1",router,current,pathname)
                                return
                            }
                            getHorariosDay(currentDay,instalacion.id)
                        }}>Horarios</Tab>
                        <Tab className={({ selected }) => `tab ${selected && "tab-enabled"}`}
                        onClick={()=>{
                            if(cuposReservas.length>0) {
                                appendSerachParams("tabIndex","2",router,current,pathname)
                                return
                            }
                            getCuposReservaInstalacion(instalacion.id)
                            }}>Reservas</Tab>
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
                           <div>
                           <div className="flex gap-2 pt-2 pb-2 flex-wrap items-end">
                                <button className="button w-min h-10" disabled={loadingReservas} onClick={()=>{
                                     getCuposReservaInstalacion(instalacion.id)
                                    }}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z" clipRule="evenodd" />
                                </svg>
                                </button>
                                {/* <label htmlFor="date">Choose Date</label> */}
                                <div className="w-[122px]">
                                <input type="date" id="date" 
                                value={startDate == null ? new Date().toJSON().slice(0,10) :startDate.toJSON().slice(0,10)}
                                onChange={(e)=>{
                                    console.log(e.target.value)
                                    const date = new Date(e.target.value)
                                    date.setTime(date.getTime()+ (10*60*60*1000))
                                    setStartDate(date)}}
                                 className="input w-[120px]"/>  
                                </div>

                               
                                <TooltipContainer 
                                helpText="Intenta seleccionar las casillas que no hayan sido reservadas."
                                disabled={selectedCupos.length != 0}
                                >
                                    <button
                                     className={`items-center justify-center h-10 w-32 flex space-x-1 whitespace-nowrap
                                     ${selectedCupos.length == 0 ? "button-disabled":"button"}`}
                                     disabled={selectedCupos.length == 0} onClick={()=>setCreateReservaDialog(true)}>
                                        <span>Crear Reserva</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                        <path d="M10.75 6.75a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" />
                                    </svg>
                                    </button>
                                </TooltipContainer>
                                
                               
{/* 
                        <button className="button-inv  h-10 whitespace-nowrap" disabled={loadingReservas} onClick={()=>{
                                     getCuposReservaInstalacion(instalacion.id)
                                    }}>
                                Aplicar cambios
                                </button> */}
                            </div>
                            <div className="pb-2">
                                {startDate == null ?
                                <span className="label ">{new Date().toLocaleDateString("es-US", options)}</span>
                                :
                                <span className="label">{startDate.toLocaleDateString("es-US", options)}</span>
                                }
                            </div>

                            <Loading
                            loading={loadingReservas}
                             className="flex justify-center mb-2"
                            />
                            <ReservaInstalacionCupos
                            cupos={cuposReservas}
                            loading={loadingReservas}
                            getReservaDetail={(id)=>getReservaDetail(id)}
                            selecReservaCupo={(e)=>selectReservaCupo(e)}
                            selectedCupos={selectedCupos}
                            />
                            </div>
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
        {(openReservaDetailDialog && reservaDetail != null) &&
        <DialogReservaDetail
        open={openReservaDetailDialog}
        close={()=>setOpenReservaDetailDialog(false)}
        reserva={reservaDetail}
        />
        }

        {(createReservaDialog && instalacion != null) &&
        <CreateReservaDialog
        open={createReservaDialog}
        close={()=>setCreateReservaDialog(false)}
        reservaCupos={selectedCupos}
        instalacion={instalacion}
        />
        }
    </>
    )
}

export default Page;
