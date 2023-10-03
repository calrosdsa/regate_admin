import { NextApiRequest,NextApiResponse } from "next";
import axios from "axios";
import cookie from 'cookie';
import { getCookies, getCookie, setCookie, deleteCookie } from 'cookies-next';
import { NextResponse } from "next/server";
import { STATUS_CODES } from "http";
import { API_URL } from "@/context/config";
import { cookies } from 'next/headers'; // Import cookies

export async function POST(request:Request) {
    const nextCookies = cookies(); // Get cookies object
    const token = nextCookies.get('access_token')
    console.log(token)
  try{
      const body:Cupo = await request.json()
      const res = await axios.post(`${API_URL}/instalacion/admin/cupo/`,body,{
            headers:{
               "Access-Control-Allow-Credentials":true
            }
        })
        const data = res.data
      return NextResponse.json(data,{status:res.status})
   }catch(err){
      console.log(err)
      return NextResponse.json("Error Request",{status:500})
   }
}


export async function PUT(request:Request, context: { params: any }) {

   const nextCookies = cookies(); // Get cookies object
   const token = nextCookies.get('access_token')
   try{
      const {id,precio,available} = await request.json()
      console.log(id,precio)
  const res = await axios.put(`${API_URL}/instalacion/admin/cupo/${id}/?precio=${precio}&available=${available}`,{
           headers:{
              "Access-Control-Allow-Credentials":true
           }
       })
       const data = res.data
  return NextResponse.json(data,{status:200})
}catch(err){
   console.log(err)
  return NextResponse.json("Error Request",{status:500})
}
}
