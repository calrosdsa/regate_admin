

const ButtonIcon = ({onClick,icon}:{
    onClick:()=>void
    icon:()=>JSX.Element
}) => {

    return(
        <div className=" rounded-full hover:bg-gray-200 cursor-pointer flex justify-center"
        onClick={onClick}>
       {icon()}
    </div>
    )
}

export default ButtonIcon;