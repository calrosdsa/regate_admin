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
import { GetCupoReservaInstalciones, GetInstalacion, GetInstalaciones, getInstalacionDayHorario } from "@/core/repository/instalacion";
import { GetReservaDetail, getInstalacionReservas } from "@/core/repository/reservas";
// import { Tab } from "@headlessui/react";
import { Box, Button, Tab, Tabs } from "@mui/material";
import moment from "moment";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "react-toastify";
import SettingsIcon from '@mui/icons-material/Settings';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import DialogCalendar from "@/components/util/dialog/DialogCalendar";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DialogConfigureHorarioInstalaciones from "@/components/establecimiento/instalacion/dialog/ConfigureHorarioInstalaciones";
// import { Tooltip } from 'react-tooltipp

enum TabInstalacion {
    INFO,
    HORARIO,
    RESERVAS
}
const Page = ({ params }: { params: { uuid: string } })=>{
    const options: any | undefined = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const searchParams = useSearchParams();
    const instalacionId = searchParams.get("id")
    const tabIndex = searchParams.get("tabIndex")
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    const dispatch = useAppDispatch()
    const pathname = usePathname();
    const router = useRouter()
    const [createReservaDialog,setCreateReservaDialog] = useState(false)
    const [startDate, setStartDate] = useState<moment.Moment | null>(moment());
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
    const [currentDay,setCurrentDay] = useState<number>(new Date().getDay())
    const [currentTab, setCurrentTab] = useState<TabInstalacion>(Number(tabIndex));
    const [openCalendar,setOpenCalendar] = useState(false)
    const [openConfigureInstalacionesHorario,setOpenCofigureInstalaciones] = useState(false)

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
                    end_date:moment(date).add(1,'days').format("yyyy-MM-DD"),
                    instalacion_id:instalacionId
                }
            }else{
                filterData = {
                    day_week:startDate.day(),
                    date:startDate.toJSON().slice(0,10),
                    end_date:moment(startDate).add(1,'days').format("yyyy-MM-DD"),
                    instalacion_id:instalacionId
                }
            }
            const data = await GetCupoReservaInstalciones(filterData)
            setCuposReservas(data)
            setLoadingReservas(false)
            setSelectedCupos([])
        }catch(err){
            setLoadingReservas(false)
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
            setCupos([])
            setCurrentDay(day)
            setLoadingHorarios(true)
            appendSerachParams("tabIndex","1")
            const res:Cupo[] =  await getInstalacionDayHorario(id,day)
            setCupos(res)
            setSelectedDay(day)
            setLoadingHorarios(false)
        }catch(err){
            setLoadingHorarios(false)
        }
    }

    const getData = async()=>{
        try{
            setLoadingInstalaciones(true)
            const instalaciones:Instalacion[] = await GetInstalaciones(params.uuid)
            setInstalaciones(instalaciones)
            if(instalaciones.length > 0){
                // if(instalacionId != null){
                //     getInstalacionData(instalacionId,instalaciones)
                // }else{
                    getInstalacionData(instalaciones[0].uuid,instalaciones)
                // }
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
                // getCupos(res.id,true)
                setInstalacion(instalacion)
                getCuposReservaInstalacion(instalacion.id)
            }else if(tabIndex == "1"){
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
            setInstalacion(null)
            const res:Instalacion = await GetInstalacion(uuid)
            setInstalacion(res)
            appendSerachParams("id",res.uuid)
            setLoadingInstalacion(false)
        }catch(err){
            setLoadingInstalacion(false)
        }
    }

    
    const selectReservaCupo = (cupo:CupoReserva) => {
        if(selectedCupos.map((item=>item.time)).includes(cupo.time)){
            const newList = selectedCupos.filter(item=>item.time != cupo.time)
            setSelectedCupos(newList)
        }else{
            setSelectedCupos(v=>[...v,cupo])
        }
    }

    useEffect(()=>{
        getData()
    },[])

    useEffect(()=>{
        if(instalacion != null){
            if(tabIndex == "2"){
                getCuposReservaInstalacion(instalacion.id)
            }
        }
    },[instalacion])

    useEffect(()=>{
        if(startDate != null){
            if(instalacion != null){
                getCuposReservaInstalacion(instalacion.id)
            }
        }
    },[startDate])
    useEffect(()=>{
        if(reservaDetail != null){
            setOpenReservaDetailDialog(true)
            appendSerachParams("dialog","1")
        }
    },[reservaDetail])

    useEffect(()=>{
        window.addEventListener("popstate",()=>{
                setOpenReservaDetailDialog(false)
                setCreateReservaDialog(false)
                setOpenCreateInstalacion(false)
        });
    return () => {
        window.removeEventListener("popstate", (e)=>{
        });
    };
    },[])
   
    return(
        <>
        {openConfigureInstalacionesHorario &&
        <DialogConfigureHorarioInstalaciones
        openModal={openConfigureInstalacionesHorario}
        closeModal={()=>setOpenCofigureInstalaciones(false)}
        />
        }
        {openCalendar &&
        <DialogCalendar
        openModal={openCalendar}
        closeModal={()=>setOpenCalendar(false)}
        onAccept={(e)=>setStartDate(e)}
        value={startDate}
        />
        }
        
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
                <Button 
                variant="outlined"
                onClick={()=>{
                    appendSerachParams("dialog","1")
                    setOpenCreateInstalacion(true)
                    }} className="w-min h-10 whitespace-nowrap">Crear Cancha</Button>

                <div className="flex space-x-2">
                    <Button variant="contained"
                    onClick={()=>setOpenCofigureInstalaciones(true)}
                    >
                        <SettingsIcon/>
                    </Button>
                <Button variant="contained" className="w-min h-10" disabled={loadingInstalaciones} onClick={()=>{
                    setInstalaciones([])
                    getData()
                }}>
                    <RefreshIcon/>
                </Button>
                </div>    

                </div>
            <h2 className="title py-2">Cancha</h2>
                <div className="flex md:flex-col w-fulll overflow-auto md:gap-y-2 pb-3 md:pb-0 space-x-2 md:space-x-0  md:h-min">
                    <Loading
                    loading={loadingInstalaciones}
                    className="flex justify-center mb-2"
                    />
                {instalaciones.map((item)=>{
                    return(
                        <div key={item.uuid} 
                        className={`hover:bg-gray-200  border-[1px] rounded-lg ${instalacion?.id == item.id && "bg-gray-200"}`}
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
                <Tabs
                className="fixed bg-white z-10 w-full pb-2"
                value={currentTab}
                onChange={(e,v)=>setCurrentTab(v)}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="scrollable auto tabs example"
            >
              <Tab label="Info" onClick={()=>{
                            if(instalacion == null) return
                            setInstalacion(null)
                            appendSerachParams("tabIndex","0")
                            getInstalacion(instalacion.uuid)
                            }}/>
                <Tab label="Horarios" onClick={()=>{
                            if(instalacion == null) return
                            // if(cupos.length>0) {
                            //     appendSerachParams("tabIndex","1")
                            //     return
                            // }
                            getHorariosDay(currentDay,instalacion.id)
                        }} />
                <Tab label="Reservas" onClick={()=>{      
                            if(instalacion == null) return
                            // if(ReservaInstalacionCupos.length >0 ){
                            // appendSerachParams("tabIndex","2")
                            //     return
                            // }
                            appendSerachParams("tabIndex","2")
                            getCuposReservaInstalacion(instalacion.id)
                            }}/>   
            </Tabs>

            {currentTab == TabInstalacion.INFO &&
                            <div className={"mx-auto flex justify-center w-full sm:w-3/4 pt-16"}>
                            {/* {JSON.stringify(instalacion)} */}
                            <Loading
                            loading={loadingInstalacion}
                            className="flex justify-center w-full mt-2"/>
                    {instalacion != null && 
                            <InstalacionDetail 
                            uuid={params.uuid}
                            instalacion={instalacion}
                            refresh={getData}
                            update={(name,value)=>{
                                setInstalacion({...instalacion,[name]:value})
                            }}
                            />
                        }
                        </div>
            }

            {currentTab == TabInstalacion.HORARIO &&
                        instalacion != null && 
                        <div className="pt-14 p-2">
                            <HorarioWeek
                            instalacionId={instalacion.id}
                            selectedDay={selectedDay}
                            cupos={cupos}
                            getHorarioDay={(day:number)=>getHorariosDay(day,instalacion.id)}
                            loading={loadingHorarios}
                            instalaciones={instalaciones}
                            updateHorarios={(e)=>setCupos(e)}
                            />
                            </div>
                    }
            {currentTab == TabInstalacion.RESERVAS && 
                    instalacion != null && 
                           <div className="p-2 pt-14">

                            <Box  className="bg-gray-50 w-full z-10 sticky top-14 ">

                           <div className="flex gap-2  pb-2 flex-wrap items-end ">
                                <Button variant="contained" className="w-min" disabled={loadingReservas} onClick={()=>{
                                     getCuposReservaInstalacion(instalacion.id)
                                    }}>
                                <RefreshIcon/>
                                </Button>

                                <Button variant="contained" onClick={()=>setOpenCalendar(true)}
                                endIcon={
                                    <CalendarTodayIcon/>
                                }>
                                    {startDate?.format("DD MMMM")}
                                </Button>
                             
                                {/* <div className="mx-2 ">          
                                <label htmlFor="date-calendar"  className="px-2 h-10 button  items-center flex space-x-2 relative
                                w-full">
                                    <span className="text-sm">{moment(startDate).format("MMMM DD")}
                                    </span>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
                                    </svg>
                                <input type="date" 
                                
                                onChange={(e)=>{
                                    const date = new Date(e.target.value)
                                    date.setTime(date.getTime()+ (10*60*60*1000))
                                    setStartDate(date)}}
                                id="date-calendar" className="w-0 h-0"/>
                                </label>
                           
                                </div> */}


                                <TooltipContainer 
                                helpText="Intenta seleccionar las casillas que no hayan sido reservadas."
                                disabled={selectedCupos.length != 0}
                                >
                                    <Button
                                    variant="contained"
                                    onClick={()=>{
                                        appendSerachParams("dialog","1")
                                        setCreateReservaDialog(true)}}
                                     endIcon={
                                        <AddIcon/>
                                     }   
                                        >
                                        Crear Reserva
                                    </Button>
                                </TooltipContainer>

                            </div>

                            {/* <div className="pb-2">
                                {startDate == null ?
                                <span className="label ">{new Date().toLocaleDateString("es-US", options)}</span>
                                :
                                <span className="label">{startDate.toLocaleDateString("es-US", options)}</span>
                                }
                            </div> */}

                            </Box>



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
                            date={startDate || moment()}
                            />
                            </div>
                        }
                </div>
            </div>
            </div>
        </div>
        {(openReservaDetailDialog && reservaDetail != null) &&
        <DialogReservaDetail
        open={openReservaDetailDialog}
        close={()=>setOpenReservaDetailDialog(false)}
        data={reservaDetail}
        update={()=>getCuposReservaInstalacion(reservaDetail.instalacion.id)}
        uuid={params.uuid}
        />
        }

        {(createReservaDialog && instalacion != null) &&
        <CreateReservaDialog
        open={createReservaDialog}
        close={()=>setCreateReservaDialog(false)}
        cupos={selectedCupos}
        cancha={instalacion}
        refresh={()=>getCuposReservaInstalacion(instalacion.id)}
        uuid={params.uuid}
        useAdvanceOptions={selectedCupos.length == 0}
        eventoId={null}
        />
        }
    </>
    )
}

export default Page;
