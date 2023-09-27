export async function GetBanks(){
    const res = await fetch(`../../api/admin/billing/banks`)
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
      }
     
    //   console.log(res)
      return res.json()
}

export async function GetBankAccount(){
    const res = await fetch(`../../api/admin/billing/bank-account`)
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
      }
     
    //   console.log(res)
      return res.json()
}

export async function GetDepositos(){
    const res = await fetch(`../../api/admin/billing/depositos`)
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