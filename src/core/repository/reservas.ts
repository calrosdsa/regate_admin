import { API_URL } from "@/context/config"

export async function getEstablecimientoReservasCount(uuid:string) {
  const res = await fetch(`${API_URL}/admin/reservas-establecimmiento-count/${uuid}/`)
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }
  return res.json()
}

export async function GetReservaDetail(id:number) {
  const res = await fetch(`../../api/reservas/detail?id=${id}`)
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }
  return res.json()
}


export async function getInstalacionReservas(id:number) {
    const res = await fetch(`../../api/reservas/instalacion?id=${id}`)
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
    return res.json()
  }

export async function getEstablecimientoReservas(data:ReservaDataFilter,page:number) {
    const res = await fetch(`../../api/reservas/establecimiento/?page=${page}`,{
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
    const res = await fetch(`../../api/reservas/instalacion/create`,{
      method:"post",
      body:data
    })
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
    return res.json()
  }


  export async function CancelReserva(data:ReservaCancelRequest) {
    const res = await fetch(`../../api/reservas/cancel`,{
      method:"post",
      body:JSON.stringify(data)
    })
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
    return res.json()
  }