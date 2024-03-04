import { hours } from "@/context/actions/chart-actions"
import moment from "moment"
import { useCallback, useEffect, useRef, useState } from "react"
import CalendarDialogReserva from "../dialog/CalendarDialogReserva"
import useEffectOnce from "@/core/util/hooks/useEffectOnce"
import { DayWeek, ReservaType } from "@/core/type/enums"
import { GetReservasCupo } from "@/core/repository/reservas"
import Spinner from "@/components/util/loaders/Spinner"
import { toast } from "react-toastify"
import { unexpectedError } from "@/context/config"

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
const Calendar = ({uuid,uuidEvent,reserva_type,eventoId,eventoName}:{
    eventoId:number
    eventoName:string
    uuid:string
    uuidEvent:string
    reserva_type:ReservaType
}) =>{
    const [openReservaDialog,setOpenReservaDialog] = useState(false)
    const [startDate,setStartDate] = useState("")
    const [startTime,setStartTime] = useState(moment(new Date()))
    const [days,setDays] = useState<WeekDay[]>([])
    const [dateWeekWithCupos,setDateWeekWithCupos] = useState<DateWeekWithCupos[]>([])
    const [reservasCupo,setReservasCupo] = useState<ReservaCupo[]>([])
    const [countDays,setCountDays] = useState(1)
    const [dateFilter,setDateFilter] = useState(moment())
    const [loadingSpinner,setLoadingSpinner] = useState(false)
    const [deleteEventoCupos,setDeleteEventoCupos] = useState(false)

    const openDialog = (startDate:string,startTime:Date,shouldAdd:boolean) => {
        setDeleteEventoCupos(false)
        setStartDate(startDate)
        const t = moment(startTime).utc()
        if(shouldAdd){
            t.add(30, 'minutes')
            setStartTime(t)
        }else{
            setStartTime(t)

        }
        setOpenReservaDialog(true)
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

    useEffectOnce(()=>{
        generateDaysWeek(dateFilter)
    })
    return(
        <>
        {openReservaDialog &&
        <CalendarDialogReserva
        uuid={uuid}
        open={openReservaDialog}
        close={()=>setOpenReservaDialog(false)}
        startTime={startTime}
        startDate={startDate}
        reserva_type={reserva_type}
        uuidEvent={uuidEvent}
        updateDateWithCupos={(e: ReservaCupo[],deleteCupos:boolean)=>{
            if(deleteCupos){
                const filterList = reservasCupo.filter(item=>!e.map(t=>t.start_date).includes(item.start_date))
                setReservasCupo(filterList)
            }else{
                setReservasCupo([...reservasCupo,...e])
            }
        }}
        eventoId={eventoId}
        // isForDelete={deleteEventoCupos}
        />
        }
        <div className="grid gap-y-2">
        <div className="flex pt-2 items-center space-x-2">
                    <button onClick={()=>{
                        setCountDays(1)
                        generateDaysWeek(dateFilter,1)
                        }} className="button-hover py-1 grid">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75Z" clipRule="evenodd" />
                    </svg>
                        <span className="text-xs">Día</span>
                        </button>
                        <button className="button-hover py-1 grid place-items-center px-2"
                        onClick={()=>{
                            setCountDays(7)
                            generateDaysWeek(dateFilter,7)
                        }}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path d="M5.25 12a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75H6a.75.75 0 0 1-.75-.75V12ZM6 13.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V14a.75.75 0 0 0-.75-.75H6ZM7.25 12a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75H8a.75.75 0 0 1-.75-.75V12ZM8 13.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V14a.75.75 0 0 0-.75-.75H8ZM9.25 10a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75H10a.75.75 0 0 1-.75-.75V10ZM10 11.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V12a.75.75 0 0 0-.75-.75H10ZM9.25 14a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75H10a.75.75 0 0 1-.75-.75V14ZM12 9.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V10a.75.75 0 0 0-.75-.75H12ZM11.25 12a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75H12a.75.75 0 0 1-.75-.75V12ZM12 13.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V14a.75.75 0 0 0-.75-.75H12ZM13.25 10a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75H14a.75.75 0 0 1-.75-.75V10ZM14 11.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V12a.75.75 0 0 0-.75-.75H14Z" />
                        <path fillRule="evenodd" d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75Z" clipRule="evenodd" />
                        </svg>

                        <span className="text-xs">Semana</span>
                        </button>

                      
                </div>


            <div className="flex justify-between w-full">

                <div className="flex space-x-1 items-center">
                    <button onClick={()=>{
                        const p = dateFilter.subtract(1,"days")
                        setDateFilter(p)
                        generateDaysWeek(p)
                    }}
                    className="button-hover px-1 py-[6px]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                className="w-5 h-5 ">
                <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z" clipRule="evenodd" />
                </svg>
                    </button>

                    <button 
                    onClick={()=>{
                        const p = dateFilter.add(1,"days")
                        setDateFilter(p)
                        generateDaysWeek(p)
                    }}
                    className="button-hover px-1 py-[6px]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                className="w-5 h-5">
                <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clipRule="evenodd" />
                </svg>
                    </button>

                    <label htmlFor="date-calendar"  className="button-hover px-2 py-[6px] items-center flex space-x-2 ml-2 relative">
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
                    </label>


                    <button onClick={()=>{
                        setDeleteEventoCupos(true)
                        setOpenReservaDialog(true)
                    }}
                     className="button-hover py-[6px] px-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z" clipRule="evenodd" />
                        </svg>
                    </button>


                    <button 
                    onClick={()=>generateDaysWeek(dateFilter)}
                    className="button-hover py-[6px] px-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H3.989a.75.75 0 0 0-.75.75v4.242a.75.75 0 0 0 1.5 0v-2.43l.31.31a7 7 0 0 0 11.712-3.138.75.75 0 0 0-1.449-.39Zm1.23-3.723a.75.75 0 0 0 .219-.53V2.929a.75.75 0 0 0-1.5 0V5.36l-.31-.31A7 7 0 0 0 3.239 8.188a.75.75 0 1 0 1.448.389A5.5 5.5 0 0 1 13.89 6.11l.311.31h-2.432a.75.75 0 0 0 0 1.5h4.243a.75.75 0 0 0 .53-.219Z" clipRule="evenodd" />
                    </svg>

                    </button>


                    {loadingSpinner &&
                    <div className="px-2">
                    <Spinner
                    classNameSpinner="fill-primary"
                    />
                    </div>
                    }

                </div>

                    <button onClick={()=>{
                        const t = moment()
                        setDateFilter(t)
                        generateDaysWeek(t)
                    }}  className="button-hover px-2 py-1 text-sm">
                        Hoy
                    </button>
            </div>    

            <div>
                <div className="flex space-x-3 items-center">
                <div className="h-4 w-4 bg-green-600"/>
                <span className="flex space-x-1 text-sm font-medium">Horas reservadas para ({eventoName})</span>
                </div>
                <div className="flex space-x-3 items-center">
                <div className="h-4 w-4 bg-primary"/>
                <span className="flex space-x-1 text-sm font-medium">Horas reservadas fuera del evento</span>
                </div>
            </div>
           
           <div className="relative overflow-x-auto mt-3 shadow-md">


    <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
        <thead className="text-xs text-gray-700 uppercase bg-white ">
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
                        <tr key={idx} className="bg-white border-b-2 ">
                            <td  className="p-4 w-10 bg-gray-200 relative">
                                <span className=" absolute top-2 left-0">{horaString}</span>
                            </td>

                            {days.slice(0,countDays).map((t,idx2)=>{
                                return(
                                    <td key={idx2} className="border-l bg-gray-50 ">
                               <div onClick={()=>openDialog(t.date,item.hour,false)} className=" hover:bg-gray-100 w-full h-9 ">
                               <CalendarReserva
                                    reservaCupos={getCuposReservaByHora(idx2,horaString) || []}
                                    eventoId={eventoId}
                                    isWeek={countDays == 7 ? true:false}
                                    />
                               </div>

                               <div className="w-full border-t-[1px]"/>

                               <div onClick={()=>openDialog(t.date,item.hour,true)} className=" hover:bg-gray-100 w-full h-9 ">
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