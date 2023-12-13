import { NextResponse } from "next/server";
import { cookies } from 'next/headers'; // Import cookies
import { API_URL } from "@/context/config";

export async function POST(request:Request) {
   const { searchParams } = new URL(request.url)
   const depositoId = searchParams.get("depositoId")
   const nextCookies = cookies(); // Get cookies object
   const token = nextCookies.get('access_token')?.value
//    console.log(token)
   if(token == undefined){
    return NextResponse.json("Usuario no authorizado",{status:401})
  }
  try{
      const body = await request.json()
      const res = await fetch(`${API_URL}/admin/reservas/reporte/`,
      {
         method:"post",
         body:JSON.stringify(body),
         headers:{
         'Authorization':`Bearer ${token}`,
         'Content-Type':'application/json'
      }})
      const data =await res.blob()
      return new Response(data,{
         status:res.status,
      })
   }catch(err){
      console.log(err)
      return NextResponse.json("Error Request",{status:500})
   }
}