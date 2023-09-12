
export async function GetUsersEmpresa() {
    const res = await fetch("../../api/admin/manage/users")
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
    return res.json()
}


export async function CreateUser(body:CreateUserRequest) {
    const res = await fetch("../../api/admin/manage/user",{
      method:"POST",
      body:JSON.stringify(body)
    })
    return res
} 

export async function UpdateUserEstado(body:string) {
  const res = await fetch("../../api/admin/manage/user/update-estado",{
    method:"POST",
    body:body
  })
  return res
} 

