

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
    category_id:number
    category_name:string
    portada?:string
    max_cupos:number
    estado:number
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