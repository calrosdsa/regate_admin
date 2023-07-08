import { ChangeEvent, useState } from "react";

interface Props{
    onChange:(e:ChangeEvent<HTMLInputElement>)=>void
    value:string
    label:string
    name:string
    type?:string
    error?:string
    icon:()=>JSX.Element
    className?:string
}
const InputWithIcon = ({onChange,value,label,name,type="text",error,icon,className}:Props) =>{

    return(
        <div className={`relative mt-3 ${className}`}>
        <label  className="label">{label}</label>
        {icon()}
    <input name={name}  type={type}
      required
        onChange={onChange} 
        value={value}
        minLength={8}
        className=" border-[1px] rounded-lg  peer rounded-b-lg   p-2 h-10 w-full
        border-gray-400 mt-1 pl-9 text-sm
        text-gray-900 focus:outline-blue-600"
        placeholder="" />
          <span className="text-red-500 pl-2 absolute left-0 -bottom-4 font-medium text-xs truncate"
         >{error}</span>
      </div>  
    )
}

export default InputWithIcon;