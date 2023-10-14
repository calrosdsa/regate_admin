import DialogLayout from "@/components/util/dialog/DialogLayout"
import Spinner from "@/components/util/loaders/Spinner"
import { days } from "@/context/actions/chart-actions"
import { successfulMessage, unexpectedError } from "@/context/config"
import { UpdateAttentionSchedule } from "@/core/repository/setting"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"


const AttentionScheduleDialog = ({open,close,currentScheduleDay,setCurrentScheduleDay,updateData}:{
    open:boolean
    close:()=>void
    currentScheduleDay:AttentionSchedule
    setCurrentScheduleDay:(dayWeek:number)=>void
    updateData:(e:AttentionSchedule)=>void
}) =>{
    const [data,setData] = useState(currentScheduleDay)
    const [loading,setLoading] = useState(false)
    const addHours = () =>{
        const scheduleTime:AttentionScheduleTime = {
            start_time:"",
            end_time:"",
            id:0,
            schedule_id:data.id,
            deleted:false
        }
        setData({
            ...data,
            schedule_interval:[...data.schedule_interval,scheduleTime]
        })
    }

    const onStartTimeChange = (e:React.ChangeEvent<HTMLInputElement>,index:number)=>{
        const updateList = data.schedule_interval.map((item,idx)=>{
            if(index == idx){
                item['start_time'] = e.target.value
            }
            return item
        })
        setData({
            ...data,
            schedule_interval:updateList
        })
    }

    const onEndTimeChange = (e:React.ChangeEvent<HTMLInputElement>,index:number)=>{
        const updateList = data.schedule_interval.map((item,idx)=>{
            if(index == idx){
                item['end_time'] = e.target.value
            }
            return item
        })
        setData({
            ...data,
            schedule_interval:updateList
        })
    }
    
    const deleteScheduleTime = (index:number) =>{
    }


    const save = async() =>{
        try{
            setLoading(true)
            await UpdateAttentionSchedule(data)
            updateData(data)
            setLoading(false)
            close()
            toast.success(successfulMessage)
        }catch(err){
            toast.success(unexpectedError)
            setLoading(false)
        }
    }

    useEffect(()=>{
        setData(currentScheduleDay)
    },[currentScheduleDay])
    return(
        <DialogLayout
        open={open}
        close={close}
        className=" max-w-sm"
        showHeader={false}
        // title="Selecciona el día y la hora"
        >
            <div className="flex justify-center text-lg border-b-[1px] pb-3 pt-1 border-gray-400">
                Selecciona el día y la hora</div>

            <div className="">

            <div className="flex space-x-3 w-full justify-center pt-2">
            {days.map((item,index)=>{
                return(
                    <div key={index} onClick={()=>setCurrentScheduleDay(item.value)}
                    className={`icon-button flex justify-center items-center noSelect
                    ${data.day_week == item.value ? "text-primary bg-primary bg-opacity-10"
                    :"border-[1px] border-gray-300"}
                    `}>
                        <span>{item.day.slice(0,1)}</span>
                    </div>
                )
            })}
            </div>

            <div className=" flex flex-col space-y-4 px-2 sm:px-10 pt-3">
                <div className=" flex space-x-4">
                <input type="checkbox" name="select" id="open" checked={data.open}
                onChange={(e)=>{
                    if(data.open){
                        setData({
                            ...data,
                            open:false,
                        })
                    }else{

                        setData({
                            ...data,
                            open:e.target.value == "on" ?true : false,
                            closed:e.target.value != "on" ?true : false
                        })
                    }
                    console.log(e.target.value)
                }}
                />
                <label htmlFor="open" className=" cursor-pointer font-normal noSelect">Abierto las 24 horas</label>
                </div>
                <div className=" flex space-x-4">
                <input type="checkbox" name="select" id="closed" checked={data.closed}
                onChange={(e)=>{
                    if(data.closed){
                        setData({
                            ...data,
                            closed:false,
                        })
                    }else{   
                        setData({
                            ...data,
                            closed:e.target.value == "on" ?true : false,
                            open:e.target.value != "on" ?true : false
                        })  
                        console.log(e.target.value)
                    }
                }}/>
                <label htmlFor="closed" className="cursor-pointer font-normal noSelect">Cerrado</label>
                </div>
            </div>

           
        {(!data.closed && !data.open)&&
        <>
            <div className=" flex flex-col space-y-4 px-2 sm:px-10 pt-3">
                {data.schedule_interval.map((item,index)=>{
                    return(
                        <div key={index} className="flex space-x-2 items-center">
                            <input type="time" className="input w-28" value={item.start_time}
                            name="start_time"
                            onChange={(e)=>onStartTimeChange(e,index)}/>
                            <input type="time" className="input w-28" value={item.end_time}
                            name="end_time" onChange={(e)=>onEndTimeChange(e,index)}
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                             className="icon-button">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                    )
                })}
            </div>

               {data.schedule_interval.length < 3 && 
                   <div className=" flex flex-col space-y-4 px-2 sm:px-10 pt-1 w-min whitespace-nowrap">
                <span onClick={()=>addHours()}
                 className="text-button noSelect">Agregar horas</span>
                </div>
                }
        </>
        }


            <div className=" flex space-x-3 justify-end  pt-2">
                <span onClick={close}
                 className="text-button noSelect">Cancelar</span>
                <div onClick={save}
                className="text-button noSelect w-20 flex justify-center">
                    {loading ?
                    <Spinner/>
                    :
                    <span>Guardar</span>
                    }
                </div>
            </div>

            </div>    
        </DialogLayout>
    )
}

export default AttentionScheduleDialog;