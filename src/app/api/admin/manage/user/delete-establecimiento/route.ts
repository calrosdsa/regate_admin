import { NextResponse } from "next/server";
import { cookies } from 'next/headers'; // Import cookies
import { API_URL } from "@/context/config";

export async function GET(request:Request) {
   const { searchParams } = new URL(request.url)
   const establecimientoUuid = searchParams.get('establecimientoUuid')
   const adminId = searchParams.get('adminId')
   const nextCookies = cookies(); // Get cookies object
   const token = nextCookies.get('access_token')?.value
   if(token == undefined){
    return NextResponse.json("Usuario no authorizado",{status:401})
  }
  try{
      const res = await fetch(`${API_URL}/manage/admin/user/delete-establecimiento/${establecimientoUuid}/${adminId}/`,
      {
        headers:{
         'Authorization':`Bearer ${token}`
      }})
      const data =await res.json()
      return NextResponse.json(data,{status:res.status})
   }catch(err){
      // console.log(err)
      return NextResponse.json("Error Request",{status:500})
   }
}