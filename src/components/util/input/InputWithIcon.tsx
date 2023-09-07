import { ChangeEvent, useState } from "react";

interface Props{
    onChange:(e:ChangeEvent<HTMLInputElement>)=>void
    value:string
    label?:string
    name:string
    type?:string
    error?:string
    placeholder?:string
    icon?:()=>JSX.Element
    className?:string
}
const InputWithIcon = ({onChange,value,label,name,type="text",error,icon,className,placeholder=""}:Props) =>{

  return(
    <div className={`relative mt-3 ${className}`}>
          {label != undefined &&
        <label  className="labelText">{label}</label>
      }
      {icon != undefined &&
        icon()
        }
    <input name={name}  type={type}
      required
        onChange={onChange} 
        value={value}
        minLength={8}
        className={` border-[1px] rounded-lg  peer rounded-b-lg   p-2 h-10 w-full
        border-gray-400 mt-1 text-sm text-gray-900 focus:outline-blue-600
        ${icon != undefined && "pl-7"}`}
        placeholder={placeholder} />
          <span className="text-red-500 pl-2 absolute left-0 -bottom-4 font-medium text-xs truncate"
         >{error}</span>
      </div>  
    )
}

export default InputWithIcon;