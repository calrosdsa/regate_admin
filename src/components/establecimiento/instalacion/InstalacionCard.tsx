import Image from "next/image";

interface Props{
    instalacion:Instalacion
}   
const InstalacionCard = ({instalacion}:Props) =>{

    return(
        <div className="h-28 w-full cursor-pointer border-[1px] relative rounded-lg">
            {(instalacion.portada == null || instalacion.portada == "") ?
            <Image
            src="/images/img-default.png"
            fill
            alt={instalacion.name} 
            className=" rounded-lg object-contain bg-gray-200 p-2"
            />
            :
            <Image
            src={instalacion.portada as string}
            fill
            alt={instalacion.name} 
            className=" rounded-lg object-cover"
            />
        }
            <span className="absolute  text-white font-medium text-sm
             bg-primary p-1 z-10 rounded-br-lg">{instalacion.name}</span>
        </div>
    )
}

export default InstalacionCard;