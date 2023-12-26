'use client';

import { handleIncomeMessages } from "@/context/actions/chat-actions";
import { WS_URL } from "@/context/config";
import { getMessagesChat, insertMessage } from "@/context/db";
import { useAppDispatch, useAppSelector } from "@/context/reduxHooks";
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
    if(user != null) {
      connection.current =  new WebSocket(`${WS_URL}/v1/ws/suscribe/user/admin/?id=${user.id}`)
      connection.current.onmessage = (e) => {
        const data:WsAccountPayload = JSON.parse(e.data)
        switch(data.type){
          case PayloadType.PAYLOAD_GRUPO_MESSAGES:
            dispatch(handleIncomeMessages(data.payload))
            // connection.current?.send("My data")
            break;
        }
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