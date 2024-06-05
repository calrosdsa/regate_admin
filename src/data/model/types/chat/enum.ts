
export enum MessageType {
    INSTALACION=1,
    SALA=2,
}

export type MessageTypeInstalacion = {
    id:number
    name:string
    establecimiento_id:number
    photo:string
    cupos:Cupo[]
}

