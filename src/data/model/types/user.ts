type UserEmpresa = {
    id:number
    uuid?:string
    name:string
    phone_number:string
    created_at?:string
    reservas_count?:number
}

type PaginationUserEmpresaResponse = {
    results:UserEmpresa[]
    next_page:number
    count:number
    page_size:number
}

type RequestUserEmpresaFilter = {
    query:string
    order:number
    order_queue:number
    establecimiento_uuid:string
}

type UserEventosRequest = {
    user_id:number
}