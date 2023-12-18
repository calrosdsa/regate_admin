import { DayMonthPosition, EstadoVisibility } from "../type/enums";


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
        value:DayMonthPosition.FIRST
    },
    {
        name:"Segundo",
        value:DayMonthPosition.SECOND
    },
    {
        name:"Tercero",
        value:DayMonthPosition.THIRD
    },
    {
        name:"Cuarto",
        value:DayMonthPosition.FOURTH
    },
    {
        name:"Ultimo",
        value:DayMonthPosition.LAST
    },
]