import { API_URL, LOCAL_URL } from "@/context/config"
import { CreateEventoRequest } from "../type/evento"

export async function CreateEvento(data:CreateEventoRequest) {
    const res = await fetch(`${LOCAL_URL}/api/establecimiento/eventos/create`,{
      method:"POST",
      body:JSON.stringify(data)
    })
  
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
    return res.json()
  }


  
  
  export async function GetEventos(uuid:string,page:number) {
    const res = await fetch(`${LOCAL_URL}/api/establecimiento/eventos?uuid=${uuid}&page=${page}`)
  
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
    return res.json()
  }

    
  export async function DeleteEvento(eventoId:number) {
    const res = await fetch(`${LOCAL_URL}/api/establecimiento/eventos/delete?eventoId=${eventoId}`)
  
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
    return res.json()
  }