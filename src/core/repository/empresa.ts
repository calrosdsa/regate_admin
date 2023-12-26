export async function GetEmpresaDetail(){
    const res = await fetch(`../../api/admin/empresa/`)
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
      }
     
      return res.json()
  }  
  
  export async function UpdateEmpresaDetail(data:string){
      const res = await fetch(`../../api/admin/empresa/update`,{
          method:'POST',
          body:data
      })
      if (!res.ok) {
          // This will activate the closest `error.js` Error Boundary
          throw new Error('Failed to fetch data')
        }
       
        return res.json()
  }

  export async function UpdateEmpresaAddress(data:string){
    const res = await fetch(`../../api/admin/empresa/update/address`,{
        method:'POST',
        body:data
    })
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
      }
     
      return res.json()
}