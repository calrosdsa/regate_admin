import { NextResponse } from "next/server";
import { cookies } from 'next/headers'; // Import cookies
import { API_URL } from "@/context/config";

export async function POST(request:Request) {
   const { searchParams } = new URL(request.url)
   const page = searchParams.get('page')
   const nextCookies = cookies(); // Get cookies object
   const token = nextCookies.get('access_token')?.value
//    console.log(token)
   if(token == undefined){
    return NextResponse.json("Usuario no authorizado",{status:401})
  }
  try{
      const body:Cupo = await request.json()
      const res = await fetch(`${API_URL}/admin/billing/reservas-pagadas/?page=${page}`,
      {
         method:"post",
         body:JSON.stringify(body),
         headers:{
         'Authorization':`Bearer ${token}`,
         'Content-Type':'application/json'
      }})
      const data =await res.json()
      // console.log(data)
      return NextResponse.json(data,{status:200})
   }catch(err){
      // console.log(err)
      return NextResponse.json("Error Request",{status:500})
   }
}