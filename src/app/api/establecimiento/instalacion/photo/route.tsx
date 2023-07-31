// import { NextApiRequest,NextApiResponse } from "next";
// import { getCookies, getCookie, setCookie, deleteCookie } from 'cookies-next';
import { NextResponse } from "next/server";
import { API_URL } from "@/context/config";
import { cookies } from 'next/headers'; // Import cookies


export async function PUT(request:Request) {
    const nextCookies = cookies(); // Get cookies object
    const token = nextCookies.get('access_token')?.value
    if(token == undefined){
        return NextResponse.json("Usuario no authorizado",{status:401})
      }
    // console.log("TOKEN",token)
  try{
      const body = await request.formData()
    //   console.log(body.get("name"))
      const res = await fetch(`${API_URL}/instalacion/admin/photo/`,{
            method:'PUT',
            body:body,
            headers:{
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
