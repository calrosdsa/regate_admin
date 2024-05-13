import { Typography } from "@mui/material"
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
            <Typography variant="body2" className={className}>
                {text.slice(0,mxLength)}
                {mxLength < text.length ? "... ":"  "}
                </Typography>
            {maxLength < text.length &&
            <>
            {maxLength != mxLength ?
            <Typography variant="body2" onClick={()=>setMxLength(maxLength)} className=" text-primary  cursor-pointer font-medium noSelect">
            Ver menos
            </Typography>
            :
            <Typography variant="body2"  onClick={()=>setMxLength(text.length)} className=" text-primary  cursor-pointer font-medium noSelect">
            Ver más
            </Typography>
            }
            </>
            }
        </div>
    )
}

export default SeeMore;