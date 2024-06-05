
type Profile = {
    profile_id:number
    nombre?:string,
    apellido?:string
    profile_photo?:string
}


type User  = {
    id:number
    created_at?:string
    email:string
    empresa_id:number
    estado:number
    phone?:string
    last_login:string | null
    rol?:number
    user_id:string
    username:string
    last_updated_password?:string
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

type PasswordUpdateRequest = {
    current_password:string
    new_password:string
}