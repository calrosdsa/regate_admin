import { NextResponse } from "next/server";
import { API_URL } from "@/context/config";
import { cookies } from 'next/headers'; // Import cookies

export async function GET(request:Request) {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const nextCookies = cookies(); // Get cookies object
    const token = nextCookies.get('access_token')?.value
    if(token == undefined){
      return NextResponse.json("Usuario no authorizado",{status:401})
    }
    console.log(token)
  try{
    //   const body:Cupo = await request.json()
      const res = await fetch(`${API_URL}/admin/reservas-establecimiento/${id}/`,
      {
         headers:{
         'Authorization':`Bearer ${token}`
      }})
      const data =await res.json()
      // console.log(data)
      return NextResponse.json(data,{status:200})
   }catch(err){
      // console.log(err)
      return NextResponse.json("Error Request",{status:500})
   }
}