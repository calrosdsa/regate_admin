import { useEffect, useRef, useState } from "react";
import useEffectOnce from "@/core/util/hooks/useEffectOnce";
import moment from "moment";
import { MenuItem, TextField, Typography } from "@mui/material";


const TimeSelect = ({
    label,className,time,setTime,disabledHours,size="small",isError,date
}:{
    className?:string
    label:string
    size?:'small' | 'medium'
    time: moment.Moment | undefined
    date: string
    setTime:(e:moment.Moment)=>void
    disabledHours?:string[]
    isError?:boolean

})=>{
    // const [date,setDate] = useState(datetime.date)
    // const [time,setTime] = useState(startTime)

    const generateHours = ():moment.Moment[] =>{
        let hours: moment.Moment[] = []
        const t = moment(date + "T00:00:00Z")
        for(let i = 0;i<49;i++){
            hours.push(t.clone().add(30*i,"minutes"))
        }
        return hours
    }
  
    useEffect(()=>{
        console.log("DISABLED HOURS",disabledHours)
        generateHours()
    },[])

    return(
        <div>
         {/* <div className={`relative  grid  ${className}`}>
              {label != undefined &&
         <span className="label">{label}</span>
       } */}
            <Typography variant="body2">{label}</Typography>
            {/* <span>{time?.format()}</span> */}
            <TextField
            name=""
            id=""
            select
            error={isError}
            size={size}
            required 
            sx={{mt:1,width:"100%",minWidth:70}}
            value={time?.format("YYYY-MM-DD HH:mm")} 
            onChange={(e)=>{
                setTime(moment(e.target.value))}}>
                <MenuItem value=""></MenuItem>
                {generateHours().map((item,index)=>{
                    const t = item.utc().format("HH:mm")
                    return (    
                        <MenuItem key={index}  value={item.utc().format("YYYY-MM-DD HH:mm")}
                         disabled={disabledHours?.includes(item.utc().format("YYYY-MM-DD HH:mm"))}
                         >{t}</MenuItem>
                    )
                })}
                
            </TextField>
            
         
        </div>
    )
}

export default TimeSelect;