import { API_URL_MESSAGE } from "@/context/config";
import { GetMessages } from "@/core/repository/conversation";
import { formatterShorTime, getRandomInt } from "@/core/util";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const ChatConversation = ({conversation}:{
    conversation:EstablecimientoConversation
}) => {
    const [messages,setMessages] = useState<ConversationMessage[]>([])
    const [messageContent,setMessageContent] = useState("")
    const connection = useRef<WebSocket>();
    const refEl = useRef<HTMLDivElement>(null)
    const searchParams = useSearchParams()
    const id = searchParams.get("id") || conversation.conversation_id.toString()
    const [page,setPage] = useState(1)
    const [hideButton,setHideButton] = useState(false)
    const getMessages = async(page:number) => {
        const res:PaginationConversationMessage = await GetMessages(Number(id),page)
        if(res.results.length < 20){
            console.log("SIZE ",res.results.length)
            setHideButton(true)
        }
        if(page == 1){
            setMessages(res.results)
        }else{
            setMessages([...messages,...res.results])
        }
        
    }
    useEffect(()=>{
        if(id != null){
            getMessages(1)
        }
    },[searchParams])

    const sendMessage = ()=>{
        try{
            if(messageContent=="") return
            const data:ConversationMessage = {
            id: getRandomInt(),
            sender_id:2023,
            conversation_id:conversation.conversation_id,
            content:messageContent,
            created_at:new Date().toISOString(),
            }
            console.log(data)
            connection.current?.send(JSON.stringify(data))
            setMessageContent("")
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
      },[messages])

    useEffect(()=>{
        console.log("getting new connection")
        connection.current = new WebSocket(`ws://localhost:9091/v1/ws/conversation/?id=${id}`);
        connection.current.onopen = () => {
        }
        connection.current.onclose = () => {
        };
        connection.current.onmessage = (e) => {
            console.log(e.data)
          const message:ConversationMessage = JSON.parse(e.data)
          setMessages(e=>[message,...e])
        //   data.created_on = Date.now()
        //   setMessages(oldArray => [...oldArray,data]);
            // refEl.current.scrollIntoView({behavior:"smooth"})
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
                    return(
                        <div key={item.id} className={` p-2 m-2 rounded-lg text-sm grid max-w-lg
                        ${item.sender_id == conversation.profile_id
                        ?"place-self-start bg-gray-200 "
                        :"place-self-end bg-primary text-white"} `}>

                            {item.reply_to != null &&
                            <div className={`p-1 rounded-lg 
                            ${item.sender_id == conversation.profile_id 
                            ?"bg-gray-200 brightness-90 border-primary border-l-4"
                            :"bg-primary brightness-90 border-white border-l-4"
                        }`}>
                                <span>{item.reply?.content}</span>
                            </div>
                            }

                            <span>
                             {item.content}
                            </span>
                            <span className="text-[11px] ">
                                {formatterShorTime(item.created_at)}
                            </span>
                        </div>
                    )
                })}

                {hideButton ||
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