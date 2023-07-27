import { API_URL_MESSAGE } from "@/context/config"

export async function GetConversations(uuid:string) {
    const res = await fetch(`../../api/establecimiento/${uuid}/conversations/`)
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
    return res.json()
}

export async function GetMessages(id:number,page:number) {
    const res = await fetch(`${API_URL_MESSAGE}/conversation/messages/${id}/?page=${page}`)
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
    return res.json()
}