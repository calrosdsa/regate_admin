
type CreateEventoRequest = {
    name:string
    description:string
    establecimiento_id:number
}

type Evento = {
    id:number
    uuid:string
    name:string
    description:string
    establecimiento_id:number
}


type EventoPaginationResponse = {
    results:Evento[]
    next_page:number
    count:number
    page_size:number
}


type ReservaFromEventoRequest = {
    times:string[]
    establecimiento_id?:number
    instalaciones:number[]
    reserva_type?:number
    evento_uuid?:string
    reserva_id?:number
    day_week?:number
}