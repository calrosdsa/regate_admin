import { NextResponse } from "next/server";
import { cookies } from 'next/headers'; // Import cookies
import { API_URL } from "@/context/config";

//Get intalaciones
export async function GET(request:Request) {
   const { searchParams } = new URL(request.url)
   const instalacionId = searchParams.get('instalacionId')
   const dayWeek = searchParams.get('dayWeek')
   const nextCookies = cookies(); // Get cookies object
   const token = nextCookies.get('access_token')?.value
//    console.log(token)
   if(token == undefined){
    return NextResponse.json("Usuario no authorizado",{status:401})
  }
  try{
      // const body = await request.json()
      const res = await fetch(`${API_URL}/instalacion/admin/horario/${instalacionId}/${dayWeek}/`)
      const data =await res.json()
      // console.log(data)
      return NextResponse.json(data,{status:res.status})
   }catch(err){
      // console.log(err)
      return NextResponse.json("Error Request",{status:500})
   }
}

export async function POST(request:Request) {
   // const { searchParams } = new URL(request.url)
   const nextCookies = cookies(); // Get cookies object
   const token = nextCookies.get('access_token')?.value
//    console.log(token)
   if(token == undefined){
    return NextResponse.json("Usuario no authorizado",{status:401})
  }
  try{
      const body = await request.text()
      const res = await fetch(`${API_URL}/instalacion/admin/horario/`,{
         method:"POST",
         body:body,
         headers:{
            'Content-Type' :'application/json',
            'Authorization':`Bearer ${token}`
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