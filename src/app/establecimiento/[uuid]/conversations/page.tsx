"use client"

import Conversations from "@/components/conversation/Conversations";
import ChatConversation from "@/components/conversation/chat/ChatConversation";
import CommonImage from "@/components/util/image/CommonImage";
import { useAppDispatch, useAppSelector } from "@/context/reduxHooks";
import { chatActions } from "@/context/slices/chatSlice";
import { GetConversations } from "@/core/repository/chat";
import { getFullName } from "@/core/util";
import { useSearchParams,useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";



const Page = ({params} : { params:{uuid:string}})=>{
    const dispatch = useAppDispatch()
    const searchParams = useSearchParams();
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    const pathname = usePathname();
    const router = useRouter()
    const [conversations,setConversations] = useState<EstablecimientoConversation[]>([])
    const chats = useAppSelector(state=>state.chat.chats)
    const [ chat,setChat ] = useState<Chat | undefined>(undefined)
    const getConversations = async() =>{
        try{
            const res:Chat[] = await GetConversations(params.uuid)
            console.log("Conversations",res)
            dispatch(chatActions.setChats(res))
            const currentId = searchParams.get("conversationId")
            if(currentId != null ){
                const currentConversation = res.find(item=>item.chat.conversation_id == Number(currentId))
                if(currentConversation != undefined){
                    setChat(currentConversation)
                }
            }
        }catch(err){
            console.log("Error",err)
        }
    }
    useEffect(()=>{
        getConversations()
    },[])
    return(
        <div className="grid grid-cols-7">
            <div className="w-full md:col-span-2 p-2 h-screen bg-gray-100 shadow-md">
            <Conversations
            conversations={chats}
            setConversation={(e)=>{
                setChat(e)
                current.set("conversationId",e.chat.conversation_id.toString());
                const search = current.toString();
                const query = search ? `?${search}` : "";
                router.push(`${pathname}${query}`);
            }}
            />
            </div>

            <div className=" col-span-5 h-screen">
                    {chat != undefined &&
                    <>
                    <div className="fixed top-0 w-full bg-gray-100  shadow-md">
                        <div className="flex items-center space-x-2 p-2">    
                       <CommonImage
                        h={200}
                        w={200}
                        src={chat.chat.photo ||  "/images/profile.png"}
                        className="rounded-full h-12 w-12"
                        />
                        <span className=" subtitle">{getFullName(chat.chat.name,chat.chat.apellido)}</span>
                        </div>
                    </div>

                <div className="h-full flex flex-col-reverse p-2 w-full">
                <ChatConversation
                current={chat}

                />
                </div>
                </>
                }
            </div>

        </div>
    )
}

export default Page;