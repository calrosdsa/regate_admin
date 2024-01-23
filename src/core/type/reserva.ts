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
    establecimiento_uuid:string
    start_date:string
    end_date:string
    estado?:number
    instalaciones:number[]
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
    instalacion_id:string
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

type ReservaCupo = {
    reserva_type:number
    start_date:string
    reserva_id:number | null
    evento_id:number | null
}

type ReservaCupoRequest = {
    start_date:string
    end_date:string
    uuid:string
}

type CupoR = {
    start_date:string
    instalacion_id?:number
    precio:number
}

type ReservaCancelRequest = {
    reserva_id:number
    content:string
    establecimiento_id:number
    profile_id?:number
    user_local_id?:number
    admin_id?:string 
}

type ConfirmReservaRequest = {
    reserva_id:number
    amount_added:number
}

type ReservaEditRequest = {
    id:number
    estado:number
    amount:number
}

type GenerateReservaCupoRequest = {
    times:string[]
    instalacion_id:number
    establecimiento_uuid:string
}

type GenerateReservaCupoResponse = {
    reserva_cupos:CupoReserva[]
}