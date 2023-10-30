import { API_URL_MESSAGE } from "@/context/config";
import { getMessagesChat, isDb } from "@/context/db";
import { useAppDispatch, useAppSelector } from "@/context/reduxHooks";
import { chatActions } from "@/context/slices/chatSlice";
import { GetMessages, UpdateMessagesToReaded } from "@/core/repository/chat";
import { MessageEvent, TypeChat } from "@/core/type/enums";
import { formatterShorTime, getRandomInt } from "@/core/util";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const ChatConversation = ({current}:{
    current:Chat
}) => {
    const dispatch = useAppDispatch()
    const messages = useAppSelector(state=>state.chat.messages)
    const [messageContent,setMessageContent] = useState("")
    const connection = useRef<WebSocket>();
    const refEl = useRef<HTMLDivElement>(null)
    const searchParams = useSearchParams()
    const id = searchParams.get("id") || current.chat.conversation_id.toString()
    const [page,setPage] = useState(1)
    const [loadMore,setLoadMore] = useState(false)
    const [scrollToBottom,setScrollToBottom] = useState(false)
    const getMessages = async(page:number) => {
        console.log("PAGE",page)
        const res:PaginationConversationMessage = await GetMessages(Number(id),page)
        updateMessageToRead(res.results)
        console.log("RESULTS",res)
        if(res.nextPage == 0 || res.results.length < 20){``
            console.log("SIZE ",res.results.length)
            setLoadMore(false)
        }else{
            setLoadMore(true)
        }
        if(page == 1){
            dispatch(chatActions.setMessages(res.results))
            // setMessages(res.results)
        }else{
            dispatch(chatActions.setMessages([...messages,...res.results]))
        }
    }
    const updateMessageToRead = async(messages:ConversationMessage[]) =>{
        try{

            const ids = messages.filter(item => item.is_read == false).map(item=>item.id)
            const body = {
                ids:ids
            }        
            if(ids.length > 0){
                await UpdateMessagesToReaded(JSON.stringify(body))
                console.log("Updated messages ids")
                dispatch(chatActions.updateChat({
                    ...current,
                    count_unread_messages:current.count_unread_messages - ids.length
                }))
            }
        }catch(err){
            console.log(err)
        }
    }

    const getReplyMessage = (replyMessageId:number) =>{
        const reply = messages.find(item=>item.id == replyMessageId)
        return reply
    }
    useEffect(()=>{
        if(id != null){
            getMessages(1)
        }
    },[searchParams])

    const sendMessage = async()=>{
        try{
            if(messageContent=="") return
            const data:ConversationMessage ={
            id: getRandomInt(),
            profile_id:current.chat.profile_id,
            chat_id:current.chat.conversation_id,
            content:messageContent,
            type_message:0,
            parent_id:current.chat.parent_id,
            shouldIncrement:false,
            is_read:true,
            created_at:new Date().toISOString(),
            }
            const messagePublishRequest:MessagePublishRequest = {
                type_chat:TypeChat.TypeChatInboxEstablecimiento,
                message:data,
                chat_id:current.chat.conversation_id
            }
            // const data:
            console.log(messagePublishRequest)
            const res = await fetch("http://localhost:9091/v1/chat/publish/message/",{
                method:"post",
                body:JSON.stringify(messagePublishRequest),
                headers:{
                    "Content-Type":"application/json"
                }
            })
            if(!res.ok){
                throw new Error('Failed to fetch data')
            }
            const body = await res.json()
            console.log("MESSAGE RESPONSE",body)
            setMessageContent("")
            dispatch(chatActions.updateLastMessage(data))
            setScrollToBottom(!scrollToBottom)
        }catch(err){
            console.log(err)
        }
    }
    useEffect(()=>{
        if(page >1){
            getMessages(page)
        }
    },[page])

    useEffect(()=>{
        refEl.current?.scrollIntoView({behavior:"smooth"})
      },[scrollToBottom])

    useEffect(()=>{
        // setMessages([])
        console.log("getting new connection")
        connection.current = new WebSocket(`ws://localhost:9091/v1/ws/suscribe/chat/?id=${id}&profileId=0`);
        connection.current.onopen = () => {
        }
        connection.current.onclose = () => {
        };
        connection.current.onmessage = (e) => {
            const payload:MessagePayload = JSON.parse(e.data)
            switch(payload.type){
                case MessageEvent.Message:
                    const message:ConversationMessage = JSON.parse(payload.payload)
                    dispatch(chatActions.setMessage(message))
                    setScrollToBottom(!scrollToBottom)
                    // setMessages(e=>[message,...e])
                    break;

            }
        };

        return () => {
            connection.current?.close();
        }
            // })
    },[searchParams])

    return(
        <div className="h-screen ">
               <div className="flex flex-col-reverse  overflow-auto h-[93%] pt-20">
               <div ref={refEl}/>
                {messages.map((item)=>{
                    const reply = item.reply_to != undefined ? getReplyMessage(item.reply_to) : undefined
                    return(
                        <div key={item.id} className={` p-2 m-2 rounded-lg text-sm grid max-w-lg
                        ${item.is_user
                        ?"place-self-start bg-gray-200 "
                        :"place-self-end bg-primary text-white"} `}>

                            {(item.reply_to != null && reply != undefined )&&
                            <div className={`p-1 rounded-lg 
                            ${!reply.is_user  
                            ?"bg-gray-200 brightness-90 border-primary border-l-4"
                            :"brightness-90 border-white border-l-4"
                        }`}>
                            {reply?.is_deleted ?
                            <span className=" italic">Se ha eliminado este mensage</span>
                            :
                                <span>{reply?.content}</span>
                            }
                            </div>
                            }
                            {item.is_deleted ?
                            <span className=" italic">Se ha eliminado este mensage</span>
                            :
                            <span>{item.content}</span>
                            }
                            <span className="text-[11px] ">
                                {formatterShorTime(item.created_at)}
                            </span>
                        </div>
                    )
                })}

                {loadMore &&
                <button onClick={()=>setPage(page + 1)} className="button  justify-center">Load More</button>
                }

                </div>
            <div className="flex space-x-2 items-center bg-gray-200 px-2 p-1 shadow-md">
                <input value={messageContent} type="text" className="input" 
                onKeyDown={(e)=>{
                    if(e.key == "Enter"){
                        sendMessage()
                    }
                }}
                onChange={(e)=>setMessageContent(e.target.value)}/>
                <button onClick={()=>sendMessage()}
                className="bg-primary rounded-full w-10 h-10 flex justify-center items-center ">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} 
                stroke="currentColor" className="w-6 h-6 text-white">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
                </button>
            </div>
        </div>
    )
}

export default ChatConversation;