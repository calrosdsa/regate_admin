
type Sala = {
    id:number
    uuid:string
    instalacion_id:number
    establecimiento_id:number
    cupos:number
    descripcion:string
    titulo:string
    precio:number
    paid:number
    horas:string[]
    created_at:string
    users:number
    grupo_id:number
    estado:number
}

type SalaPaginationResponse = {
    next_page:number
    results:Sala[]
}