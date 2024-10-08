import { DayMonthPosition, EstadoVisibility, EventoEstado, Repeat, ReservaEstado } from "../../data/model/types/enums";


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
        name:"Pagado",
        value:ReservaEstado.Valid.toString()
    },
    {
        name:"Pendiente",
        value:ReservaEstado.Pendiente.toString()
    },
    // {
    //     name:"Cancelado",
    //     value:ReservaEstado.Cancel.toString()
    // },
]

export const eventoEstados:SelectItem[] = [
    // {
    //     name:"Todo",
    //     value:"0"
    // },
    {
        name:"Pagado",
        value:EventoEstado.Valid.toString()
    },
    {
        name:"Pendiente",
        value:EventoEstado.Pendiente.toString()
    },
    {
        name:"Cancelado",
        value:EventoEstado.Cancel.toString()
    },
]

export  const repeatOptions = [
    {
        label:"Nunca",
        repeat:Repeat.NEVER
    },
    {
        label:"Diariamente",
        repeat:Repeat.DAYLY
    },
    {
        label:"Semanalmente",
        repeat:Repeat.WEEKLY
    },
    {
        label:"Mensualmente",
        repeat:Repeat.MOTHTLY
    },
]