import { LOCAL_URL } from "@/context/config"

export class ReservaDataSource {
    getEstablecimientoReservasCount = (uuid:string) => {
        const res =  fetch(`${LOCAL_URL}/api/reservas/establecimiento/count?uuid=${uuid}`)
        return res
      }
      
    GetReservaDetail = (id:number) => {
        const res =  fetch(`${LOCAL_URL}/api/reservas/detail?id=${id}`)
        return res
      }
      
      
    getInstalacionReservas = (id:number) => {
          const res =  fetch(`${LOCAL_URL}/api/reservas/instalacion?id=${id}`)
          return res
        }
      
    getEstablecimientoReservas = (data:ReservaDataFilter,page:number) => {
          const res =  fetch(`${LOCAL_URL}/api/reservas/establecimiento/?page=${page}`,{
            method:"post",
            body:JSON.stringify(data)
          })
          return res
        }
      
      
        CreateReserva = (data:string) => {
          const res =  fetch(`${LOCAL_URL}/api/reservas/instalacion/create`,{
            method:"post",
            body:data
          })
          return res
        }
      
        
        CheckRervasCuposAvailables = (data:ReservaFromEventoRequest) => {
          const res =  fetch(`${LOCAL_URL}/api/reservas/check-cupos-availables`,{
            method:"post",
            body:JSON.stringify(data)
          })
          
          return res
        }
      
        CheckInstalacionIsAvailable = (data:CheckInstalacionIsAvailableRequest):Promise<Response> => {
          const res = fetch(`${LOCAL_URL}/api/reservas/check-instalacion`,{
            method:"post",
            body:JSON.stringify(data)
          })
          return res
        }
      
        ChangeInstalacion = (data:ChangeInstalacionRequest) => {
          const res =  fetch(`${LOCAL_URL}/api/reservas/change-instalacion`,{
            method:"post",
            body:JSON.stringify(data)
          })
          
          return res
        }
      
      
        CreateReservaCupos = (data:ReservaFromEventoRequest) => {
          const res =  fetch(`${LOCAL_URL}/api/reservas/create-cupos`,{
            method:"post",
            body:JSON.stringify(data)
          })
          return res
        }
      
        DeleteReservaCupos = (data:ReservaFromEventoRequest) => {
          const res =  fetch(`${LOCAL_URL}/api/reservas/delete-cupos-evento`,{
            method:"post",
            body:JSON.stringify(data)
          })
          
          return res
        }
      
        GetReservasCupo = (data:ReservaCupoRequest) => {
          const res =  fetch(`${LOCAL_URL}/api/reservas/cupo`,{
            method:'POST',
            body:JSON.stringify(data)
          })
          
          return res
        }
      
        CancelReserva = (data:ReservaCancelRequest) => {
          const res =  fetch(`${LOCAL_URL}/api/reservas/reserva-cancel`,{
            method:"post",
            body:JSON.stringify(data)
          })
          return res
        }
      
        ConfirmReserva = (data:ConfirmReservaRequest) => {
          const res =  fetch(`${LOCAL_URL}/api/reservas/reserva-confirm`,{
            method:"post",
            body:JSON.stringify(data)
          })
          return res
        }
      
        CheckTimeExtra = (data:TimeExtraReservaRequest) => {
          const res =  fetch(`${LOCAL_URL}/api/reservas/check-time-extra `,{
            method:"post",
            body:JSON.stringify(data)
          })
          return res
        }
      
        EditReserva = (data:ReservaEditRequest) => {
          const res =  fetch(`${LOCAL_URL}/api/reservas/reserva-edit`,{
            method:"post",
            body:JSON.stringify(data)
          })
          return res
        }
      
        DeleteReserva = (data:DeleteReservaRequest) => {
          const res =  fetch(`${LOCAL_URL}/api/reservas/reserva-delete`,{
            method:"post",
            body:JSON.stringify(data)
          })
          return res
        }
      
      
        GenerateReservaCupos = (data:GenerateReservaCupoRequest) => {
          const res =  fetch(`${LOCAL_URL}/api/reservas/generate-cupos`,{
            method:"post",
            body:JSON.stringify(data)
          })
          return res
        }   
}