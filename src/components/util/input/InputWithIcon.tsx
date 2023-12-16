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
    icon?:()=>JSX.Element
    className?:string
}
const InputWithIcon = ({onChange,value,label,name,type="text",error,icon,className,placeholder="",
required= true}:Props) =>{

  return(
    <div className={`relative mt-3 mx-1 ${className}`}>
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
        // minLength={8}
        className={` border-[1px] rounded-lg rounded-b-lg p-2 h-10 w-full
        border-gray-400 mt-1 text-sm text-gray-900 focus:outline-primary
        ${icon != undefined && "pl-7"}`}
        placeholder={placeholder} />
          <span className="text-red-500 pl-2 absolute left-0 -bottom-4 font-medium text-xs truncate"
         >{error}</span>
      </div>  
    )
}

export default InputWithIcon;