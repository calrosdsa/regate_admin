import { NextResponse } from "next/server";
import { cookies } from 'next/headers'; // Import cookies
import { API_URL } from "@/context/config";
export async function POST(request:Request,
    { params }: { params: { uuid: string } }) {
   const { searchParams } = new URL(request.url)
   const page = searchParams.get('page')
   const nextCookies = cookies(); // Get cookies object
   const token = nextCookies.get('access_token')?.value
//    console.log(token)
   if(token == undefined){
    return NextResponse.json("Usuario no authorizado",{status:401})
  }
  try{   
      const body = await request.text()
      const res = await fetch(`${API_URL}/admin/user/eventos/?page=${page}`,{
         method:"POST",
         body:body,
         headers:{
            'Authorization':`Bearer ${token}`,
            'Content-Type':'application/json '
         }
      })
      const data =await res.json()
      return NextResponse.json(data,{status:res.status})
   }catch(err){
      return NextResponse.json("Error Request",{status:500})
   }
}