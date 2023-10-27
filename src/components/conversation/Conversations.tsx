import { getFullName } from "@/core/util";
import Image from "next/image";
import CommonImage from "../util/image/CommonImage";
import moment from "moment";



const Conversations = ({conversations,setConversation}:{
    conversations:Chat[]
    setConversation:(e:Chat)=>void
}) =>{

    return(
        <div className="w-full">
            {conversations.map((item)=>{
                return(
                    <div  onClick={()=>setConversation(item)}
                    key={item.chat.conversation_id} className="flex space-x-4  items-center divider
                     default-card p-2 w-full">
                        <CommonImage
                        h={200}
                        w={200}
                        src={item.chat.photo ||  "/images/profile.png"}
                        className=" rounded-full h-12 w-16"
                        />
                        <div className="grid gap-y-1 w-full">
                            <div className="flex justify-between w-full">
                        <span className="subtitle font-medium max-w-[90%] truncate
                        ">{getFullName(item.chat.name,item.chat.apellido)}</span>
                        {item.message != undefined &&
                        <span className="text-xs">{moment(item.message?.created_at).format('LT')}</span>
    
                        }

                            </div>

                        {item.message != undefined &&
                        <div className="flex justify-between w-full">
                        <span className="text-xs w-[200px] truncate">
                            {item.message.content}
                        </span>
                            {item.count_unread_messages > 0 &&
               <span className="inline-flex items-center justify-center w-3 h-3 p-3 ml-3 
               text-sm font-medium text-white bg-primary rounded-full 
                ">{item.count_unread_messages}</span>
                            } 
                        </div>
                        }
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default Conversations;