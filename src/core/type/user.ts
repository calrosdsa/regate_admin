type UserEmpresa = {
    id:number
    uuid?:string
    name:string
    phone_number:string
}

type PaginationUserEmpresaResponse = {
    results:UserEmpresa[]
    next_page:number
    count:number
    page_size:number
}

type RequestUserEmpresaFilter = {
    query:string
}