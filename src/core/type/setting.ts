type SettingEstablecimiento = {
    uuid:string
    establecimiento_id:number
    paid_type:number[] | null
    payment_for_reservation:number | null
    horario_interval:HorarioInterval[]
}



type HorarioInterval = {
    minutes:number
    id?:number
}


type AddIntervalRequest = {
    intervals:HorarioInterval[]
    setting_id:string
}
