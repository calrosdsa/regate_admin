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
    cupos_reserva:ReservaCupo[]
}
const Calendar = ({uuid,uuidEvent,reserva_type}:{
    uuid:string
    uuidEvent:string
    reserva_type:ReservaType
}) =>{
    const [openReservaDialog,setOpenReservaDialog] = useState(false)
    const [startDate,setStartDate] = useState("")
    const [startTime,setStartTime] = useState(moment(new Date()))
    const [days,setDays] = useState<WeekDay[]>([])

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
            const res:ReservaCupo[] = await GetReservasCupo(request)
            const resDates = res.map(item=>moment(item.start_date).format("yyyy-MM-DD"))
            const d = daysWeek.map((item)=>{
                if(resDates.includes(item.date)){
                    const filterDates = res.filter(t=>item.date== moment(t.start_date).format("yyyy-MM-DD"))
                    item.cupos_reserva = filterDates
                }
                return item
            })
            setDays(d)
            console.log(res)
        }catch(e){

        }

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
                cupos_reserva:[]
            }
            console.log(i,dayWeek)
            setDays(e=>[...e,dayWeek])
            cupos.push(dayWeek)
        }
        getReservasCupo(cupos)
    }

    const getCuposReservaByHora = ( cuposReserva:ReservaCupo[],currentDate:string,hora:string) =>{
           const targetDateTime = currentDate + " " + hora
           console.log("TARGET DATE TIME",targetDateTime)
        try{
            const list = cuposReserva.filter(item=>moment(item.start_date).utc().format("yyyy-MM-DD HH:mm") == moment(targetDateTime).format("yyyy-MM-DD HH:mm"))
            console.log(list,moment(targetDateTime).format())
            return list
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

                            {days.map((t,idx)=>{
                                return(
                                    <td key={idx} className="border-l bg-gray-50">
                               <div onClick={()=>openDialog(t.date,item.hour,false)} className=" hover:bg-gray-100 w-full h-9">
                               {t.cupos_reserva.map(m=>moment(m.start_date).utc().format("LT")).includes(horaString) &&
                                <div>
                                HERE {getCuposReservaByHora(t.cupos_reserva,t.date,horaString).length}
                                </div>
                                }
                               </div>

                               <div className="w-full border-t-[1px]"/>

                               <div onClick={()=>openDialog(t.date,item.hour,true)} className=" hover:bg-gray-100 w-full h-9">
                                {t.cupos_reserva.map(m=>moment(m.start_date).utc().format("LT")).includes(horaString) &&
                                <div>
                                HERE {getCuposReservaByHora(t.cupos_reserva,t.date,moment(item.hour).add(30,"minutes").utc().format("LT")).length}
                                </div>
                                }
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