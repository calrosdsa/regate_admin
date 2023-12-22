import { Repeat, EndOptions, DayMonthPosition, ReservaType } from "./enums"

export type CreateEventoRequest = {
    name:string
    description:string
    establecimiento_id:number
}

export type Evento = {
    id:number
    uuid:string
    name:string
    description:string
    establecimiento_id:number
}


export type EventoPaginationResponse = {
    results:Evento[]
    next_page:number
    count:number
    page_size:number
}


export type ReservaFromEventoRequest = {
    times:string[]
    establecimiento_id:number
    instalaciones:number[]
    reserva_type?:ReservaType
    evento_uuid?:string
    reserva_id?:number
    day_week?:number
}