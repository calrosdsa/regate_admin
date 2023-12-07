export async function SearchUsersEmpresa(query:string) {
    const res = await fetch(`../../api/users/empresa/search?query=${query}`)
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
      }
    return res.json()
  }


  export async function GetUsersEmpresaPagination(d:RequestUserEmpresaFilter,page:number) {
    const res = await fetch(`../../api/users/empresa?page=${page}`,{
      method:"POST",
      body:JSON.stringify(d)
    })
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
      }
    return res.json()
  }


  