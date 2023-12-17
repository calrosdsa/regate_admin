import { useRef, useState } from "react";
import SelectTime from "../select/SelectTime";
import useEffectOnce from "@/core/util/hooks/useEffectOnce";
import moment from "moment";


const InputDateTime = ({
    label,className,datetime,setDate,setTime
}:{
    className?:string
    label:string
    datetime:{
        date: string | undefined;
        time: string | undefined;
    }
    setTime:(e:string)=>void
    setDate:(e:string)=>void
    
})=>{
    // const [date,setDate] = useState(datetime.date)
    // const [time,setTime] = useState(startTime)
    const inputDateRef = useRef<HTMLInputElement | null>(null)
    const {date,time} = datetime


    const setMinDate = () =>{
        var today = new Date().toISOString().split('T')[0];
        // const elem:any = document?.getElementById(label) 
        // elem[0].setAttribute('min', today);
        inputDateRef.current?.setAttribute('min',today)
    }
    const setInitialDateTime = () =>{
        if(date == ""){
            const m =  moment(new Date())
            setDate(m.format("yyyy-MM-DD"))
        }
    }

    useEffectOnce(()=>{
        setMinDate()
        setInitialDateTime()
    })
    return(
        <div className={`relative mt-3 w-full ${className}`}>
             {label != undefined &&
        <span className="label">{label}</span>
      }
        <label className="relative flex items-center input h-8 p-0 mt-2 w-full">
            <SelectTime
            setTime={(e)=>{
                const t = moment(e).utc().format("HH:mm")
                setTime(t)
            }}
            currentTime={time}
            />

            <label htmlFor={label} className="h-8 border-r border-t border-b border-gray-400 px-1
             grid place-content-center hover:bg-gray-200 w-10 ">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd" />
            </svg>
            </label>
            <input
            type="date"
            name="date"
            ref={inputDateRef}
            className="w-0 "
            onChange={(e)=>{
                setDate(e.target.value)
            }}
            value={date}
            id={label}
            />
            
            <input
            type="text"
            value={date + " " + time}
            className=" outline-none px-2 w-full"/>

           
        </label>


        </div>
    )
}

export default InputDateTime;