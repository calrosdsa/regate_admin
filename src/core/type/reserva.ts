
interface Reserva  {
    id:number
    uuid:string
    instalacion_id:number
    establecimiento_id:number
    instalacion_name:string
    paid:number
    estado:number
    total_price:number
    start_date:string
    end_date:string
    created_at:string
    user_id:number
    user_uuid:string | null
    evento:Evento
    reserva_type:number
    nombre?:string,
    apellido?:string
    profile_photo?:string
    cancellation_reason:string | null
}

type ReservaReporteRequest = {
    establecimiento_uuid:string
    start_date:string
    end_date:string
    estado?:number
    instalaciones:number[]
}

type CupoInterval = {
    interval:CupoR[]
    paid:number
    total:number
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
    instalacion_id?:string
    evento_id?:number | null 
    evento_uuid?:string
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
    reserva_uuid:string
    establecimiento_id:number
    establecimiento_uuid:string
    profile_id?:number
    user_id?:number
    admin_id?:string 
    reserva_type:number
    reasignar_reserva_request:ReasignarReservaRequest | null
}
type ReasignarReservaRequest = {
    evento_id?:number
    evento_uuid?:string
    cupo_interval:CupoInterval
}

type ConfirmReservaRequest = {
    reserva_id:number
    reserva_uuid:string
    amount_added:number
    start_date:string
    end_date:string
}

type ReservaEditRequest = {
    id:number
    reserva_uuid:string
    estado:number
    amount:number
    extra_time:number
    start_date:string
    end_date:string
}

type CheckInstalacionIsAvailableRequest = {
    instalacion_id:number
    times:string[]
    timestamps:string[]
    day_week:number
}
type ChangeInstalacionRequest = {
    instalacion_id:number
}


type GenerateReservaCupoRequest = {
    times:string[]
    instalacion_id:number
    establecimiento_uuid:string
}

type GenerateReservaCupoResponse = {
    reserva_cupos:CupoReserva[]
}