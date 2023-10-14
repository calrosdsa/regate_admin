import { NextApiRequest,NextApiResponse } from "next";
import axios from "axios";
import cookie from 'cookie';
import { getCookies, getCookie, setCookie, deleteCookie } from 'cookies-next';
import { NextResponse } from "next/server";
import { cookies } from 'next/headers'; // Import cookies
import { API_URL } from "@/context/config";
export async function POST(request:Request) {
   const nextCookies = cookies(); // Get cookies object
   const token = nextCookies.get('access_token')?.value
   if(token == undefined){
    return NextResponse.json("Usuario no authorizado",{status:401})
  }
  try{
      const body = await request.text()
      const res = await fetch(`${API_URL}/admin/settings/update/attention-schedule/`,
      {
         method:'POST',
         body:body,
         headers:{
         'Authorization':`Bearer ${token}`,
         'Content-Type':"application/json"
        }
      }
      )
      const data = await res.json()
      // console.log("",data)
      return NextResponse.json(data,{status:res.status})
   }catch(err){
      // console.log(err)
      return NextResponse.json("Error Request",{status:500})
   }
 
}

