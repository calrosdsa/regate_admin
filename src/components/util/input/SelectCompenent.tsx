import { FormControl, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material"
import { ReactNode } from "react"


const SelectComponent = ({items,value,onChange,required=true,name,label,containerClassName="mt-3",size="small"}:{
    items:SelectItem[]
    value:string
    onChange:(e:SelectChangeEvent<string>, child: ReactNode)=>void
    required?:boolean
    name:string
    label?:string
    size?:'small' | 'medium'
    containerClassName?:string
}) =>{
    
    return(
        
        <div className={`${containerClassName}`}>
            {label != undefined &&
        <Typography variant="body2" sx={{mb:1}}>{label}</Typography>
            }
        <FormControl sx={{minWidth:"100%"}}>
        <Select
            size={size}
            onChange={onChange}
            value={value}
            sx={size == "small" ? {height: 35}:{}}
            name={name}
            required={required}
            >
                  {items.map((item,idx)=>{
                return(
                    <MenuItem  key={idx} value={item.value}>{item.name.slice(0,50)}</MenuItem>
                    // <option key={item.dayWeek} value={item.dayWeek}>{item.dayName}</option>
                    // <div key={item.dayWeek} onClick={()=>getHorarioDay(item.dayWeek)}
                    // className={`${selectedDay == item.dayWeek ? 'button':'button-inv'}`}>
                    //     {item.dayName}
                    // </div>
                    )
                })}
            </Select>

        {/* <select required={required}
        className="input" name={name} value={value} onChange={onChange}>
            <option value={defaultItem?.value}>{defaultItem?.name}</option>
            {items.map((item,index)=>{
                return(
                    <option key={index} value={item.value}>{item.name}</option>
                )
            })}
        </select> */}
            </FormControl>
        </div>

    )
}

export default SelectComponent;