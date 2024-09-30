
type NameValueData = {
    name:string
    nameValue?:number
    value:number
    value2?:number | null
    date?:string
}

type ChartExportRequest = {
    data:NameValueData[]
    labels:string[]
    has_value_2:boolean
    type_value_chart:number
}



// {
//     "establecimiento_id":1,
//     "start_date":"2023-09-02 23:00:00",
//     "end_date":"2023-09-22 23:00:00",
//     "type_date":1
// }
 type FilterChartData = {
    start_date:undefined | string
    end_date:undefined | string
    type_date:number
    establecimiento_id?:number
    uuid?:string
    instalaciones?:number[]
    // start_week_date:string
    // end_week_date:string
}

 type ChartDataResponse = {
    // reserva_day_average:NameValueData[]
    reserva_hour_average:NameValueData[]
    reserva_count_hours:NameValueData[]
    reserva_amount:NameValueData[]
    reserva_amount_base:NameValueData[]
    reserva_count_hours_base:NameValueData[]
    reserva_amount_average:NameValueData[]
    user_frequency:NameValueData[]
}

type ChartState = {
    data:NameValueData[]
    response?:ChartDataResponse
    typeOfChart:number
    allowedCharts:number[]
    filterData:FilterChartData
    loading:boolean
    closeDialog:boolean
}