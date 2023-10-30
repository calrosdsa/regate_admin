type EstablecimientoConversation ={
    name:string
    apellido?:string
    photo?:string
    conversation_id:number
    profile_id:number
    parent_id:number
}

type MessagePublishRequest = {
    type_chat:number,
    chat_id:number,
    message:ConversationMessage
}

type MessagePayload = {
    payload:string,
    type:string
}

type ConversationMessage = {
    id:number
	profile_id:number
    chat_id:number
    content:string
    created_at:string
    type_message:number
    reply_to?:number
    parent_id:number
    is_read?:boolean
    is_user?:boolean
    is_deleted?:boolean
    reply?:Reply
    shouldIncrement?:boolean
}

type PaginationConversationMessage = {
    results:ConversationMessage[]
    nextPage:number
}

type Reply = {
    id:number
	profile_id:number
    chat_id:number
    content:string
    created_at:string
    type_message:number
    reply_to?:number
    parent_id:number
}

type Chat = {
    message?:ConversationMessage
    chat:EstablecimientoConversation
    count_unread_messages:number
}

type ChatState = {
    chats:Chat[]
    messages:ConversationMessage[]
    messages_count:number
}