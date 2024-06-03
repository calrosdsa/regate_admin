import { ReservaDataSource } from "./ReservaDataSource";


export class ReservaRepository {
    dataSource:ReservaDataSource
    constructor(d:ReservaDataSource){
        this.dataSource = d
    }
    getEstablecimientoReservasCount = async (uuid:string) => {
        const res = await this.dataSource.getEstablecimientoReservasCount(uuid)
        return res.json()
      }
      
    GetReservaDetail = async (id:number) => {
        const res = await this.dataSource.GetReservaDetail(id)
        if (!res.ok) {
          // This will activate the closest `error.js` Error Boundary
          throw new Error('Failed to fetch data')
        }
        return res.json()
      }
      
      
    getInstalacionReservas = async (id:number) => {
          const res = await this.dataSource.getInstalacionReservas(id)
          if (!res.ok) {
            // This will activate the closest `error.js` Error Boundary
            throw new Error('Failed to fetch data')
          }
          return res.json()
        }
      
    GetEstablecimientoReservas = async (data:ReservaDataFilter,page:number):Promise<ReservaPaginationResponse> => {
          const res = await this.dataSource.getEstablecimientoReservas(data,page)
          if (!res.ok) {
            // This will activate the closest `error.js` Error Boundary
            throw new Error('Failed to fetch data')
          }
          return res.json()
        }
      
      
        CreateReserva = async (data:string) => {
          const res = await this.dataSource.CreateReserva(data)
          return res
        }
      
        
        CheckRervasCuposAvailables = async (data:ReservaFromEventoRequest) => {
          const res = await this.dataSource.CheckRervasCuposAvailables(data)
          if (!res.ok) {
            // This will activate the closest `error.js` Error Boundary
            throw new Error('Failed to fetch data')
          }
          return res.json()
        }
      
        CheckInstalacionIsAvailable = async (data:CheckInstalacionIsAvailableRequest):Promise<Response> => {
          const res = await this.dataSource.CheckInstalacionIsAvailable(data)
          return res
        }
      
        ChangeInstalacion = async (data:ChangeInstalacionRequest) => {
          const res = await this.dataSource.ChangeInstalacion(data)
          if (!res.ok) {
            // This will activate the closest `error.js` Error Boundary
            throw new Error('Failed to fetch data')
          }
          return res.json()
        }
      
      
        CreateReservaCupos = async (data:ReservaFromEventoRequest) => {
          const res = await this.dataSource.CreateReservaCupos(data)
          return res
        }
      
        DeleteReservaCupos = async (data:ReservaFromEventoRequest) => {
          const res = await this.dataSource.DeleteReservaCupos(data)
          if (!res.ok) {
            // This will activate the closest `error.js` Error Boundary
            throw new Error('Failed to fetch data')
          }
          return res.json()
        }
      
        GetReservasCupo = async (data:ReservaCupoRequest) => {
          const res = await this.dataSource.GetReservasCupo(data)
          if (!res.ok) {
            // This will activate the closest `error.js` Error Boundary
            throw new Error('Failed to fetch data')
          }
          return res.json()
        }
      
        CancelReserva = async (data:ReservaCancelRequest) => {
          const res = await this.dataSource.CancelReserva(data)
          return res
        }
      
        ConfirmReserva = async (data:ConfirmReservaRequest) => {
          const res = await this.dataSource.ConfirmReserva(data)
          if (!res.ok) {
            // This will activate the closest `error.js` Error Boundary
            throw new Error('Failed to fetch data')
          }
          return res.json()
        }
      
        CheckTimeExtra = async (data:TimeExtraReservaRequest) => {
          const res = await this.dataSource.CheckTimeExtra(data)
          // if (!res.ok) {
          //   // This will activate the closest `error.js` Error Boundary
          //   throw new Error('Failed to fetch data')
          // }
          return res
        }
      
        EditReserva = async (data:ReservaEditRequest) => {
          const res = await this.dataSource.EditReserva(data)
          if (!res.ok) {
            // This will activate the closest `error.js` Error Boundary
            throw new Error('Failed to fetch data')
          }
          return res.json()
        }
      
        DeleteReserva = async (data:DeleteReservaRequest) => {
          const res = await this.dataSource.DeleteReserva(data)
          if (!res.ok) {
            // This will activate the closest `error.js` Error Boundary
            throw new Error('Failed to fetch data')
          }
          return res.json()
        }
      
      
        GenerateReservaCupos = async (data:GenerateReservaCupoRequest) => {
          const res = await this.dataSource.GenerateReservaCupos(data)
          if (!res.ok) {
            // This will activate the closest `error.js` Error Boundary
            throw new Error('Failed to fetch data')
          }
          return res.json()
        }   
}