import { redirectToLogin } from "@/context/actions"
import { API_URL, LOCAL_URL, MB_API_KEY } from "@/context/config"


export async function GetEstablecimientos() {
  const res = await fetch(`${LOCAL_URL}/api/establecimiento`)
  if(res.status == 401) {
    redirectToLogin()
    throw new Error('Failed to fetch data')
  }
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }
  return res.json()
}

export async function getEstablecimiento(uuid:string){
    const res = await fetch(`${LOCAL_URL}/api/establecimiento/${uuid}`)
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
      }
      return res.json()
}


export async function getPlaces(lng:string,lat:string){
    const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MB_API_KEY}&limit=1`)
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
      }
      return res.json()
}

export async function CreateEstablecimiento(data:FormData) {
  const res = await fetch(`${LOCAL_URL}/api/establecimiento`,{
    method:"POST",
    body:data,
  })
  if(res.status == 401) {
    redirectToLogin()
  }
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return res.json()
}

export async function UpdateEstablecimiento(data:string,id:number) {
  const res = await fetch(`${LOCAL_URL}/api/establecimiento/update?establecimiento_id=${id}`,{
    method:"POST",
    body:data,
  })
  if(res.status == 401) {
    redirectToLogin()
  }
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }
  return res.json()
}

export async function UpdateEstablecimientoPhoto(data:FormData) {
  const res = await fetch(`${LOCAL_URL}/api/establecimiento/update/photo`,{
    method:"POST",
    body:data,
  })
  if(res.status == 401) {
    redirectToLogin()
  }
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return res.json()
}

export async function AddEstablecimientoPhoto(data:FormData) {
  const res = await fetch(`${LOCAL_URL}/api/establecimiento/photo/add`,{
    method:"POST",
    body:data,
  })
  if(res.status == 401) {
    redirectToLogin()
  }
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return res.json()
}

export async function DeleteEstablecimientoPhoto(data:Photo) {
  const res = await fetch(`${LOCAL_URL}/api/establecimiento/photo/delete`,{
    method:"POST",
    body:JSON.stringify(data),
  })
  if(res.status == 401) {
    redirectToLogin()
  }
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return res.json()
}

export async function UpdateEstablecimientoAddress(data:string) {
  const res = await fetch(`${LOCAL_URL}/api/establecimiento/update/address`,{
    method:"POST",
    body:data,
  })
  if(res.status == 401) {
    redirectToLogin()
  }
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return res.json()
}

