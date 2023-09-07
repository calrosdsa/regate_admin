interface Reserva extends Profile {
    id:number,
    instalacion_id:number,
    paid:number
    total_price:number
    start_date:string
    end_date:string
    created_at:string
}

type ReservaDataFilter = {
    uuid:string
    query:string
    order:number
    order_queue:number
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
