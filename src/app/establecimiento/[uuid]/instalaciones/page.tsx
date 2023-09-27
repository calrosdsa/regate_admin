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
import { unexpectedError } from "@/context/config";
import { useAppDispatch, useAppSelector } from "@/context/reduxHooks";
import { uiActions } from "@/context/slices/uiSlice";
import { GetCupoReservaInstalciones, GetInstalacion, getInstalacionDayHorario, getInstalaciones } from "@/core/repository/instalacion";
import { GetReservaDetail, getInstalacionReservas } from "@/core/repository/reservas";
import { Tab } from "@headlessui/react";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "react-toastify";
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
    const [createReservaDialog,setCreateReservaDialog] = useState(false)
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [loadingInstalacion,setLoadingInstalacion] = useState(false)
    const [loadingReservas,setLoadingReservas] = useState(false)
    const [loadingInstalaciones,setLoadingInstalaciones] = useState(false)
    const [instalaciones,setInstalaciones] = useState<Instalacion[]>([])
    const [instalacion,setInstalacion] = useState<Instalacion | null>(null)
    const [reservaDetail,setReservaDetail] = useState<ReservaDetail | null>(null)
    const [cupos,setCupos] = useState<Cupo[]>([])
    const [cuposReservas,setCuposReservas] = useState<CupoReserva[]>([])
    const [selectedDay,setSelectedDay] = useState<number | null>(null)
    const [openCreateInstalacion,setOpenCreateInstalacion] = useState(false)
    const [openReservaDetailDialog,setOpenReservaDetailDialog] = useState(false)
    const [selectedCupos,setSelectedCupos] = useState<CupoReserva[]>([])
    const [loadingHorarios,setLoadingHorarios] = useState(false)

    const appendSerachParams = (key:string,value:string)=>{
        current.set(key,value);
        const search = current.toString();
        const query = search ? `?${search}` : "";
        router.push(`${pathname}${query}`);
    }
    
  
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
            console.log(res)
            setReservaDetail(res)
            dispatch(uiActions.setLoaderDialog(false))
        }catch(err){
            dispatch(uiActions.setLoaderDialog(false))
        }
    }
    const getHorariosDay = async(day:number,id:number) =>{
        try{
            setCupos([])
            setLoadingHorarios(true)
            appendSerachParams("tabIndex","1")
            const res:Cupo[] =  await getInstalacionDayHorario(id,day)
            setCupos(res)
            setSelectedDay(day)
            setLoadingHorarios(false)
        }catch(err){
            setLoadingHorarios(false)
            console.log(err)
        }
    }

    const getData = async()=>{
        try{
            setLoadingInstalaciones(true)
            const instalaciones:Instalacion[] = await getInstalaciones(params.uuid)
            setInstalaciones(instalaciones)
            if(instalaciones.length > 0){
                if(instalacionId != null){
                    getInstalacionData(instalacionId,instalaciones)
                }else{
                    getInstalacionData(instalaciones[0].uuid,instalaciones)
                }
            }
            setLoadingInstalaciones(false)
        }catch(err){
            setLoadingInstalaciones(false)
            toast.error(unexpectedError)
        }
    }
    const getInstalacionData = async(uuid:string,results:Instalacion[]) => {
        const instalacion = results.find(item=>item.uuid == uuid)
        if(instalacion == undefined) return
        if(tabIndex!= null){
            if(tabIndex == "2"){
                console.log("UPDATED INSTALACION RESERVAS")
                // getCupos(res.id,true)
                setInstalacion(instalacion)
                getCuposReservaInstalacion(instalacion.id)
            }else if(tabIndex == "1"){
                // console.log(tabIndex,"TABINDEX")
                getHorariosDay(currentDay,instalacion.id)
                setInstalacion(instalacion)
            }else if(tabIndex == "0"){
                getInstalacion(uuid)
            }
        }else{
           getInstalacion(uuid)
        }
    }

    const getInstalacion=async(uuid:string) =>{
        try{
            setLoadingInstalacion(true)
            const res:Instalacion = await GetInstalacion(uuid)
            // console.log(res)
            setInstalacion(res)
            appendSerachParams("id",res.uuid)
            setLoadingInstalacion(false)
        }catch(err){
            console.log(err)
            setLoadingInstalacion(false)
        }
    }

    
    const selectReservaCupo = (cupo:CupoReserva) => {
        console.log(cupo,"CUPO SELECTED")
        if(selectedCupos.map((item=>item.time)).includes(cupo.time)){
            const newList = selectedCupos.filter(item=>item.time != cupo.time)
            setSelectedCupos(newList)
        }else{
            setSelectedCupos(v=>[...v,cupo])
        }
        // console.log(selectedCupos)
    }

    useEffect(()=>{
        getData()
    },[])

    useEffect(()=>{
        if(instalacion != null){
            if(tabIndex == "2"){
                getCuposReservaInstalacion(instalacion.id)

            }
            console.log("UPDATED")
        }
    },[instalacion])

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
        <div className="px-1 h-full  w-full">
            <div className="md:grid md:grid-cols-8 gap-x-3 xl:pt-0">
                
            <div className="flex flex-col w-full col-span-2 p-2 border-[1px] shadow-lg md:h-screen overflow-auto ">
                <div className="flex justify-between">
                <button onClick={()=>setOpenCreateInstalacion(true)} className="button-inv w-min h-10 whitespace-nowrap">Crear Cancha</button>

                <button className="button w-min h-10" disabled={loadingInstalaciones} onClick={()=>{
                    setInstalaciones([])
                    getData()
                    }}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z" clipRule="evenodd" />
                                </svg>
                                </button>

                </div>
            <h2 className="title py-2">Cancha</h2>
                <div className="flex md:gap-y-2 w-fulll overflow-auto md:grid ">
                    <Loading
                    loading={loadingInstalaciones}
                    className="flex justify-center mb-2"
                    />
                {instalaciones.map((item)=>{
                    return(
                        <div key={item.uuid} 
                        className={`hover:bg-gray-200 p-1 rounded-lg ${instalacion?.id == item.id && "bg-gray-200"}`}
                        onClick={()=>{
                        setInstalacion(null)
                        getInstalacion(item.uuid)
                        }}>
                        <InstalacionCard
                        instalacion={item}
                        />
                        </div>
                    )})}
                        </div>
                    </div>

            <div className="flex flex-col col-start-3 col-span-full  md:border-[1px] md:shadow-lg h-screen md:overflow-auto">

                <div>
                     <Tab.Group defaultIndex={tabIndex != null ? Number(tabIndex):0}>
                    <Tab.List className={" sticky top-0 bg-gray-50  w-full z-10 py-3"}>
                        <Tab className={({ selected }) => `tab ${selected && "tab-enabled"}`}
                        onClick={()=>{
                            if(instalacion == null) return
                            setInstalacion(null)
                            appendSerachParams("tabIndex","0")
                            getInstalacion(instalacion.uuid)
                            }}>Info</Tab>
                        <Tab className={({ selected }) => `tab ${selected && "tab-enabled"}`}
                        onClick={()=>{
                            if(instalacion == null) return
                            // if(cupos.length>0) {
                            //     appendSerachParams("tabIndex","1")
                            //     return
                            // }
                            getHorariosDay(currentDay,instalacion.id)
                        }}>Horarios</Tab>
                        <Tab className={({ selected }) => `tab ${selected && "tab-enabled"}`}
                        onClick={()=>{      
                            if(instalacion == null) return
                            // if(ReservaInstalacionCupos.length >0 ){
                            // appendSerachParams("tabIndex","2")
                            //     return
                            // }
                            appendSerachParams("tabIndex","2")
                            getCuposReservaInstalacion(instalacion.id)
                            }}>Reservas</Tab>
                    </Tab.List>


                    <Tab.Panels className={"p-2"}>
                        <Tab.Panel className={"mx-auto flex justify-center w-full sm:w-3/4"}>
                            {/* {JSON.stringify(instalacion)} */}
                            <Loading
                            loading={loadingInstalacion}
                            className="flex justify-center w-full mt-2"/>
                    {instalacion != null && 
                            <InstalacionDetail 
                            uuid={params.uuid}
                            instalacion={instalacion}
                            update={(name,value)=>{
                                setInstalacion({...instalacion,[name]:value})
                            }}
                            />
                        }
                        </Tab.Panel>
                        {instalacion != null && 
                        <Tab.Panel>
                            <HorarioWeek
                            instalacionId={instalacion.id}
                            selectedDay={selectedDay}
                            cupos={cupos}
                            getHorarioDay={(day:number)=>getHorariosDay(day,instalacion.id)}
                            loading={loadingHorarios}
                            />
                        </Tab.Panel>
                        }
                         {instalacion != null && 
                        <Tab.Panel>
                           <div>

                            <div className=" sticky top-[60px] bg-gray-50 w-full z-10 -mt-3">

                           <div className="flex gap-2  pb-2 flex-wrap items-end ">
                                <button className="button  w-min h-10" disabled={loadingReservas} onClick={()=>{
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
                                     className={`items-center justify-center h-10 w-36 flex space-x-1 whitespace-nowrap
                                     ${selectedCupos.length == 0 ? "button-disabled":"button"}`}
                                     disabled={selectedCupos.length == 0} onClick={()=>setCreateReservaDialog(true)}>
                                        <span>Crear Reserva</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                        <path d="M10.75 6.75a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" />
                                    </svg>
                                    </button>
                                </TooltipContainer>

                            </div>
                            <div className="pb-2">
                                {startDate == null ?
                                <span className="label ">{new Date().toLocaleDateString("es-US", options)}</span>
                                :
                                <span className="label">{startDate.toLocaleDateString("es-US", options)}</span>
                                }
                            </div>
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
                            date={startDate || new Date()}
                            />
                            </div>
                        </Tab.Panel>
                        }
                    </Tab.Panels>
                    </Tab.Group>
                </div>
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
        data={reservaDetail}
        />
        }

        {(createReservaDialog && instalacion != null) &&
        <CreateReservaDialog
        open={createReservaDialog}
        close={()=>setCreateReservaDialog(false)}
        reservaCupos={selectedCupos}
        instalacion={instalacion}
        refresh={()=>getCuposReservaInstalacion(instalacion.id)}
        uuid={params.uuid}
        />
        }
    </>
    )
}

export default Page;
