import { API_URL, LOCAL_URL } from "@/context/config"

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

  export async function EditEvento(data:EditEventoRequest) {
    const res = await fetch(`${LOCAL_URL}/api/establecimiento/eventos/edit`,{
      method:"POST",
      body:JSON.stringify(data)
    })
  
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
    return res.json()
  }



  
  export async function GetEventoDetail(eventoUuid:string,eventoId:number) {
    const res = await fetch(`${LOCAL_URL}/api/establecimiento/eventos/detail?uuid=${eventoUuid}&id=${eventoId}`)
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