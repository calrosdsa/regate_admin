type CreateEventoRequest = {
    name:string
    description:string
    establecimiento_id:number
}

type Evento = {
    id:number
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