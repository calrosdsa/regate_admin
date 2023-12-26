import { NextResponse } from "next/server";
import { cookies } from 'next/headers'; // Import cookies
import { API_URL } from "@/context/config";
export async function GET(request:Request,
    { params }: { params: { uuid: string } }) {
   // const { searchParams } = new URL(request.url)
   // const uuid = searchParams.get('uuid')
   const nextCookies = cookies(); // Get cookies object
   const token = nextCookies.get('access_token')?.value
//    console.log(token)
   if(token == undefined){
    return NextResponse.json("Usuario no authorizado",{status:401})
  }
  try{
    //   const body:Cupo = await request.json()
      const res = await fetch(`${API_URL}/empresa/establecimientos/`,{
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

export async function POST(request:Request) {
   const nextCookies = cookies(); // Get cookies object
   const token = nextCookies.get('access_token')?.value
   if(token == undefined){
       return NextResponse.json("Usuario no authorizado",{status:401})
     }
   // console.log("TOKEN",token)
 try{
     const body = await request.formData()
   //   console.log(body.get("name"))
     const res = await fetch(`${API_URL}/empresa/establecimiento/create/`,{
           method:'POST',
           body:body,
           headers:{
               'Authorization':`Bearer ${token}`
           }
       })
       const data = await res.json()
      //  console.log("RESPONSE",data)
     return NextResponse.json(data,{status:res.status})
  }catch(err){
   //   console.log(err)
     return NextResponse.json("Error Request",{status:500})
  }
}
