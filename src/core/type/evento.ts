
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
    start_date:string | null
    end_date:string | null
    paid:number | null
    total_price:number | null
}

type EditEventoRequest = {
    uuid:string
	id:number
	name:string
	description:string
	paid:number
	should_update_amount:boolean
	establecimiento_uuid:string
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