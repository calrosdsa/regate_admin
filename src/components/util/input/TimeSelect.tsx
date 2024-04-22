import { useRef, useState } from "react";
import useEffectOnce from "@/core/util/hooks/useEffectOnce";
import moment from "moment";
import { hoursTime } from "@/context/actions/chart-actions";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";


const TimeSelect = ({
    label,className,time,setTime,disabledHours
}:{
    className?:string
    label:string
    time: string | undefined
    setTime:(e:string)=>void
    disabledHours?:string[]
    
})=>{
    // const [date,setDate] = useState(datetime.date)
    // const [time,setTime] = useState(startTime)



    return(
        <>
         {/* <div className={`relative  grid  ${className}`}>
              {label != undefined &&
         <span className="label">{label}</span>
       } */}
      <FormControl sx={{width:104}}>
        <InputLabel id={label}>{label}</InputLabel>
            <Select
            name=""
            id=""
            labelId={label}
            label={label}
            size="small"
            required 
            value={time} 
             onChange={(e,v)=>{
                console.log(e.target.value)
                setTime(e.target.value)}}>
                <MenuItem value=""></MenuItem>
                {hoursTime.map((item,index)=>{
                    const t =moment(item.hour).utc().format("HH:mm")
                    return (
                        <MenuItem key={index}  value={t} disabled={disabledHours?.includes(t)}>{t}</MenuItem>
                    )
                })}
                {/* <option value="24:00">
                    24:00
                </option> */}
            </Select>
        </FormControl>
            
            {/* <TimeSelect
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

         {/* </div> */}
        </>
    )
}

export default TimeSelect;