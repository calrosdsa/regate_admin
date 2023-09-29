
type Empresa = {
    id:number
    uuid:string
    name:string
    created_at:string
    updated_at:string
    longitud:string
    latitud:string
    admin_id:string | null
    phone_number:string | null
    email:string | null
    address:string | null
}

type EmpresaSetting = {
    id:number
    empresa_id?:number
    currency_id?:number
    tarifa?:number
    currency_abb:string
    currency_name:string
}

type EmpresaDetail = {
    empresa:Empresa
    setting:EmpresaSetting
}