

type EstablecimientoConversation ={
    name:string
    apellido?:string
    photo?:string
    conversation_id:number
    profile_id:number
}

type ConversationMessage = {
    id:number
	sender_id:number
    conversation_id:number
    content:string
    created_at:string
    reply_to?:number
    reply?:Reply 
}

type PaginationConversationMessage = {
    results:ConversationMessage[]
    nextPage:number
}

type Reply = {
    id:number
	sender_id:number
    conversation_id:number
    content:string
    created_at:string
    reply_to:number | null
}