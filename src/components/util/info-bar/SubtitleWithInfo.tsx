import { Typography } from "@mui/material"


const TitleWithInfo = ({title,onClick,className,titleClassName = "label"}:{
    title:string
    onClick:()=>void
    className?:string
    titleClassName?:string
}) => {
    
    return(
        <div className={`flex space-x-3 items-center ${className}`}>
        <Typography  fontWeight={500} fontSize={16.5}>{title}</Typography>
        <Typography variant="body2" onClick={onClick} color={"primary"}
        className=" cursor-pointer">Información</Typography>
    </div>
    )
}

export default TitleWithInfo;