import { FormControl, MenuItem, Select, SelectChangeEvent } from "@mui/material"
import { ReactNode } from "react"


const SelectComponent = ({items,value,onChange,required=true,name,label,containerClassName="mt-3",
defaultItem}:{
    items:SelectItem[]
    value:string
    onChange:(e:SelectChangeEvent<string>, child: ReactNode)=>void
    required?:boolean
    name:string
    defaultItem?:SelectItem
    label?:string
    containerClassName?:string
}) =>{
    
    return(
        
        <div className={`${containerClassName}`}>
            {label != undefined &&
        <label className="label">{label}</label>
            }
        <FormControl sx={{minWidth:"100%"}}>
        <Select
            size="small"
            onChange={onChange}
            value={value}
            sx={{height:35}}
            name={name}
            required={required}
            // displayEmpty
            defaultValue={defaultItem?.value}
            >
                <MenuItem value={defaultItem?.value}>{defaultItem?.name}</MenuItem>
                  {items.map((item,idx)=>{
                return(
                    <MenuItem  key={idx} value={item.value}>{item.name}</MenuItem>
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