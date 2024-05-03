import { API_URL, LOCAL_URL } from "@/context/config"

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
    return res
  }

  
  export async function CheckRervasCuposAvailables(data:ReservaFromEventoRequest) {
    const res = await fetch(`${LOCAL_URL}/api/reservas/check-cupos-availables`,{
      method:"post",
      body:JSON.stringify(data)
    })
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
    return res.json()
  }

  export async function CheckInstalacionIsAvailable(data:CheckInstalacionIsAvailableRequest):Promise<Response> {
    const res = fetch(`${LOCAL_URL}/api/reservas/check-instalacion`,{
      method:"post",
      body:JSON.stringify(data)
    })
    return res
  }

  export async function ChangeInstalacion(data:ChangeInstalacionRequest) {
    const res = await fetch(`${LOCAL_URL}/api/reservas/change-instalacion`,{
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
    const res = await fetch(`${LOCAL_URL}/api/reservas/create-cupos`,{
      method:"post",
      body:JSON.stringify(data)
    })
    // if (!res.ok) {
    //   const b = await res.json()
    //   console.log("sasas",b)
    //   // This will activate the closest `error.js` Error Boundary
    //   throw new Error('Failed to fetch data')
    // }
    return res
  }

  export async function DeleteReservaCupos(data:ReservaFromEventoRequest) {
    const res = await fetch(`${LOCAL_URL}/api/reservas/delete-cupos-evento`,{
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
    const res = await fetch(`${LOCAL_URL}/api/reservas/reserva-cancel`,{
      method:"post",
      body:JSON.stringify(data)
    })
   
    return res
  }

  export async function ConfirmReserva(data:ConfirmReservaRequest) {
    const res = await fetch(`${LOCAL_URL}/api/reservas/reserva-confirm`,{
      method:"post",
      body:JSON.stringify(data)
    })
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
    return res.json()
  }

  export async function EditReserva(data:ReservaEditRequest) {
    const res = await fetch(`${LOCAL_URL}/api/reservas/reserva-edit`,{
      method:"post",
      body:JSON.stringify(data)
    })
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
    return res.json()
  }


  export async function GenerateReservaCupos(data:GenerateReservaCupoRequest) {
    const res = await fetch(`${LOCAL_URL}/api/reservas/generate-cupos`,{
      method:"post",
      body:JSON.stringify(data)
    })
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
    return res.json()
  }