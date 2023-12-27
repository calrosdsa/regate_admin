

const TitleWithInfo = ({title,onClick,className,titleClassName = "label"}:{
    title:string
    onClick:()=>void
    className?:string
    titleClassName?:string
}) => {
    
    return(
        <div className={`flex space-x-3 items-center ${className}`}>
        <span className={titleClassName}>{title}</span>
        <span onClick={onClick} className='info-label'>Información</span>
    </div>
    )
}

export default TitleWithInfo;