import { PaidType } from "../type/enums";


export const getPaymentMethod = (num:number):string =>{
     switch(num) {
        case PaidType.LOCAL:
            return "Pago en el establecimiento"
        case PaidType.DEFERRED_PAYMENT:
            return "Pagar un adelanto"
        case PaidType.UPFRONT_PAYMENT:
            return "Pago total"
        default:
            return ""
    }
}

export const getIntervaloString = (minutes:number)=>{
    const h = minutes/60
    if(h == 1) return `${1} hora`;
    if(h == 0.5) return "30 minutos"
    if(Number.isInteger(h)){
        return `${h} horas`
    }else{
        return `${Math.floor(h)} horas y media`
    }
}