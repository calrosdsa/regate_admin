// import { NextApiRequest,NextApiResponse } from "next";
// import { getCookies, getCookie, setCookie, deleteCookie } from 'cookies-next';
import { NextResponse } from "next/server";
import { STATUS_CODES } from "http";
import { API_URL } from "@/context/config";
import { cookies } from 'next/headers'; // Import cookies

export async function GET(request:Request) {
  const { searchParams } = new URL(request.url)
  const eventoUuid = searchParams.get('uuid')
  const nextCookies = cookies(); // Get cookies object
  const token = nextCookies.get('access_token')?.value
  if(token == undefined){
   return NextResponse.json("Usuario no authorizado",{status:401})
 }
 try{
     // const body = await request.json()
     const res = await fetch(`${API_URL}/evento/detail/${eventoUuid}/`,{
        headers:{
            'Authorization':`Bearer ${token}`
        }
     })
     const data =await res.json()
     return NextResponse.json(data,{status:res.status})
  }catch(err){
     return NextResponse.json("Error Request",{status:500})
  }
}


