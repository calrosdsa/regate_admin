import { hours } from "@/context/actions/chart-actions"
import moment from "moment"
import { useCallback, useEffect, useRef, useState } from "react"
import CalendarDialogReserva from "../dialog/CalendarDialogReserva"
import useEffectOnce from "@/core/util/hooks/useEffectOnce"
import { DayWeek, ReservaType } from "@/core/type/enums"
import { GetReservasCupo } from "@/core/repository/reservas"
import Spinner from "@/presentation/util/loaders/Spinner"
import { toast } from "react-toastify"
import { unexpectedError } from "@/context/config"
import CreateReservaDialog from "@/presentation/reservas/dialog/CreateReservaDialog"
import InstalacionesDialog from "@/presentation/establecimiento/instalacion/dialog/InstalacionesDialog"
import { useAppDispatch, useAppSelector } from "@/context/reduxHooks"
import { fetchInstalaciones } from "@/context/actions/data-actions"
import { uiActions } from "@/context/slices/uiSlice"
import { Button, Paper, Typography } from "@mui/material"
import RefreshIcon from '@mui/icons-material/Refresh';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DialogCalendar from "@/presentation/util/dialog/DialogCalendar"
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

type WeekDay = {
    day:string
    name:string
    date:string
    updatedCount:number
}
type DateWeekWithCupos = {
    cupose_reserva:ReservaCupo[]
    index:number
}
const Calendar = ({uuid,uuidEvent,reserva_type,eventoId,eventoName,usersEvento}:{
    eventoId:number
    eventoName:string
    uuid:string
    uuidEvent:string
    reserva_type:ReservaType
    usersEvento:UserEmpresa[]
}) =>{
    const dispatch = useAppDispatch()
    const instalaciones = useAppSelector(state=>state.data.instalaciones)
    const [openReservaDialog,setOpenReservaDialog] = useState(false)
    const [startDate,setStartDate] = useState("")
    const [startTime,setStartTime] = useState<moment.Moment | undefined>(undefined)
    const [days,setDays] = useState<WeekDay[]>([])
    const [dateWeekWithCupos,setDateWeekWithCupos] = useState<DateWeekWithCupos[]>([])
    const [reservasCupo,setReservasCupo] = useState<ReservaCupo[]>([])
    const [countDays,setCountDays] = useState(1)
    const [dateFilter,setDateFilter] = useState(moment())
    const [loadingSpinner,setLoadingSpinner] = useState(false)
    const [deleteEventoCupos,setDeleteEventoCupos] = useState(false)
    const [openInstalacionesDialog,setOpenInstalacionesDialog] = useState(false)
    const [instalacion,setInstalacion] = useState<Instalacion | null >(null)
    const [openCalendar,setOpenCalendar] = useState(false)


    const selectInstalacion = () =>{
        dispatch(fetchInstalaciones(uuid,()=>{
            dispatch(uiActions.setLoaderDialog(true))
        },()=>{
            setOpenInstalacionesDialog(true)
            dispatch(uiActions.setLoaderDialog(false))
        }))
    }

    const openDialog = (startDate:string,time:Date,shouldAdd:boolean) => {
        const t = moment(time).utc()
        if(shouldAdd){
            t.add(30, 'minutes')
        }
        console.log(t.format("HH:mm"))
        console.log(moment(`${startDate} ${t.format("HH:mm")}`).format())
        setStartTime(moment(`${startDate} ${t.format("HH:mm")}`))
        selectInstalacion()
    }

    const getReservasCupo = async(daysWeek:WeekDay[]) =>{
        try{
            setLoadingSpinner(true)
            const request:ReservaCupoRequest = {
                start_date:daysWeek[0].date,
                end_date:daysWeek.slice(-1)[0].date,
                uuid:uuid
            }
            const res:ReservaCupo[] = await GetReservasCupo(request)
            setReservasCupo(res)
            setLoadingSpinner(false)
        }catch(e){
            setLoadingSpinner(false)
            toast.error(unexpectedError)
        }
    }

    const updateDateWeekWithCupos  = () =>{
        const resDates = reservasCupo.map(item=>item.start_date.slice(0,10))
        setDateWeekWithCupos([])
        const d = days.map((item,idx)=>{
            if(resDates.includes(item.date)){
                const filterDates = reservasCupo.filter(t=>item.date==t.start_date.slice(0,10))
                const n:DateWeekWithCupos= {
                    cupose_reserva:filterDates,
                    index:idx
                } 
                setDateWeekWithCupos(t=>[...t,n])
                item.updatedCount = item.updatedCount++
            }
            
            return item
        })
        setDays(d)
    }

    const generateDaysWeek = (startDate:moment.Moment,days:number = countDays) =>{
        setDays([])
        let cupos:WeekDay[]= []
        for(let i =0;i< days;i++){
            const t =  startDate.clone().add(i,"days")
            const dayWeek:WeekDay = {
                day:t.format('DD'),
                name:t.format('dddd'),
                date:t.format("yyyy-MM-DD"),
                updatedCount:0
            }
            setDays(e=>[...e,dayWeek])
            cupos.push(dayWeek)
        }
        getReservasCupo(cupos)
    }

    const getCuposReservaByHora = ( index:number,hora:string) =>{
        try{
            if(dateWeekWithCupos.length>0){
                const list = dateWeekWithCupos.find(item => item.index == index)?.cupose_reserva.filter(item=>moment(item.start_date.slice(0,16)).format("LT") == hora)
                return list
            }else{
                return []
            }
        }catch(err){
            return []
        }
    }

    // useEffect(()=>{
    //     if(days.length > 0){
    //         getReservasCupo()
    //     }
    // },[])

    useEffect(()=>{
        if(reservasCupo.length>0){
            updateDateWeekWithCupos()
        }
    },[reservasCupo])

    useEffect(()=>{
        if(reservasCupo.length == 0){
            generateDaysWeek(dateFilter)
        }
    },[])
    // useEffect(()=>{
    //     if(startTime != undefined){
    //         setOpenReservaDialog(true)
    //     }
    // },[startTime])
    return(
        <>
        {openInstalacionesDialog&&
        <InstalacionesDialog
        instalaciones={instalaciones}
        onAccept={(e)=>{
            setInstalacion(e)
            setOpenInstalacionesDialog(false)
            setOpenReservaDialog(true)
        }}
        openModal={openInstalacionesDialog}
        closeModal={()=>setOpenInstalacionesDialog(false)}
        />
        }
        {openReservaDialog &&
        <CreateReservaDialog
        uuid={uuid}
        open={openReservaDialog}
        close={()=>setOpenReservaDialog(false)}
        cupos={[]}
        onComplete={()=>{
            setCountDays(7)
            generateDaysWeek(dateFilter,7)
        }}
        cancha={instalacion}
        useAdvanceOptions={true}
        eventoId={eventoId}
        startTime={startTime}
        usersEvento={usersEvento}
        />
        }
         {openCalendar &&
        <DialogCalendar
        openModal={openCalendar}
        closeModal={()=>setOpenCalendar(false)}
        onAccept={(e)=>{
            if(e == null) return
            setDateFilter(e)
            generateDaysWeek(e)
        }}
        value={dateFilter}
        />
        }
        <div className="grid gap-y-2">
        <div className="flex pt-2 items-center space-x-2">
                    <Button 
                        variant={countDays == 1 ? "contained": "outlined"}
                        color="inherit"
                        onClick={()=>{
                        setCountDays(1)
                        generateDaysWeek(dateFilter,1)
                        }}
                        size="large"
                        startIcon={<CalendarTodayIcon fontSize="small"/>}
                        >
                        {/* <div className="grid gap-y-1 items-center"> */}
                        <Typography variant="caption" >Día</Typography>
                        {/* </div> */}
                        </Button>
                        <Button
                        variant={countDays == 7 ? "contained": "outlined"}
                        color="inherit"
                        onClick={()=>{
                            setCountDays(7)
                            generateDaysWeek(dateFilter,7)
                        }}
                        size="large"
                        startIcon={<CalendarMonthIcon/>}
                        >
                        <Typography variant="caption" >Semana</Typography>
                        </Button>

                      
                </div>


            <div className="flex justify-between w-full">

                <div className="flex space-x-1 items-center">
                    <Button 
                    variant="outlined" color="inherit"
                    onClick={()=>{
                        const p = dateFilter.subtract(1,"days")
                        setDateFilter(p)
                        generateDaysWeek(p)
                    }}
                    >
                        <KeyboardArrowLeftIcon/>
                    </Button>

                    <Button 
                    variant="outlined" color="inherit"
                    onClick={()=>{
                        const p = dateFilter.add(1,"days")
                        setDateFilter(p)
                        generateDaysWeek(p)
                    }}
                    >
                        <KeyboardArrowRightIcon/>
                    </Button>

                    <Button variant="outlined" color="inherit"
                     onClick={()=>setOpenCalendar(true)}
                        endIcon={
                            <CalendarTodayIcon/>
                        }>
                        {dateFilter.format("MMMM DD")}
                        {countDays >1 &&  dateFilter.clone().add(countDays,"days").format("-DD")}
                    </Button>

                    {/* <label htmlFor="date-calendar"  className="button-hover px-2 py-[6px] items-center flex space-x-2 ml-2 relative">
                        <span className="text-sm">{dateFilter.format("MMMM DD")}
                        {countDays >1 &&  dateFilter.clone().add(countDays,"days").format("-DD")}
                        </span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
                        </svg>
                    <input type="date" 
                    onChange={(e)=>{
                        const d = moment(e.target.value)
                        setDateFilter(d)
                        generateDaysWeek(d)
                    }}
                     id="date-calendar" className="w-0 h-0"/>
                    </label> */}


                    <Button 
                    variant="outlined" color="inherit"
                    onClick={()=>generateDaysWeek(dateFilter)}
                    >
                    <RefreshIcon/>
                    </Button>


                    {loadingSpinner &&
                    <div className="px-2">
                    <Spinner
                    classNameSpinner="fill-primary"
                    />
                    </div>
                    }

                </div>

                    <Button onClick={()=>{
                        const t = moment()
                        setDateFilter(t)
                        generateDaysWeek(t)
                    }} variant="outlined" color="inherit">
                        Hoy
                    </Button>
            </div>    

            <div>
                <div className="flex space-x-3 items-center">
                <div className="h-4 w-4 bg-green-600"/>
                <Typography variant="body2" 
                className="flex space-x-1 text-sm font-medium">Horas reservadas para ({eventoName})</Typography>
                </div>
                <div className="flex space-x-3 items-center">
                <div className="h-4 w-4 bg-primary"/>
                <Typography variant="body2"
                className="flex space-x-1 text-sm font-medium">Horas reservadas fuera del evento</Typography>
                </div>
            </div>
           
            <Paper elevation={0}>
           <div className="relative overflow-x-auto mt-3 shadow-md">
                
    <table className="w-full text-sm text-left rtl:text-right  ">
        <thead className="text-xs uppercase ">
            <tr>
                <th scope="col" className="px-2 py-3 w-10">
                
                </th>
                
                {days.slice(0,countDays).map((item,idx)=>{
                    return(    
                    <th key={idx} scope="col" className="px-6 py-3 headerTable border-[1px]">
                    <div className="flex flex-col items-center">
                    <span>{item.name}</span>
                    <span>{item.day}</span>
                    </div>
                </th>
                    )
                })}

               

              
            </tr>
        </thead>
        <tbody>
         

            {hours.map((item,idx)=>{
                        const horaString = moment(item.hour).utc().format("LT")
                        return(
                        <tr key={idx} className="border-b-2 ">
                            <td  className="p-4 w-10  relative">
                                <span className=" absolute top-2 left-0">{horaString}</span>
                            </td>

                            {days.slice(0,countDays).map((t,idx2)=>{
                                return(
                                    <td key={idx2} className="border-l  ">
                               <div onClick={()=>openDialog(t.date,item.hour,false)} className="w-full h-9 ">
                               <CalendarReserva
                                    reservaCupos={getCuposReservaByHora(idx2,horaString) || []}
                                    eventoId={eventoId}
                                    isWeek={countDays == 7 ? true:false}
                                    />
                               </div>

                               <div className="w-full border-t-[1px]"/>

                               <div onClick={()=>openDialog(t.date,item.hour,true)} className="w-full h-9 ">
                                    <CalendarReserva
                                    reservaCupos={getCuposReservaByHora(idx2,moment(item.hour).add(30,"minutes").utc().format("LT")) || []}
                                    eventoId={eventoId}
                                    isWeek={countDays == 7 ? true:false}
                                    />
                               </div>
                            </td>
                                )
                            })}   


                        </tr>
                        )
                    })}
        
                    </tbody>
                </table>
            </div>
            </Paper>
            
            </div>
        </>
    )
}

export default Calendar


const CalendarReserva = ({
    reservaCupos,eventoId,isWeek
}:{
    reservaCupos:ReservaCupo[]
    eventoId:number
    isWeek:boolean
}) =>{
    const [width,setWidth] = useState(isWeek?170:0)

    const measuredRef = useCallback((node:any) => {
        if (node !== null) {
            if(width == 0){
                setWidth(node.getBoundingClientRect().width );
            }
        }
      }, []);
    // const count = (220/reservaCupos.length) * 2

   
    return(
        <>
        {reservaCupos.length == 0 ?
        <div ref={measuredRef} className={`${isWeek ? `w-[170px]`:"w-full"} flex `}>

        </div>
        :
        <div ref={measuredRef} className={`${isWeek ? `w-[170px]`:"w-full"} flex `}>
            {reservaCupos.map((item,i)=>{
                return(
                    <div key={i}
                    style={{
                        width:(width) /reservaCupos.length
                    }}
                     className={`h-9 border-l z-10 ${eventoId == item.evento_id ? "bg-green-600": "bg-primary"}`} />
                    
                )
            })}
        </div>
        }
            </>
    )
}