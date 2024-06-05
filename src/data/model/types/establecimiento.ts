type EstablecimientoDetail = {
    establecimiento:Establecimiento
    setting_establecimiento:SettingEstablecimiento
    establecimiento_photos:Photo[]
    attention_schedule_week:AttentionSchedule[]
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

type AttentionSchedule = {
    id:number
    day_week:number
    day_name:string
    establecimiento_id:number
    open:boolean
    closed:boolean
    schedule_interval:AttentionScheduleTime[]
}

type AttentionScheduleTime = {
    id:number
    schedule_id:number
    start_time:string
    end_time:string
    deleted:boolean
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

