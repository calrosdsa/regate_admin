import { TextField, Typography } from "@mui/material"
import { ChangeEvent } from "react"


const InputWithMaxLength = ({max,value,onChangeValue,label,name,required = false,type = "text",multiline=false}:{
    max?:number
    value:string
    name:string
    label:string
    required?:boolean
    type?:string
    multiline?:boolean
    onChangeValue:(e:ChangeEvent<HTMLInputElement>)=>void
    
}) =>{

    return (
        <div className="relative">
           <div>
            <Typography variant="body2" sx={{mb:1,mt:1}}>{label}</Typography>
            <TextField multiline={multiline}
            size="small" type={type} onChange={onChangeValue}  value={value} sx={{width:"100%"}}
            name={name} required={required} helperText={max != undefined && `${value.length}/${max}`}
            inputProps={{ maxLength: max }}
            />
          </div>
          {/* {max != undefined &&
           <span className="help-text absolute right-1">{`${value.length}/${max}`}</span>
          } */}
        </div>
    )
}

export default InputWithMaxLength;