import { DayMonthPosition, EstadoVisibility, ReservaEstado } from "../type/enums";


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


export const reservaEstados:SelectItem[] = [
    {
        name:"Todo",
        value:"-1"
    },
    {
        name:"Valido",
        value:ReservaEstado.Valid.toString()
    },
    {
        name:"Pendiente",
        value:ReservaEstado.Pendiente.toString()
    },
    {
        name:"Cancelado",
        value:ReservaEstado.Cancel.toString()
    },
]