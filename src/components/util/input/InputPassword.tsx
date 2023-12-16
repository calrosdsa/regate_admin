import { ChangeEvent, useState } from "react";

interface Props{
    onChange:(e:ChangeEvent<HTMLInputElement>)=>void
    password:string
    label:string
    name:string
    error?:string
    className?:string
}
const InputPassword = ({onChange,password,label,name,error,className}:Props) =>{
    const [show,setShow] = useState(false)

    return(
        <div className={`relative mt-3 ${className}`}>
        <label htmlFor="password" className="labelText">{label}</label>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
         className="w-5 h-5 absolute bottom-[10px] left-[5px] text-gray-400">
  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
</svg>

<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
onClick={()=>setShow(!show)}
 className="w-5 h-5 absolute bottom-[10px] right-[5px] text-gray-400 cursor-pointer">
  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
</svg>


    <input id="password" name={name}  type={show? 'text':`password`}
      required
        onChange={onChange} 
        value={password}
        minLength={8}
        className=" border-[1px] rounded-lg  peer rounded-b-lg   p-2 h-10 w-full
        border-gray-400 mt-1 pl-7 text-sm
        text-gray-900 focus:outline-primary"
        placeholder="" />
          <span className="text-red-500 pl-2 absolute left-0 -bottom-4 font-medium text-xs truncate"
         >{error}</span>
      </div>  
    )
}

export default InputPassword;