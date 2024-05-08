    import DialogLayout from "@/components/util/dialog/DialogLayout"
import TimeSelect from "@/components/util/input/TimeSelect"
import TimeSelect2 from "@/components/util/input/TimeSelect2"
import Spinner from "@/components/util/loaders/Spinner"
import { days } from "@/context/actions/chart-actions"
import { successfulMessage, unexpectedError } from "@/context/config"
import { UpdateAttentionSchedule } from "@/core/repository/setting"
import moment from "moment"
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

    const onStartTimeChange = (e:string,index:number)=>{
        const updateList = data.schedule_interval.map((item,idx)=>{
            if(index == idx){
                item['start_time'] = e
            }
            return item
        })
        setData({
            ...data,
            schedule_interval:updateList
        })
    }

    const onEndTimeChange = (e:string,index:number)=>{
        const updateList = data.schedule_interval.map((item,idx)=>{
            if(index == idx){
                item['end_time'] = e
            }
            return item
        })
        setData({
            ...data,
            schedule_interval:updateList
        })
    }
    
    const deleteScheduleTime = (index:number) =>{
        // const newList = data.schedule_interval.splice(index,1)
        const newList = data.schedule_interval.map((item,idx)=>{
            if(idx == index){
                item.deleted = true
            }
            return item
        })
        setData({
            ...data,
            schedule_interval:newList
        })
    }


    const save = async() =>{
        try{
            setLoading(true)
            const res:AttentionSchedule = await UpdateAttentionSchedule(data)
            res.day_name = data.day_name
            updateData(res)
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
                        <>
                        {!item.deleted &&
                        <div key={index} className="flex space-x-2 items-center">
                            <TimeSelect2
                          time={item.start_time}
                          setTime={(e)=>{
                            console.log("HORA",e)
                            onStartTimeChange(e,index)
                            // const today = moment().format("yyyy-MM-DD")
                            // onChangeCustomPrecio("start_time",moment(today +" "+e).format("yyyy-MM-DD HH:mm"),index)
                          }}
                        //   disabledHours={disabledHours}
                          />

                            {/* <input type="time" className="input w-[120px]" value={item.start_time}
                            name="start_time"
                            onChange={(e)=>onStartTimeChange(e,index)}/> */}

                            {/* <input type="time" className="input w-[120px]" value={item.end_time}
                            name="end_time" onChange={(e)=>onEndTimeChange(e,index)}
                            /> */}

                         <TimeSelect2
                          time={item.end_time}
                          setTime={(e)=>{
                            // console.log("HORA",e)
                          onEndTimeChange(e,index)
                            // const today = moment().format("yyyy-MM-DD")
                            // onChangeCustomPrecio("start_time",moment(today +" "+e).format("yyyy-MM-DD HH:mm"),index)
                          }}/>

                            <svg onClick={()=>deleteScheduleTime(index)}
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                            className="icon-button">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        }
                        </>
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