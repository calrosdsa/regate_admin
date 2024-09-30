import { LOCAL_URL } from "@/context/config"

class ManageDataSourceImpl {
    GetUsersEmpresa() {
        const res =  fetch(`${LOCAL_URL}/api/admin/manage/users`)
        return res
    }
    
    
    CreateUser(body:CreateUserRequest) {
        const res =  fetch(`${LOCAL_URL}/api/admin/manage/user`,{
          method:"POST",
          body:JSON.stringify(body)
        })
        return res
    } 
    
    AddEstablecimientoUser(d:EstablecimientoUser) {
      const res =  fetch(`${LOCAL_URL}/api/admin/manage/user/add-establecimiento`,{
        method:"POST",
        body:JSON.stringify(d)
      })
      return res
    } 
    
    DeleteEstablecimientoUser(establecimientoUuid:string,adminId:string) {
      const res =  fetch(`${LOCAL_URL}/api/admin/manage/user/delete-establecimiento?establecimientoUuid=${establecimientoUuid}&adminId=${adminId}`)
      return res
    }
    
    UpdateUserEstado(body:string) {
      const res =  fetch(`${LOCAL_URL}/api/admin/manage/user/update-estado`,{
        method:"POST",
        body:body
      })
      return res
    } 
    
    
}

export default ManageDataSourceImpl;