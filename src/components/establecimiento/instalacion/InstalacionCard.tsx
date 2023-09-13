import Image from "next/image";

interface Props{
    instalacion:Instalacion
}   
const InstalacionCard = ({instalacion}:Props) =>{

    return(
        <div className="grid grid-cols-2 min-w-[250px] cursor-pointer border-[1px] relative rounded-lg">
            <div className="">
            {(instalacion.portada == null || instalacion.portada == "") ?
            <Image
            src="/images/img-default.png"
            height={100}
            width={150}
            alt={instalacion.name} 
            className=" rounded-lg h-16 object-contain bg-gray-200 p-2"
            />
            :
            <Image
            src={instalacion.portada as string}
            height={100}
            width={150}
            alt={instalacion.name} 
            className=" rounded-lg h-16 object-cover"
            />
        }
        </div>
            <span className="font-medium text-sm line-clamp-3
            p-1 z-10 rounded-br-lg">{instalacion.name}</span>
        </div>
    )
}

export default InstalacionCard;