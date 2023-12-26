import { NextResponse } from "next/server";
import { cookies } from 'next/headers'; // Import cookies
import { API_URL, API_URL_MESSAGE } from "@/context/config";

//Get intalaciones
export async function POST(request:Request) {
   const nextCookies = cookies(); // Get cookies object
   const token = nextCookies.get('access_token')?.value
   if(token == undefined){
    return NextResponse.json("Usuario no authorizado",{status:401})
  }
  try{
      const body = await request.text()
      const res = await fetch(`${API_URL_MESSAGE}/conversation/update-messages/readed/`,{
         method:"POST",
         body:body,
         headers:{
            'Authorization':`Bearer ${token}`,
            'Content-Type':'application/json'
         }
      })
      const data =await res.json()
      return NextResponse.json(data,{status:res.status})
   }catch(err){
      return NextResponse.json("Error Request",{status:500})
   }
}