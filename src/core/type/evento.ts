import { Repeat, EndOptions } from "./enums"

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
    cupos:CupoR[]
    repeat_option?:Repeat
    repeat_every?:number
    end_option?:EndOptions
    until_date?:string
    count?:number
    selected_days_week?:number[]
    day_month:number
    day_month_position:number
}