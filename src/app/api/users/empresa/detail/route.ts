import { NextResponse } from "next/server";
import { cookies } from 'next/headers'; // Import cookies
import { API_URL } from "@/context/config";
export async function GET(request:Request,
    { params }: { params: { uuid: string } }) {
   const { searchParams } = new URL(request.url)
   const uuid = searchParams.get('uuid')
   const id = searchParams.get('id')
   const nextCookies = cookies(); // Get cookies object
   const token = nextCookies.get('access_token')?.value
//    console.log(token)
   if(token == undefined){
    return NextResponse.json("Usuario no authorizado",{status:401})
  }
  try{   
      const res = await fetch(`${API_URL}/user/detail/${uuid}/${id}/`,{
         headers:{
            'Authorization':`Bearer ${token}`,
            'Content-Type':'application/json '
         }
      })
      const data =await res.json()
      return NextResponse.json(data,{status:res.status})
   }catch(err){
      // console.log(err)
      return NextResponse.json("Error Request",{status:500})
   }
}