

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
    category_name:number
    portada:string
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