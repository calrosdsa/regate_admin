import { ChangeEvent, useState } from "react";

interface Props{
    onChange:(e:ChangeEvent<HTMLInputElement>)=>void
    value:string
    label?:string
    name:string
    required?:boolean
    type?:string
    error?:string 
    placeholder?:string
    onBlur?:()=>void
    icon?:()=>JSX.Element
    className?:string
}
const InputWithIcon = ({onChange,value,label,name,type="text",error,icon,className,placeholder="",
required= true,onBlur=()=>{}}:Props) =>{

  return(
    <div className={`relative mt-3 ${className}`}>
          {label != undefined &&
        <label className="label">{label}</label>
      }
      {icon != undefined &&
        icon()
        }
    <input name={name}  type={type}
      required={required}
        onChange={onChange} 
        autoFocus
        value={value}
        onBlur={onBlur}
        // minLength={8}
        className={`input
        ${icon != undefined && "pl-7"}`}
        placeholder={placeholder} />
          <span className="text-red-500 pl-2 absolute left-0 -bottom-4 font-medium text-xs truncate"
         >{error}</span>
      </div>  
    )
}

export default InputWithIcon;