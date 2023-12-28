type PaginationProps = {
    pageSize:number
    nextPage:number
    count:number
    currentPage:number
}


type ResponseMessage = {
    message:string
}


type Photo = {
    id:number
    parent_id:number
    uuid:string
    url?:string
    type_entity:number
}
