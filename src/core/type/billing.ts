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
}

type DepositoPaginationResponse = {
    results:Deposito[]
    next_page:number
    count:number
    page_size:number
}



type Bank = {
    id:number
    name:string
}

