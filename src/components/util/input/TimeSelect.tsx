import { useRef, useState } from "react";
import useEffectOnce from "@/core/util/hooks/useEffectOnce";
import moment from "moment";
import { hoursTime } from "@/context/actions/chart-actions";
import { FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";


const TimeSelect = ({
    label,className,time,setTime,disabledHours,size="small"
}:{
    className?:string
    label:string
    size?:'small' | 'medium'
    time: moment.Moment | undefined
    setTime:(e:moment.Moment)=>void
    disabledHours?:string[]
    
})=>{
    // const [date,setDate] = useState(datetime.date)
    // const [time,setTime] = useState(startTime)



    return(
        <div>
         {/* <div className={`relative  grid  ${className}`}>
              {label != undefined &&
         <span className="label">{label}</span>
       } */}
            <Typography variant="body2">{label}</Typography>
            {/* <span>{time?.format()}</span> */}
            <Select
            name=""
            id=""
            size={size}
            required 
            sx={{mt:1,width:"100%",minWidth:70}}
            value={time?.format("YYYY-MM-DD HH:mm")} 
            onChange={(e,v)=>{
                setTime(moment(e.target.value))}}>
                <MenuItem value=""></MenuItem>
                {hoursTime.map((item,index)=>{
                    // const t = item.hour.utc().format("HH:mm")
                    return (    
                        <MenuItem key={index}  value={item.hour.format("YYYY-MM-DD HH:mm")}
                        //  disabled={disabledHours?.includes(t)}
                         >{item.hour.format("HH:mm")}</MenuItem>
                    )
                })}
                {/* <option value="24:00">
                    24:00
                </option> */}
            </Select>
            
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
        </div>
    )
}

export default TimeSelect;