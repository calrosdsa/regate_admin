import moment from "moment"
import { useState } from "react"
import AttentionScheduleDialog from "./AttentionScheduleDialog"

const AttentionScheduleComponent = ({attention_schedue_week,updateList}:{
    attention_schedue_week:AttentionSchedule[]
    updateList:(e:AttentionSchedule[])=>void
}) =>{
    const [openDialog,setOpenDialog] = useState(false)
    const [currentScheduleDay,setCurrentScheduleDay] = useState(attention_schedue_week[0])

    return(
        <>
        {openDialog &&
        <AttentionScheduleDialog
        close={()=>setOpenDialog(false)}
        open={openDialog}
        currentScheduleDay={currentScheduleDay}
        setCurrentScheduleDay={(dayWeek)=>{
            const scheduleDay = attention_schedue_week.find(item=>item.day_week == dayWeek)
            if(scheduleDay != undefined){
                setCurrentScheduleDay(scheduleDay)
            }
        }}
        updateData={(e)=>{
            const newList = attention_schedue_week.map((item)=>{
                if(item.day_week == e.day_week){
                    const n = e.schedule_interval.filter(t => t.deleted == false)
                    e.schedule_interval = n
                    item = e
                }
                return item
            })
            updateList(newList)
        }}
        />
        }
        <div className=" grid gap-y-2">
            {/* {JSON.stringify(attention_schedue_week)} */}
            {attention_schedue_week.map((item,index)=>{
                return(
                    <div key={index} className="flex w-full justify-between items-center border-b ">
                        <span className="">{item.day_name}</span>

                        <div className="flex space-x-2 items-center ">
                            {(!item.open &&!item.closed && item.schedule_interval.length > 0 )&&
                                    <div className="grid">
                                    {item.schedule_interval.map((item,index)=>{
                                        return(
                                            <span className="text-sm"
                                            key={index}>{item.start_time.slice(0,5)} - {item.end_time.slice(0,5)}</span>
                                            )
                                        })}
                                        </div>
                            }
                            {item.closed &&
                                <span>Cerrado</span>
                            }    
                            {item.open &&
                                <span>Abierto las 24 horas</span>
                            }    
                        <svg onClick={()=>{
                            setCurrentScheduleDay(attention_schedue_week[index])
                            setOpenDialog(true)
                        }}
                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                        className="icon-button noSelect">
  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                      </svg>
                            </div>
                    </div>
                )
            })}
        </div>
    </>
    )
}

export default AttentionScheduleComponent;