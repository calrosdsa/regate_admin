

type Horario ={
    dayWeek:number
    dayName:string
}

type Instalacion = {
    id : number 
    uuid: string
    name:string
    description:string
    establecimiento_id:number
    category_id?:number
    category_name:string
    portada?:string
    max_cupos:number
    estado:number
}

type InstalacionRequest = {
    id : number 
    uuid: string
    name:string
    description:string
    establecimiento_id:number
    establecimiento_uuid:string
    category_id:number
    category_name:string
    portada?:string
    max_cupos:number
    precio_horario:number
    custom_precio_instalacion:CustomPrecioInstalacion[]
    time_range:string[]
}


type CustomPrecioInstalacion = {
    start_time:string
    end_time:string
    precio:string
    isError:boolean
    times:string[]
    // complete:boolean
}

type Cupo = {
    id?:number
    time:string
    day:number
    price?:number
    available:boolean
    instalacion_id:number
    establecimiento_id:number
}

type CreateUpdateCuposRequest = {
    cupos:Cupo[]
    available:boolean
    precio:number
}



type CupoReserva = {
    precio:number
    precio_reserva:number | null
    time:string
    color:string
    reserva_id:number | null
    available:boolean
    nombre:string
    apellido:string
    evento_id:number | null
    profile_id:number
    reserva_count:number
    instalacion_id:number | null
}

type DeleteInstalacionRequest = {
    id:number
    uuid:string
    establecimiento_uuid:string
}

type CupoReservaRequest = {
    instalacion_id:number
    date:string
    day_week:number
    end_date:string
}

type EditInstalacionesPreciosRequest = {
    instalaciones_id:number[]
    days_week:number[]
    times:string[]
    available:boolean
    action_type:number
    custom_precio_instalacion:CustomPrecioInstalacion[]
    establecimiento_uuid:string
    use_defined_price:boolean
}