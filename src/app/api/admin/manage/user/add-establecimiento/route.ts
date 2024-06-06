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
    //   console.log(body)
      const res = await fetch(`${API_URL}/admin/manage/user/add-establecimiento/`,
      {
        method:'post',
        body:body,
        headers:{
         'Content-Type' :'application/json',  
         'Authorization':`Bearer ${token}`
      }})
      const data =await res.json()
      return NextResponse.json(data,{status:res.status})
   }catch(err){
      // console.log(err)
      return NextResponse.json("Error Request",{status:500})
   }
}