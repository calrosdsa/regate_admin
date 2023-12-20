import { hours } from "@/context/actions/chart-actions"
import moment from "moment"
import { useEffect, useState } from "react"
import CalendarDialogReserva from "../dialog/CalendarDialogReserva"
import useEffectOnce from "@/core/util/hooks/useEffectOnce"
import { DayWeek, ReservaType } from "@/core/type/enums"
import { GetReservasCupo } from "@/core/repository/reservas"

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
const Calendar = ({uuid,uuidEvent,reserva_type,eventoId}:{
    eventoId:number
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

    const openDialog = (startDate:string,startTime:Date,shouldAdd:boolean) => {
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
            const request:ReservaCupoRequest = {
                start_date:daysWeek[0].date,
                end_date:daysWeek.slice(-1)[0].date,
                uuid:uuid
            }
            console.log("REQUEST",request)
            const res:ReservaCupo[] = await GetReservasCupo(request)
            setReservasCupo(res)
        }catch(e){
            console.log(e)
        }
    }

    const updateDateWeekWithCupos  = () =>{
        console.log(reservasCupo,"UPDATE --- C")
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
        console.log(dateWeekWithCupos,"D")
    }

    const generateDaysWeek = () =>{
        setDays([])
        let cupos:WeekDay[]= []
        for(let i =0;i< 7;i++){
            const today = moment(new Date())
            const t =  today.add(i,"days")
            const dayWeek:WeekDay = {
                day:t.format('DD'),
                name:t.format('dddd'),
                date:t.format("yyyy-MM-DD"),
                updatedCount:0
            }
            console.log(i,dayWeek)
            setDays(e=>[...e,dayWeek])
            cupos.push(dayWeek)
        }
        getReservasCupo(cupos)
    }

    const getCuposReservaByHora = ( index:number,hora:string) =>{
        //    console.log("TARGET DATE TIME",targetDateTime)
        try{
            // console.log(dateWeekWithCupos,"DATEWEEK")
            if(dateWeekWithCupos.length>0){
                const list = dateWeekWithCupos.find(item => item.index == index)?.cupose_reserva.filter(item=>moment(item.start_date.slice(0,16)).format("LT") == hora)
                return list
            }else{
                return []
            }
        }catch(err){
            console.log(err)
            return []
        }
    }

    // useEffect(()=>{
    //     if(days.length > 0){
    //         getReservasCupo()
    //         console.log(days[0].date,days.slice(-1)[0].date)
    //     }
    // },[])

    useEffect(()=>{
        if(reservasCupo.length>0){
            console.log(reservasCupo,"cupos")
            updateDateWeekWithCupos()
        }
    },[reservasCupo])

    useEffectOnce(()=>{
        generateDaysWeek()
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
        updateDateWithCupos={(e: ReservaCupo[])=>setReservasCupo([...reservasCupo,...e])}
        eventoId={eventoId}
        />
        }
        <div>
           
           <div className="relative overflow-x-auto mt-3 shadow-md">
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
        <thead className="text-xs text-gray-700 uppercase bg-white ">
            <tr>
                <th scope="col" className="px-6 py-3 w-12">
                
                </th>
                
                {days.map((item,idx)=>{
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
                            <td  className="p-4 w-14  bg-gray-200 relative">
                                <span className=" absolute top-2">{horaString}</span>
                            </td>

                            {days.map((t,idx2)=>{
                                return(
                                    <td key={idx2} className="border-l bg-gray-50">
                               <div onClick={()=>openDialog(t.date,item.hour,false)} className=" hover:bg-gray-100 w-full h-9 ">
                               <CalendarReserva
                                    reservaCupos={getCuposReservaByHora(idx2,horaString) || []}
                                    />
                               </div>

                               <div className="w-full border-t-[1px]"/>

                               <div onClick={()=>openDialog(t.date,item.hour,true)} className=" hover:bg-gray-100 w-full h-9 ">
                                    <CalendarReserva
                                    reservaCupos={getCuposReservaByHora(idx2,moment(item.hour).add(30,"minutes").utc().format("LT")) || []}
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
    reservaCupos
}:{
    reservaCupos:ReservaCupo[]
}) =>{
    return(
        <>
        {reservaCupos.length == 0 ?
        <div>

        </div>
        :
        <div className={`grid grid-cols-${reservaCupos.length} gap-x-1`}>
            {reservaCupos.map((item,i)=>{
                return(
                    <div key={i} className="bg-primary  h-9 z-10" />
                    
                )
            })}
        </div>
        }
            </>
    )
}