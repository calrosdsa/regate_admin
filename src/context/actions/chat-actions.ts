import { AnyAction, ThunkAction } from "@reduxjs/toolkit"
import { RootState } from "../store"
import { chatActions } from "../slices/chatSlice"


export const handleIncomeMessages  = (payload:string) :ThunkAction<void,RootState,undefined,AnyAction> =>{
    return async(dispatch,getState)=>{
        try{
            const chat = getState().chat.chat
            let message:ConversationMessage = JSON.parse(payload)
            let shouldIncrement = true
            if(chat != undefined){
              shouldIncrement  = Number(chat.chat.conversation_id) != message.chat_id
            }
            const updateMessages:ConversationMessage = {
              ...message,
              is_read:false,
              shouldIncrement:shouldIncrement
            }
            dispatch(chatActions.updateLastMessage(updateMessages))
            if(shouldIncrement){
              dispatch(chatActions.updateGlobalMessageCount(1))
            }            
        }catch(err){
        }
    }
}