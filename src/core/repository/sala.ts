import { LOCAL_URL } from "@/context/config"

export async function GetEstablecimientoSalas(uuid:string){
    const res = await fetch(`${LOCAL_URL}/api/establecimiento/${uuid}/salas`)
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
      }
      return res.json()
}