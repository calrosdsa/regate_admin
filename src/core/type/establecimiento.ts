type EstablecimientoDetail = {
    establecimiento:Establecimiento
    setting_establecimiento:SettingEstablecimiento
    establecimiento_photos:Photo[]
}

type Establecimiento = {
    id:number
    uuid:string
    address:string
    address_photo?:string
    phone_number:string
    email:string
    created_at:string
    longitud:string
    latitud:string
    name:string
    photo:string
    portada:string
    estado:number
    visibility:boolean
}


type EstablecimientoData = {
    description:string
    is_open:boolean
    name:string
    id:number
    photo:string
    uuid:string
}

type Place = {
    features:Feature[]
    query:number[]
}

type Feature = {
    place_name:string
    text:string
}

