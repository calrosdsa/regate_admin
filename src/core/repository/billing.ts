import { LOCAL_URL } from "@/context/config"

export async function GetBanks(){
    const res = await fetch(`${LOCAL_URL}/api/admin/billing/banks`)
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
      }
     
    //   console.log(res)
      return res.json()
}

export async function GetBankAccounts(){
    const res = await fetch(`../../api/admin/billing/bank-account`)
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
      }
     
    //   console.log(res)
      return res.json()
}

export async function GetBankAccountEstablecimiento(uuid:string){
  const res = await fetch(`../../api/admin/billing/bank-account/establecimiento?uuid=${uuid}`)
  if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
   
  //   console.log(res)
    return res.json()
}

export async function GetDepositosEmpresa(page:number){
  const res = await fetch(`../../api/admin/billing/depositos-empresa?page=${page}`)
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
      }
     
    //   console.log(res)
      return res.json()
}

export async function GetDepositosFromDepositoEmpresa(id:number){
  const res = await fetch(`../../api/admin/billing/depositos-empresa/depositos?id=${id}`)
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
      }
     
    //   console.log(res)
      return res.json()
}

export async function GetDepositos(page:number,uuid:string){
  const res = await fetch(`../../api/admin/billing/depositos?page=${page}&uuid=${uuid}`)
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
      }
     
    //   console.log(res)
      return res.json()
}
export async function GetDeposito(uuid:string){
  const res = await fetch(`../../../api/admin/billing/deposito?uuid=${uuid}`)
  if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
   
  //   console.log(res)
    return res.json()
}

export async function GetReservasPagadas(data:ReservaDataFilter,page:number){
  const res = await fetch(`../../../api/admin/billing/reservas-pagadas?page=${page}`,{
    method:'post',
    body:JSON.stringify(data)
  })
  if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
   
  //   console.log(res)
    return res.json()
}

export async function UpdateBankAccount(data:AccountBank){
    const res = await fetch(`../../api/admin/billing/bank-account?id=${data.id}`,{
        method:'POST',
        body:JSON.stringify(data)
    })
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
      }
     
    //   console.log(res)
      return res.json()
}

export async function CreateBankAccount(data:AccountBank){
  const res = await fetch(`../../../api/admin/billing/bank-account/create/`,{
    method:'post',
    body:JSON.stringify(data)
  })
  if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
   
  //   console.log(res)
    return res.json()
}

export async function AssignBankAccount(data:AssignBankAccountRequest){
  const res = await fetch(`../../../api/admin/billing/bank-account/assign/`,{
    method:'post',
    body:JSON.stringify(data)
  })
  if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
   
  //   console.log(res)
    return res.json()
}