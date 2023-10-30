export type WsAccountPayload = {
    type:number
    payload:string
}

export enum  PayloadType {
    PAYLOAD_TYPE_NOTIFICATION,
    PAYLOAD_USER_BALANCE,
    PAYLOAD_GRUPO_MESSAGES,
}