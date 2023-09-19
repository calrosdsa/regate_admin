import React, { useState } from "react"

const SearchInput = ({placeholder,onChange,value,clear,onEnter,className}:{
    placeholder:string,
    onChange:(e:React.ChangeEvent<HTMLInputElement>)=>void
    value:string
    className?:string
    clear:()=>void
    onEnter:(e:string)=>void
}) =>{
    const [focused, setFocused] = useState(false)
    const onFocus = () => setFocused(true)
    const onBlur = () => setFocused(false)

    return(
        <div className={`flex border-[1px] border-gray-600 p-2 md:p-1 w-full space-x-2 text-gray-600 relative 
         ${className}
        ${focused && "ring-2"}`}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
  <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
</svg>
            <input type="text" onChange={onChange} onBlur={onBlur} onFocus={onFocus} value={value}
            className=" outline-none placeholder:italic w-full   text-sm" placeholder={placeholder}
            onKeyDown={(e)=>{
                console.log(e.key)
                if(e.key == "Enter"){
                    onEnter(value)
                    console.log(e.key)
                }else if(e.key == "Escape"){
                    clear()
                }
            }}
            />

            {value != "" &&
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 cursor-pointer 
            "
            onClick={clear}>
            <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
          </svg>          
            }
        </div>
    )
}

export default SearchInput;