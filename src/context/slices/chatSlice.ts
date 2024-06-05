import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UiState } from "../models/ui";
import { ReporteId } from "@/data/model/types/enums";
import { insertMessage } from "../db";



const chatState:ChatState=  {
    chats:[],
    chat:undefined,
    messages:[],
    messages_count:0
}

const chatSlice = createSlice({
    name:"chat",
    initialState:chatState,
    reducers:{
        updateGlobalMessageCount(state,action:PayloadAction<number>){
            console.log(action.payload)
            state.messages_count += action.payload
        },
        setChat(state,action:PayloadAction<Chat | undefined>){
            state.chat = action.payload
        },
        setChats(state,action:PayloadAction<Chat[]>){
            state.chats = action.payload
        },
        updateLastMessage(state,action:PayloadAction<ConversationMessage>){
            const payload = action.payload
            const updateChat = state.chats.map(item=>{
                if(item.chat.conversation_id ==payload.chat_id){
                    item.message = payload
                    if(payload.shouldIncrement){
                        item.count_unread_messages = item.count_unread_messages + 1
                    }
                }
                
                return item

            })
            state.chats = updateChat
        },
        updateChat(state,action:PayloadAction<Chat>){
            const payload = action.payload
            // console.log(payload.chat.conversation_id,"CHAT ID")
            const updatedChats = state.chats.map(item=>{
                if(item.chat.conversation_id == payload.chat.conversation_id){
                    // console.log(item.chat.conversation_id,"COMPARE ID")
                    item = payload
                }
                return item
            })
            // console.log("UPDATE CHATS",updatedChats)
            state.chats = updatedChats
        },
        setMessages(state,action:PayloadAction<ConversationMessage[]>){
            state.messages = action.payload
        },
        setMessage(state,action:PayloadAction<ConversationMessage>){
            state.messages = [action.payload,...state.messages]
        }
    }
})


export const chatActions = chatSlice.actions

export default chatSlice