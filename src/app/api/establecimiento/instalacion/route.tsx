// import { NextApiRequest,NextApiResponse } from "next";
// import { getCookies, getCookie, setCookie, deleteCookie } from 'cookies-next';
import { NextResponse } from "next/server";
import { STATUS_CODES } from "http";
import { API_URL } from "@/context/config";
import { cookies } from 'next/headers'; // Import cookies

export async function GET(request:Request) {
  const { searchParams } = new URL(request.url)
  const uuid = searchParams.get('uuid')
  const nextCookies = cookies(); // Get cookies object
  const token = nextCookies.get('access_token')?.value
//    console.log(token)
  if(token == undefined){
   return NextResponse.json("Usuario no authorizado",{status:401})
 }
 try{
     // const body = await request.json()
     const res = await fetch(`${API_URL}/instalacion/admin/${uuid}/`,{
      headers:{
        "Authorization":`Bearer ${token}`
     }
     })
     const data =await res.json()
     // console.log(data)
     return NextResponse.json(data,{status:res.status})
  }catch(err){
     // console.log(err)
     return NextResponse.json("Error Request",{status:500})
  }
}

export async function POST(request:Request) {
    const nextCookies = cookies(); // Get cookies object
    const token = nextCookies.get('access_token')?.value
    if(token == undefined){
        return NextResponse.json("Usuario no authorizado",{status:401})
      }
    // console.log("TOKEN",token)
  try{
      const body = await request.formData()
    //   console.log(body.get("name"))
      const res = await fetch(`${API_URL}/instalacion/admin/`,{
            method:'POST',
            body:body,
            headers:{
                'Authorization':`Bearer ${token}`
            }
        })
        const data = await res.json()
        console.log("RESPONSE",data)
      return NextResponse.json(data,{status:res.status})
   }catch(err){
      console.log(err)
      return NextResponse.json("Error Request",{status:500})
   }
}

export async function PUT(request:Request) {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('instalacion_id')
    const instalacionUuid = searchParams.get('instalacionUuid')
    const uuid = searchParams.get('uuid')
    const nextCookies = cookies(); // Get cookies object
    const token = nextCookies.get('access_token')?.value
    if(token == undefined){
        return NextResponse.json("Usuario no authorizado",{status:401})
      }
    // console.log("TOKEN",token)
  try{
      const body = await request.text()
    //   console.log(body.get("name"))
      const res = await fetch(`${API_URL}/instalacion/admin/?instalacion_id=${id}&uuid=${uuid}&instalacionUuid=${instalacionUuid}`,{
            method:'PUT',
            body:body,
            headers:{
                'Content-Type' :'application/json',
                'Authorization':`Bearer ${token}`
            }
        })
        const data = await res.json()
        console.log("RESPONSE",data)
      return NextResponse.json(data,{status:res.status})
   }catch(err){
      console.log(err)
      return NextResponse.json("Error Request",{status:500})
   }
}
