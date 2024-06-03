"use client"

import Conversations from "@/presentation/conversation/Conversations";
import ChatConversation from "@/presentation/conversation/chat/ChatConversation";
import CommonImage from "@/presentation/util/image/CommonImage";
import { useAppDispatch, useAppSelector } from "@/context/reduxHooks";
import { chatActions } from "@/context/slices/chatSlice";
import { GetConversations } from "@/core/repository/chat";
import { getFullName } from "@/core/util";
import useMediaQuery from "@/core/util/hooks/useMediaQuery";
import { useSearchParams,useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";



const Page = ({params} : { params:{uuid:string}})=>{
    const dispatch = useAppDispatch()
    const isMobile = useMediaQuery("min-width: 1068px)");
    const searchParams = useSearchParams();
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    const pathname = usePathname();
    const router = useRouter()
    const [openChat,setOpenChat] = useState(false)
    const chats = useAppSelector(state=>state.chat.chats)
    const [ chat,setChat ] = useState<Chat | undefined>(undefined)
    const [loadMore,setLoadMore] = useState(false)
    const getConversations = async() =>{
        try{
            const res:Chat[] = await GetConversations(params.uuid)
            dispatch(chatActions.setChats(res))
            const currentId = searchParams.get("conversationId")
            if(currentId != null ){
                const currentConversation = res.find(item=>item.chat.conversation_id == Number(currentId))
                if(currentConversation != undefined){
                    setChat(currentConversation)
                }
            }
        }catch(err){
        }
    }

  
   
    useEffect(()=>{
        getConversations()
    },[])
    return(
        <div className="grid xl:grid-cols-7">
            <div className={`w-full md:col-span-2 p-1 h-screen bg-gray-100 shadow-md
            ${openChat && "hidden xl:block"}`}>
            <Conversations
            conversations={chats}
            setConversation={(e)=>{
                setLoadMore(false)
                dispatch(chatActions.setMessages([]))
                setChat(e)
                setOpenChat(true)
                current.set("conversationId",e.chat.conversation_id.toString());
                const search = current.toString();
                const query = search ? `?${search}` : "";
                router.push(`${pathname}${query}`);
            }}
            />
            </div>

            <div className={`lg:col-span-5 h-full ${!openChat && "hidden xl:block"}`}>
                    {chat != undefined &&
                    <>
                    <div className="fixed top-0 w-full bg-gray-100  shadow-md">
                        <div className="flex items-center space-x-2 p-2"> 
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                        strokeWidth={1.5} stroke="currentColor" className=" icon-button xl:hidden"
                        onClick={()=>setOpenChat(false)}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
   
                       <CommonImage
                        h={100}
                        w={100}
                        src={chat.chat.photo ||  "/images/profile.png"}
                        className="rounded-full h-10 w-10 md:h-12 md:w-12"
                        />
                        <span className=" subtitle">{getFullName(chat.chat.name,chat.chat.apellido)}</span>
                        </div>
                    </div>

                <div className=" h-full flex flex-col-reverse w-full">
                <ChatConversation
                current={chat}
                setLoadMore={(e)=>setLoadMore(e)}
                loadMore={loadMore}
                />
                </div>
                </>
                }
            </div>

        </div>
    )
}

export default Page;