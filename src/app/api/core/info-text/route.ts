import { NextResponse } from "next/server";
import { cookies } from 'next/headers'; // Import cookies
import { API_URL, API_URL_CORE } from "@/context/config";

export async function GET(request:Request) {
   const { searchParams} = new URL(request.url)
   const id = searchParams.get("id")
   const nextCookies = cookies(); // Get cookies object
   const token = nextCookies.get('access_token')?.value
//    console.log(token)
   if(token == undefined){
    return NextResponse.json("Usuario no authorizado",{status:401})
  }
  try{
    //   const body:Cupo = await request.json()
      const res = await fetch(`${API_URL_CORE}/info/${id}/`)
      const data =await res.json()
      console.log(data)
      return NextResponse.json(data,{status:res.status})
   }catch(err){
      console.log(err)
      return NextResponse.json("Error Request",{status:500})
   }
}