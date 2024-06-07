import { DepositoEstado } from "@/data/model/types/enums"

class BillingRepository  {
    datasource:BillingDataSource
    constructor(d:BillingDataSource){
        this.datasource = d
    }
     GetBanks = async()=>{
    const res = await this.datasource.GetBanks()
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
      }
     
      return res.json()
}

 GetBankAccounts = async()=>{
    const res = await this.datasource.GetBankAccounts()
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
      }
     
      return res.json()
}

 GetBankAccountEstablecimiento = async(uuid:string)=>{
  const res = await this.datasource.GetBankAccountEstablecimiento(uuid)
  if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
   
    return res.json()
}

 GetDepositosEmpresa = async(page:number)=>{
  const res = await this.datasource.GetDepositosEmpresa(page)
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
      }
     
      return res.json()
}

 GetDepositosFromDepositoEmpresa = async(id:number)=>{
  const res = await this.datasource.GetDepositosFromDepositoEmpresa(id)
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
      }
     
      return res.json()
}

 GetDepositos = async(page:number,uuid:string)=>{
  const res = await this.datasource.GetDepositos(page,uuid)
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
      }
     
      return res.json()
}
 GetDeposito = async(uuid:string)=>{
  const res = await this.datasource.GetDeposito(uuid)
  if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
   
    return res.json()
}

 GetReservasPagadas = async(data:ReservaDataFilter,page:number)=>{
  const res = await this.datasource.GetReservasPagadas(data,page)
  if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
   
    return res.json()
}

 UpdateBankAccount = async(data:AccountBank)=>{
    const res = await this.datasource.UpdateBankAccount(data)
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
      }
     
      return res.json()
}

 CreateBankAccount = async(data:AccountBank)=>{
  const res = await this.datasource.CreateBankAccount(data)
  if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
   
    return res.json()
}

 AssignBankAccount = async(data:AssignBankAccountRequest)=>{
  const res = await this.datasource.AssignBankAccount(data)
  if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
   
    return res.json()
}

getDepositoEstadoName = (estado:DepositoEstado):string =>{
      switch(estado){
      case DepositoEstado.EMITIDO:
        return  "Emitido"      
        case DepositoEstado.PENDIENTE:
        return "Pendiente"  
     }
}
}

export default BillingRepository;