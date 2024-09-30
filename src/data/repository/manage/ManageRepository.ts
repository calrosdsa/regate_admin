import { ThirtyFpsSelectRounded } from "@mui/icons-material"

export class ManageRepository {
    dataSource:ManageDataSource
    constructor(d:ManageDataSource){
        this.dataSource = d
    }
    GetUsersEmpresa= async() =>{
        const res = await this.dataSource.GetUsersEmpresa()
        if (!res.ok) {
          // This will activate the closest `error.js` Error Boundary
          throw new Error('Failed to fetch data')
        }
        return res.json()
    }
    
    
    CreateUser= async(body:CreateUserRequest) =>{
        const res = await this.dataSource.CreateUser(body)
        // if (!res.ok) {
        //   // This will activate the closest `error.js` Error Boundary
        //   throw new Error('Failed to fetch data')
        // }
        return res
    } 
    
    AddEstablecimientoUser= async(d:EstablecimientoUser) =>{
      const res = await this.dataSource.AddEstablecimientoUser(d)
      if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
      }
      return res
    } 
    
    DeleteEstablecimientoUser= async(establecimientoUuid:string,adminId:string) =>{
      const res = await this.dataSource.DeleteEstablecimientoUser(establecimientoUuid,adminId)
      if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
      }
      return res
    }
    
    UpdateUserEstado= async(body:string) =>{
      const res = await this.dataSource.UpdateUserEstado(body)
      if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
      }
      return res
    }   
}