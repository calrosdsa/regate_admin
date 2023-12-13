interface Reserva extends Profile {
    id:number
    instalacion_id:number
    establecimiento_id:number
    instalacion_name:string
    paid:number
    estado:number
    total_price:number
    start_date:string
    end_date:string
    created_at:string
    user_local_id?:number
}

type ReservaReporteRequest = {
    establecimiento_id:number
    start_date:string
    end_date:string
}

type ReservaDetail = {
    instalacion:Instalacion
    reserva:Reserva
}


type ReservaDataFilter = {
    uuid:string
    query?:string
    order:number
    order_queue?:number
}


type ReservaPaginationResponse = {
    results:Reserva[]
    next_page:number
    count:number
    page_size:number
}

type ReservaOrder = {
    order:number
    queue:number
}

type ReservaCancelRequest = {
    reserva_id:number
    content:string
    establecimiento_id:number
    profile_id?:number
    user_local_id?:number
    admin_id?:string 
}