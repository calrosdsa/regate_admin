import { useRef, useState } from "react";
import useEffectOnce from "@/core/util/hooks/useEffectOnce";
import moment from "moment";
import { hours } from "@/context/actions/chart-actions";


const TimeSelect2 = ({
    className,time,setTime,disabledHours
}:{
    className?:string
    time: string | undefined
    setTime:(e:string)=>void
    disabledHours?:string[]
    
})=>{
    // const [date,setDate] = useState(datetime.date)
    // const [time,setTime] = useState(startTime)



    return(
        <div className={`relative mt-1 grid  ${className}`}>
             {/* {label != undefined &&
        <span className="label">{label}</span>
      } */}

            <select name="" id="" required className="select h-8 mt-1"
            value={time?.slice(0,5)} 
             onChange={(e)=>setTime(e.target.value)}>
                <option value=""></option>
                {hours.map((item,index)=>{
                    const t =moment(item.hour).utc().format("HH:mm")
                    const value2 = moment(item.hour).utc().add(30,"minutes").format("HH:mm")
                    return (
                        <>
                        <option key={index} value={t} disabled={disabledHours?.includes(t)}>{t}</option>
                        <option key={index +100} disabled={disabledHours?.includes(value2)}
                        value={value2}>
                            {/* {item.hour} */}
                            {value2}
                            </option>
                        </>
                    )
                })}
                <option value="24:00">24:00</option>
                {/* <option value="24:00">
                    24:00
                </option> */}
            </select>
            
            {/* <TimeSelect2
            setTime={(e)=>{
                const t = e.utc().format("HH:mm")
                setTime(t)
            }}
            currentTime={time}
            /> */}

          
{/*             
            <input
            type="text"
            value={time}
            onChange={(e)=>{}}
            className=" outline-none px-2 w-full"/> */}

        </div>
    )
}

export default TimeSelect2;