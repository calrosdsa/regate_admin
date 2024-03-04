import { useState } from "react"

const SeeMore = ({
    text,maxLength,className=""
}:{
    text:string
    maxLength:number
    className?:string
}) =>{
    const [mxLength,setMxLength] = useState(maxLength)


    return(
        <div className={className}>
            <span className={className}>
                {text.slice(0,mxLength)}
                {mxLength < text.length ? "... ":"  "}
                </span>
            {maxLength < text.length &&
            <>
            {maxLength != mxLength ?
            <span onClick={()=>setMxLength(maxLength)} className=" text-primary  cursor-pointer font-medium noSelect">
            Ver menos
            </span>
            :
            <span  onClick={()=>setMxLength(text.length)} className=" text-primary  cursor-pointer font-medium noSelect">
            Ver más
            </span>
            }
            </>
            }
        </div>
    )
}

export default SeeMore;