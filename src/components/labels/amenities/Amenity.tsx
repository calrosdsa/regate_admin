import Image from "next/image";


const Amenity = ({item,className,onClick}:{
    item:Label
    className?:string
    onClick?:()=>void
}) => {
    return(
        <div onClick={onClick}
        className={`card flex space-x-2 items-center ${className}`}>
        <Image
        src={item.thumbnail as string}
        width={100}
        height={100}
        className='h-6 w-6 text-white'
        alt=''
        />
        <span className='subtitle'>{item.name}</span>
    </div>
    )
}

export default Amenity;