// import { NextApiRequest,NextApiResponse } from "next";
// import { getCookies, getCookie, setCookie, deleteCookie } from 'cookies-next';
import { NextResponse } from "next/server";
import { STATUS_CODES } from "http";
import { API_URL } from "@/context/config";
import { cookies } from 'next/headers'; // Import cookies


export async function POST(request:Request) {
    const nextCookies = cookies(); // Get cookies object
    const token = nextCookies.get('access_token')?.value
    if(token == undefined){
        return NextResponse.json("Usuario no authorizado",{status:401})
      }
    // console.log("TOKEN",token)
  try{
      const body = await request.json()
      const res = await fetch(`${API_URL}/chart/average-amount/base/`,{
            method:'POST',
            body:JSON.stringify(body),
            headers:{
                'Content-Type' :'application/json',
                'Authorization':`Bearer ${token}`
            }
        })
        const data = await res.json()
        console.log("RESPONSE",data)
      return NextResponse.json(data,{status:res.status})
   }catch(err){
      console.log(err)
      return NextResponse.json("Error Request",{status:500})
   }
}

