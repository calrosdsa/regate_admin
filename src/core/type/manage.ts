type CreateUserRequest = {
    username:string
    email:string
    rol:number
    establecimientos:EstablecimientoUser[]
}

type EstablecimientoUser = {
    uuid:string
    id:number
    name:string
    admin_id?:string
}

type UpdateUserRequest = {
    estado:number
    uuid:string
}
