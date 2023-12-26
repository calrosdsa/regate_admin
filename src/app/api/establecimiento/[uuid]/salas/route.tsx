import { NextResponse } from "next/server";
import { cookies } from 'next/headers'; // Import cookies
import { API_URL, API_URL_MESSAGE } from "@/context/config";

export async function GET(request:Request,
    { params }: { params: { uuid: string } }) {
   const nextCookies = cookies(); // Get cookies object
   const token = nextCookies.get('access_token')?.value
   if(token == undefined){
    return NextResponse.json("Usuario no authorizado",{status:401})
  }
  try{
    //   const body:Cupo = await request.json()
      const res = await fetch(`${API_URL}/sala/admin/establecimiento/salas/${params.uuid}/`,
      {
         headers:{
         'Authorization':`Bearer ${token}`
      }})
      const data =await res.json()
      return NextResponse.json(data,{status:res.status})
   }catch(err){
      return NextResponse.json("Error Request",{status:500})
   }
}