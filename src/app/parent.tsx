'use client';

import { WS_URL } from "@/context/config";
import { getMessagesChat, insertMessage } from "@/context/db";
import { useAppDispatch } from "@/context/reduxHooks";
import { chatActions } from "@/context/slices/chatSlice";
import store from "@/context/store";
import { PayloadType, WsAccountPayload } from "@/core/type/notification";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

export function Parent({ children }:any) {
  const connection = useRef<WebSocket>();
  const searchParams = useSearchParams();
  const current = new URLSearchParams(Array.from(searchParams.entries()))
  const dispatch = useAppDispatch()

  useEffect(()=>{
    const userLocal = localStorage.getItem("user") 
    const user:User | null = userLocal != null ? JSON.parse(userLocal) : null
    console.log(user)
    if(user != null) {
      connection.current =  new WebSocket(`${WS_URL}/v1/ws/suscribe/user/admin/?id=${user.id}`)
      connection.current.onmessage = (e) => {
        const data:WsAccountPayload = JSON.parse(e.data)
        switch(data.type){
          case PayloadType.PAYLOAD_GRUPO_MESSAGES:
            let message:ConversationMessage = JSON.parse(data.payload)
            const chatId = current.get("conversationId") 
            let shouldIncrement = true
            if(chatId != null){
              shouldIncrement  = Number(chatId) != message.chat_id
            }
            const updateMessages:ConversationMessage = {
              ...message,
              is_read:false,
              shouldIncrement:shouldIncrement
            }
            dispatch(chatActions.updateLastMessage(updateMessages))
            dispatch(chatActions.updateGlobalMessageCount(1))
            // connection.current?.send("My data")
            break;
        }
        console.log(data)
        // const payload:MessagePayload = JSON.parse(e.data)
        // switch(payload.type){
        //     case MessageEvent.Message:
        //         const message:ConversationMessage = JSON.parse(payload.payload)
        //         setMessages(e=>[message,...e])
        //         break;

        // }
    };
    connection.current.onclose = () => {
      console.log("WS ONCLOSE")
    };
    }
    return () => {
      console.log("WS CLOSE")  
      connection.current?.close();
    }
  },[])
  return (
    <>
      {children}
    </>
  );
}