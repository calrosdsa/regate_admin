import { TypeOfChart, TypeOfDate } from "./enums"

export type NameValueData = {
    name:string
    value:number
    value2:number | null
    date?:string
}

export type ChartExportRequest = {
    data:NameValueData[]
    labels:string[]
    has_value_2:boolean
    type_value_chart:TypeValueChart
}

export enum TypeValueChart {
    NONE,
    HOURS,
    INGRESOS,
}

export enum ChartTypeData {
  INGRESOS_RESERVAS,
  HORAS_RESERVAS,
  HORAS_RESERVADAS_AVERAGE,
  INGRESOS_AVERAGE,
  INGRESOS_AVERAGE_DATE,
  USUARIOS,
  INGRESOS_HORAS
}


// {
//     "establecimiento_id":1,
//     "start_date":"2023-09-02 23:00:00",
//     "end_date":"2023-09-22 23:00:00",
//     "type_date":1
// }
export type FilterChartData = {
    start_date:undefined | string
    end_date:undefined | string
    type_date:TypeOfDate
    establecimiento_id?:number
    uuid?:string
}

export type ChartDataResponse = {
    // reserva_day_average:NameValueData[]
    reserva_hour_average:NameValueData[]
    reserva_count_hours:NameValueData[]
    reserva_amount:NameValueData[]
    reserva_amount_base:NameValueData[]
    reserva_count_hours_base:NameValueData[]
    reserva_amount_average:NameValueData[]
    user_frequency:NameValueData[]
}

export type ChartState = {
    data:NameValueData[]
    response?:ChartDataResponse
    typeOfChart:TypeOfChart
    allowedCharts:TypeOfDate[]
    filterData:FilterChartData
    loading:boolean
    closeDialog:boolean
}