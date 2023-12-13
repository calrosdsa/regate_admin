import { NextResponse } from "next/server";
import { API_URL } from "@/context/config";
import { cookies } from 'next/headers'; // Import cookies

export async function GET(request:Request) {
   const { searchParams } = new URL(request.url)
   const uuid = searchParams.get('uuid')
   const nextCookies = cookies(); // Get cookies object
   const token = nextCookies.get('access_token')?.value
   if(token == undefined){
      return NextResponse.json("Usuario no authorizado",{status:401})
    }
  try{
      const res = await fetch(`${API_URL}/admin/reservas-establecimmiento-count/${uuid}/`)
      const data =await res.json()
      // console.log(data)
      return NextResponse.json(data,{status:res.status})
   }catch(err){
      // console.log(err)
      return NextResponse.json("Error Request",{status:500})
   }
}