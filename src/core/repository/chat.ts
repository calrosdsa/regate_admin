import { API_URL_MESSAGE, LOCAL_URL } from "@/context/config"

export async function GetConversations(uuid:string) {
    const res = await fetch(`../../api/establecimiento/${uuid}/conversations/`)
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
    return res.json()
}

export async function GetMessages(id:number,page:number) {
  const res = await fetch(`${LOCAL_URL}/api/establecimiento/conversation/messages/?id=${id}&page=${page}`)
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
    return res.json()
}

export async function GetMessagesCount(uuid:string) {
  const res = await fetch(`${LOCAL_URL}/api/establecimiento/conversation/messages/count/?uuid=${uuid}`)
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
    return res.json()
}

export async function UpdateMessagesToReaded(data:string) {
  const res = await fetch(`${LOCAL_URL}/api/establecimiento/conversation/messages/readed`,{
    method:"POST",
    body:data
  })
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
    return res.json()
}