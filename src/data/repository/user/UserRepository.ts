import { UserDataSource } from "./UserDataSource";

export class UserRepository {
    dataSource:UserDataSource
    constructor(d :UserDataSource){
        this.dataSource = d
    }
    GetUserEmpresaDetail= async(id: number, uuid: string) =>{
        const res =await this.dataSource.GetUserEmpresaDetail(id,uuid)
        if (!res.ok) {
            // This will activate the closest `error.js` Error Boundary
            throw new Error('Failed to fetch data')
          }
        return res.json();
      }
    
      SearchUsersEmpresa= async(query: string)=> {
        const res = await this.dataSource.SearchUsersEmpresa(query);
        if (!res.ok) {
            // This will activate the closest `error.js` Error Boundary
            throw new Error('Failed to fetch data')
        }
        return res.json();
      }
    
      IsUserNameRepeat = async(name: string) => {
        const res =await this.dataSource.IsUserNameRepeat(name)
        if (!res.ok) {
            // This will activate the closest `error.js` Error Boundary
            throw new Error('Failed to fetch data')
        }
        return res.json();
      }
    
      GetUsersEmpresaPagination = async(d: RequestUserEmpresaFilter, page: number) =>{
        const res = await this.dataSource.GetUsersEmpresaPagination(d,page)
        if (!res.ok) {
            // This will activate the closest `error.js` Error Boundary
            throw new Error('Failed to fetch data')
        }
        return res.json();
      }
    
      UpdateUserEmpresa= async(d: UserEmpresa) => {
        const res = await this.dataSource.UpdateUserEmpresa(d)
        if (!res.ok) {
            // This will activate the closest `error.js` Error Boundary
            throw new Error('Failed to fetch data')
        }
        return res.json();
      }
    
      GetUserLocalReservas = async (uuid: string, id: string) => {
        const res = await this.dataSource.GetUserLocalReservas(uuid,id)
        if (!res.ok) {
            // This will activate the closest `error.js` Error Boundary
            throw new Error('Failed to fetch data')
        }
        return res.json();
      }
    
      GetUserEventos = async(body:UserEventosRequest,page:number):Promise<EventoPaginationResponse>=>{
        const res = await this.dataSource.GetUserEventos(body,page)
          if (!res.ok) {
            // This will activate the closest `error.js` Error Boundary
            throw new Error('Failed to fetch data')
        }
          return res.json()
      }
}