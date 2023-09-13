import { NextResponse } from "next/server";
import { cookies } from 'next/headers'; // Import cookies
import { API_URL } from "@/context/config";
export async function GET(request:Request) {
   const { searchParams } = new URL(request.url)
   const token = searchParams.get('token')   
//    const nextCookies = cookies(); // Get cookies object
//    const token = nextCookies.get('access_token')?.value
// //    console.log(token)
//    if(token == undefined){
//     return NextResponse.json("Usuario no authorizado",{status:401})
//   }
  try{
   const res = await fetch(`${API_URL}/account/admin/verify-token/`,{
      headers:{
        'Authorization':`Bearer ${token}`
      }
    })  
      const data =await res.json()
      // console.log(data)
      return NextResponse.json(data,{status:res.status})
   }catch(err){
      // console.log(err)
      return NextResponse.json("Error Request",{status:500})
   }
}

