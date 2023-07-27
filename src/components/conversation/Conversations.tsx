import { getFullName } from "@/core/util";
import Image from "next/image";
import CommonImage from "../util/image/CommonImage";



const Conversations = ({conversations,setConversation}:{
    conversations:EstablecimientoConversation[]
    setConversation:(e:EstablecimientoConversation)=>void
}) =>{

    return(
        <div>
            {conversations.map((item)=>{
                return(
                    <div onClick={()=>setConversation(item)}
                    key={item.conversation_id} className="flex space-x-4  items-center divider default-card p-2">
                        <CommonImage
                        h={200}
                        w={200}
                        src={item.photo ||  "/images/profile.png"}
                        className=" rounded-full h-12 w-12"
                        />
                        <span className=" subtitle">{getFullName(item.name,item.apellido)}</span>
                    </div>
                )
            })}
        </div>
    )
}

export default Conversations;