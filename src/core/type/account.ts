
type Profile = {
    nombre:string,
    apellido?:string
    profile_photo?:string
}


type User  = {
    created_at?:string
    email:string
    empresa_id:number
    estado:number
    phone:string
    rol?:number
    user_id:string
    username:string
}

type LoginResponse = {
    user:User
    access_token:string
}

type AccountState = {
    user:User | null
    establecimientos:EstablecimientoUser[]
}

type PasswordRequest = {
    password:string
}