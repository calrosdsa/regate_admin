import { API_URL, LOCAL_URL } from "@/context/config"
import { ReservaFromEventoRequest } from "../type/evento"

export async function getEstablecimientoReservasCount(uuid:string) {
  const res = await fetch(`${LOCAL_URL}/api/reservas/establecimiento/count?uuid=${uuid}`)
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }
  return res.json()
}

export async function GetReservaDetail(id:number) {
  const res = await fetch(`${LOCAL_URL}/api/reservas/detail?id=${id}`)
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }
  return res.json()
}


export async function getInstalacionReservas(id:number) {
    const res = await fetch(`${LOCAL_URL}/api/reservas/instalacion?id=${id}`)
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
    return res.json()
  }

export async function getEstablecimientoReservas(data:ReservaDataFilter,page:number) {
    const res = await fetch(`${LOCAL_URL}/api/reservas/establecimiento/?page=${page}`,{
      method:"post",
      body:JSON.stringify(data)
    })
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
    return res.json()
  }


  export async function CreateReserva(data:string) {
    const res = await fetch(`${LOCAL_URL}/api/reservas/instalacion/create`,{
      method:"post",
      body:data
    })
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
    return res.json()
  }

  
  export async function CheckRervasCuposAvailables(data:ReservaFromEventoRequest) {
    const res = await fetch(`${LOCAL_URL}/api/reservas/instalacion/check-cupos-availables`,{
      method:"post",
      body:JSON.stringify(data)
    })
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
    return res.json()
  }

  export async function CreateReservaCupos(data:ReservaFromEventoRequest) {
    const res = await fetch(`${LOCAL_URL}/api/reservas/instalacion/create-reserva-cupos`,{
      method:"post",
      body:JSON.stringify(data)
    })
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
    return res.json()
  }

  export async function GetReservasCupo(data:ReservaCupoRequest) {
    const res = await fetch(`${LOCAL_URL}/api/reservas/cupo`,{
      method:'POST',
      body:JSON.stringify(data)
    })
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
    return res.json()
  }

  export async function CancelReserva(data:ReservaCancelRequest) {
    const res = await fetch(`${LOCAL_URL}/api/reservas/cancel`,{
      method:"post",
      body:JSON.stringify(data)
    })
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
    return res.json()
  }