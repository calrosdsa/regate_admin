import { LOCAL_URL } from "@/context/config"

export async function GetUsersEmpresa() {
    const res = await fetch(`${LOCAL_URL}/api/admin/manage/users`)
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
    return res.json()
}


export async function CreateUser(body:CreateUserRequest) {
    const res = await fetch(`${LOCAL_URL}/api/admin/manage/user`,{
      method:"POST",
      body:JSON.stringify(body)
    })
    // if (!res.ok) {
    //   // This will activate the closest `error.js` Error Boundary
    //   throw new Error('Failed to fetch data')
    // }
    return res
} 

export async function AddEstablecimientoUser(d:EstablecimientoUser) {
  const res = await fetch(`${LOCAL_URL}/api/admin/manage/user/add-establecimiento`,{
    method:"POST",
    body:JSON.stringify(d)
  })
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }
  return res
} 

export async function DeleteEstablecimientoUser(establecimientoUuid:string,adminId:string) {
  const res = await fetch(`${LOCAL_URL}/api/admin/manage/user/delete-establecimiento?establecimientoUuid=${establecimientoUuid}&adminId=${adminId}`)
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }
  return res
}

export async function UpdateUserEstado(body:string) {
  const res = await fetch(`${LOCAL_URL}/api/admin/manage/user/update-estado`,{
    method:"POST",
    body:body
  })
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }
  return res
} 

