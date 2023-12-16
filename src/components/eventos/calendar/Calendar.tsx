import { hours } from "@/context/actions/chart-actions"
import moment from "moment"
import { useState } from "react"
import CalendarDialogReserva from "../dialog/CalendarDialogReserva"
import useEffectOnce from "@/core/util/hooks/useEffectOnce"
import { DayWeek } from "@/core/type/enums"

type WeekDay = {
    day:string
    name:string
    date:string
}
const Calendar = () =>{
    const [openReservaDialog,setOpenReservaDialog] = useState(false)
    const [startDate,setStartDate] = useState("")
    const [startTime,setStartTime] = useState("")
    const [days,setDays] = useState<WeekDay[]>([])

    const openDialog = (startDate:string,startTime:Date,shouldAdd:boolean) => {
        setStartDate(startDate)
        const t = moment(startTime).utc()
        if(shouldAdd){
            t.add(30, 'minutes')
            setStartTime(t.format("HH:mm"))
        }else{
            setStartTime(t.format("HH:mm"))

        }
        setOpenReservaDialog(true)
    }

    const generateDaysWeek = () =>{
        setDays([])
        for(let i =0;i< 7;i++){
            const today = moment(new Date())
            const t =  today.add(i,"days")
            const dayWeek:WeekDay = {
                day:t.format('DD'),
                name:t.format('dddd'),
                date:t.format("yyyy-MM-DD")
            }
            console.log(i,dayWeek)
            setDays(e=>[...e,dayWeek])
        }
    }



    useEffectOnce(()=>{
        generateDaysWeek()
    })
    return(
        <>
        {openReservaDialog &&
        <CalendarDialogReserva
        open={openReservaDialog}
        close={()=>setOpenReservaDialog(false)}
        startTime={startTime}
        startDate={startDate}
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
                        return(
                        <tr className="bg-white border-b-2 ">
                            <td key={idx} className="p-4 w-14  bg-gray-200 relative">
                                <span className=" absolute top-2">{moment(item.hour).utc().format("LT")}</span>
                            </td>

                            {days.map((t,idx)=>{
                                return(
                                    <td key={idx} className="border-l bg-gray-50">
                               <div onClick={()=>openDialog(t.date,item.hour,false)} className=" hover:bg-gray-100 w-full h-9">

                               </div>

                               <div className="w-full border-t-[1px]"/>

                               <div onClick={()=>openDialog(t.date,item.hour,true)} className=" hover:bg-gray-100 w-full h-9">

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