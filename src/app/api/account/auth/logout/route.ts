import { NextResponse } from "next/server";
import { cookies } from 'next/headers'; // Import cookies
import { API_URL } from "@/context/config";
import { redirect } from "next/navigation";
export async function GET(request:Request) {
   const nextCookies = cookies(); // Get cookies object
   const token = nextCookies.get('access_token')?.value
   if(token == undefined){
    return NextResponse.json("Usuario no authorizado",{status:401})
  }
  try{
    //   const body:Cupo = await request.json()
      nextCookies.delete("access_token")
      nextCookies.delete("rol")
      
      // redirect("http://localhost:3000/auth/login")
      return NextResponse.json("",{status:200})
   
   }catch(err){
      return NextResponse.json("Error Request",{status:500})
   }
}

