import { API_URL, MB_API_KEY } from "@/context/config"


export async function getEstablecimientos() {
  const res = await fetch("../../api/establecimiento")
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }
  return res.json()
}

export async function getEstablecimiento(uuid:string){
    const res = await fetch(`../../api/establecimiento/${uuid}`)
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
