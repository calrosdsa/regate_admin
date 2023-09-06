type CreateUserRequest = {
    username:string
    email:string
    rol:number
    establecimientos:EstablecimientoUser[]
}

type EstablecimientoUser = {
    uuid:string
    name:string
}