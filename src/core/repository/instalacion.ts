import { API_URL } from "@/context/config"


export async function UpdateInstalacion(data:string,id:number) {
  const res = await fetch(`../../api/establecimiento/instalacion?instalacion_id=${id}`,{
    method:"PUT",
    body:data,
  })
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return res.json()
}

export async function UpdateInstalacionPhoto(data:FormData) {
  const res = await fetch(`../../api/establecimiento/instalacion/photo`,{
    method:"PUT",
    body:data,
  })
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return res.json()
}


export async function CreateInstalacion(data:FormData) {
  const res = await fetch(`../../api/establecimiento/instalacion`,{
    method:"POST",
    body:data,
  })
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return res.json()
}

export async function getInstalaciones(uuid:string){
    const res = await fetch(`../../api/establecimiento/instalacion/list?uuid=${uuid}`)
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
      }
     
    //   console.log(res)
      return res.json()
}

export async function GetInstalacion(uuid:string){
    const res = await fetch(`../../api/establecimiento/instalacion?uuid=${uuid}`)
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
      }
     
      console.log(res)
      return res.json()
}


export async function getInstalacionById(id:number){
  const res = await fetch(`../../api/establecimiento/instalacion/${id}`)
  if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
   
    console.log(res)
    return res.json()
}



export async function getInstalacionDayHorario(instalacionId:number,dayWeek:number){
  const res = await fetch(`../../api/establecimiento/instalacion/horario?instalacionId=${instalacionId}&dayWeek=${dayWeek}`)
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
      }
      // console.log(res)
      return res.json()
}

export async function CopyInstalacionHorario(d:string){
  const res = await fetch(`../../api/establecimiento/instalacion/horario/copy`,{
    method:"POST",
    body:d
  })
  if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
   
    return res.json()
}

export async function ResetInstalacionHorarioDay(d:string){
  const res = await fetch(`../../api/establecimiento/instalacion/horario/reset`,{
    method:"POST",
    body:d
  })
  if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
   
    return res.json()
}


export async function GetCupoReservaInstalciones(d:CupoReservaRequest){
  const res = await fetch(`../../api/establecimiento/instalacion/reserva-cupo`,{
    cache: 'no-store',
    method:"POST",
    body:JSON.stringify(d)
  })
  if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
   
    return res.json()
}

export async function createCupoInstalacion(cupo:Cupo,uuid:string) {
    const res = await fetch(`../../api/cupo`,{
      method:"POST",
      body:JSON.stringify(cupo)
    })

    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
    return res.json()
}

export async function updateCupoInstalacion(id:number,precio:number,available:boolean) {
  const res = await fetch(`../../api/cupo`,{
    method:"PUT",
    body:JSON.stringify({id,precio,available})
  })

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }
  return res.json()
}