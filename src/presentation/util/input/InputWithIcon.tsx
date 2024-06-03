import { InputAdornment, SvgIconTypeMap, TextField, Typography } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { ChangeEvent, useState } from "react";

interface Props{
    onChange:(e:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)=>void
    value:string
    label?:string
    name:string
    required?:boolean
    type?:string
    error?:string 
    size?:'small' | 'medium'
    multiline?:boolean
    placeholder?:string
    onBlur?:()=>void
    Icon?: OverridableComponent<SvgIconTypeMap<{}, "svg">> & { muiName: string;}
    maxLenght?:number
    className?:string,
}
const InputWithIcon = ({onChange,value,label,name,type="text",error,Icon,className,placeholder="",
required= true,onBlur=()=>{},size = "small",multiline=false,maxLenght= 255}:Props) =>{

  return(
    <div className={`${className}`}>
          {label != undefined &&
          <Typography variant="body2" sx={{mb:0.5}}>{label}</Typography>
      }
      
    <TextField 
        name={name}  
        type={type}
        size={size}
        required={required}
        onChange={(e)=>{
          onChange(e)
        }} 
        fullWidth
        value={value}
        onBlur={onBlur}
        multiline={multiline}
        inputProps={{ maxLength: maxLenght }}
        InputProps={{
          startAdornment: (
              Icon != undefined &&
            <InputAdornment position="start">
              <Icon/>
              </InputAdornment>
            
          ),
        }}
        // minLength={8}
        error={error != undefined}
        placeholder={placeholder} 
        helperText={error}
        />
      </div>  
    )
}

export default InputWithIcon;