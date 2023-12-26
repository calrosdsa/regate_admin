import CommonImage from "@/components/util/image/CommonImage"
import { MessageType, MessageTypeInstalacion } from "@/core/type/chat/enum"
import moment from "moment"
import {useEffect} from "react"

const MessageData = ({data,type_message}:{
    data:string
    type_message:number
}) =>{
    if(type_message == MessageType.INSTALACION){
        const payload:MessageTypeInstalacion = JSON.parse(data)
        const totalPrice = payload.cupos.reduce((accum,current)=>accum + (current.price || 0),0)
        return(
            <div className="grid mb-1">
             <CommonImage
             src={payload.photo}
             h={100}
             w={250}
             className=""
             />
             <span className=" font-semibold max-w-[250px]">{payload.name}</span>
             <span className="text-sm">Precio: {totalPrice}</span>
             <span className="text-sm">Fecha: {moment(payload.cupos[0].time).format("MMM D")} {' '}
            {moment(payload.cupos[0].time).format("LT")} a
            {moment(payload.cupos[payload.cupos.length - 1].time).format("LT")}
            </span>
        </div>
    )
    }else if(type_message == MessageType.SALA) {
        return(
            <div>
        </div>
        )
    }
}

export default MessageData;