"use client"

import Conversations from "@/components/conversation/Conversations";
import ChatConversation from "@/components/conversation/chat/ChatConversation";
import CommonImage from "@/components/util/image/CommonImage";
import { GetConversations } from "@/core/repository/conversation";
import { getFullName } from "@/core/util";
import { useEffect, useState } from "react";



const Page = ({params} : { params:{uuid:string}})=>{
    const [conversations,setConversations] = useState<EstablecimientoConversation[]>([])
    const [ conversation,setConversation ] = useState<EstablecimientoConversation | undefined>(undefined)
    const getConversations = async() =>{
        try{
            const res:EstablecimientoConversation[] = await GetConversations(params.uuid)
            console.log("Conversations",res)
            setConversations(res)
        }catch(err){
            console.log("Error",err)
        }
    }
    useEffect(()=>{
        getConversations()
    },[])
    return(
        <div className="grid grid-cols-7">
            <div className=" md:col-span-2 p-2 h-screen bg-gray-100 shadow-md">
            <Conversations
            conversations={conversations}
            setConversation={(e)=>setConversation(e)}
            />
            </div>

            <div className=" col-span-5 h-screen">
                    {conversation != undefined &&
                    <>
                    <div className="fixed top-0 w-full bg-gray-100 p-1 shadow-md">
                        <div className="flex items-center space-x-2">    
                       <CommonImage
                        h={200}
                        w={200}
                        src={conversation.photo ||  "/images/profile.png"}
                        className="rounded-full h-12 w-12"
                        />
                        <span className=" subtitle">{getFullName(conversation.name,conversation.apellido)}</span>
                        </div>
                    </div>

                <div className=" h-full flex flex-col-reverse p-2 w-full">
                <ChatConversation
                conversation={conversation}
                />
                </div>
                </>
                }
            </div>

        </div>
    )
}

export default Page;