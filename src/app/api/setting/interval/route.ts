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
      const body = await request.json()
      const res = await axios.post(`${API_URL}/admin/settings/add-intervals/`,body,
      {headers:{
         'Authorization':`Bearer ${token}`
        }}
      )
      const data = res.data
      return NextResponse.json(data,{status:res.status})
   }catch(err){
      // console.log(err)
      return NextResponse.json("Error Request",{status:500})
   }
 
}

export async function PUT(request:Request) {
    const nextCookies = cookies(); // Get cookies object
    const token = nextCookies.get('access_token')?.value
    if(token == undefined){
     return NextResponse.json("Usuario no authorizado",{status:401})
   }
   try{
       const body = await request.json()
       console.log(body)
       const res = await axios.put(`${API_URL}/admin/settings/delete-intervals/`,body,
       {headers:{
          'Authorization':`Bearer ${token}`
         }}
       )
       const data = res.data
       return NextResponse.json(data,{status:200})
    }catch(err){
       console.log(err)
       return NextResponse.json("Error Request",{status:500})
    }
  
 }