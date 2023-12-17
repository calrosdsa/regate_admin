import { EstadoVisibility } from "../type/enums";


export const estadoVisibility:SelectItem[] = [
    {
        name:"Habilitado",
        value:EstadoVisibility.ENABLED.toString(),
    },
    {
        name:"Deshabilitado",
        value:EstadoVisibility.DISABLED.toString()
    }
]


export const dayMonth = [
    {
        name:"Primero",
        value:0
    },
    {
        name:"Segundo",
        value:1
    },
    {
        name:"Tercero",
        value:2
    },
    {
        name:"Cuarto",
        value:3
    },
    {
        name:"Ultimo",
        value:4
    },
]