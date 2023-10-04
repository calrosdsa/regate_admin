type AccountBank = {
    id:number
    empresa_id:number
    account_number:string
    account_name:string
    bank_id:number
}

type Deposito = {
    id:number
    uuid:string
    gloss:string
    created_at:string
    income:number
    currency_abb:string
    tarifa:number
    date_paid:string
    estado:number
    comprobante_url:string | null 
    emition_date:string | null 
    establecimiento_name:string
}

type DepositoEmpresa = {
    id:number
    uuid:string
    empresa_id:number
    created_at:string
    total_income:number
    date_paid:string
    depositos?:Deposito[]
}

type DepositoPaginationResponse = {
    results:Deposito[]
    next_page:number
    count:number
    page_size:number
}

type DepositoEmpresaPaginationResponse = {
    results:DepositoEmpresa[]
    next_page:number
    count:number
    page_size:number
}


type Bank = {
    id:number
    name:string
}

