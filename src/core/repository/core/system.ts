import { LOCAL_URL } from "@/context/config"

export async function GetInfoText(id:InfoTextId){
    const res = await fetch(`${LOCAL_URL}/api/core/info-text?id=${id}`)
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
      }
      return res.json()
}



export enum InfoTextId {
    SUCURSAL_ESTADO_ID = 1,
    RESERVA_INTERVAL_TIME = 2
}