import { EventoDataSource } from "./EventoDataSource";


export class EventoRepository{
    dataSource: EventoDataSource;
    
    constructor(d:EventoDataSource){
        this.dataSource = d
    }
    
    EditEventoAmount= async(data: EditEventoAmountRequest) =>{
        const res = await this.dataSource.EditEventoAmount(data)
        if(!res.ok){
            throw new Error('Failed to fetch data')
        }
        return res.json()
    }

    CreateEvento = async(data:CreateEventoRequest) => {
        const res = await this.dataSource.CreateEvento(data)
        if (!res.ok) {
          // This will activate the closest `error.js` Error Boundary
          throw new Error('Failed to fetch data')
        }
        return res.json()
      }
    
    EditEvento = async(data:EditEventoRequest) => {
        const res = await this.dataSource.EditEvento(data)
        if (!res.ok) {
          throw new Error('Failed to fetch data')
        }
        return res.json()
      }

    GetEventoDetail = async(eventoUuid:string,eventoId:number) => {
        const res = await this.dataSource.GetEventoDetail(eventoUuid,eventoId)
        if (!res.ok) {
          // This will activate the closest `error.js` Error Boundary
          throw new Error('Failed to fetch data')
        }
        return res.json()
      }
      
    GetEventos = async(uuid:string,page:number):Promise<EventoPaginationResponse> => {
        const res = await this.dataSource.GetEventos(uuid,page)
      
        if (!res.ok) {
          // This will activate the closest `error.js` Error Boundary
          throw new Error('Failed to fetch data')
        }
        return res.json()
      }
    
        
    DeleteEvento = async(eventoId:number) => {
        const res = await this.dataSource.DeleteEvento(eventoId)
      
        if (!res.ok) {
          // This will activate the closest `error.js` Error Boundary
          throw new Error('Failed to fetch data')
        }
        return res.json()
      }
    
}