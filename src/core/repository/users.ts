import { LOCAL_URL } from "@/context/config"

export async function SearchUsersEmpresa(query:string) {
    const res = await fetch(`${LOCAL_URL}/api/users/empresa/search?query=${query}`)
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
      }
    return res.json()
  }


  export async function GetUsersEmpresaPagination(d:RequestUserEmpresaFilter,page:number) {
    const res = await fetch(`${LOCAL_URL}/api/users/empresa?page=${page}`,{
      method:"POST",
      body:JSON.stringify(d)
    })
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
      }
    return res.json()
  }

  export async function UpdateUserEmpresa(d:UserEmpresa) {
    const res = await fetch(`${LOCAL_URL}/api/users/empresa/update`,{
      method:"POST",
      body:JSON.stringify(d)
    })
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
      }
    return res.json()
  }

    
  export async function GetUserLocalReservas(uuid:string,id:string) {
    const res = await fetch(`${LOCAL_URL}/api/users/empresa/reservas/?uuid=${uuid}&id=${id}`)
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
      }
    return res.json()
  }

  