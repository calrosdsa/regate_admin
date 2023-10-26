import axios from "axios";
import { NextResponse } from "next/server";
import { cookies } from 'next/headers'; // Import cookies
import { API_URL } from "@/context/config";
export async function POST(request:Request) {
   try{
      const nextCookies = cookies(); // Get cookies object      
      const body = await request.json();
      console.log(body)
      const res = await fetch(`${API_URL}/account/admin/login/`,{
            method:"post",
            body:JSON.stringify(body),
            headers:{
                  "Content-Type":"application/json"
            }
      }
      )
      console.log(res.status,"ESTATUS")
      const data =await res.json()
      console.log(data)
      if(res.status == 200){
            //  console.log(data)
            const oneDay = 24 * 60 * 60 * 1000
            nextCookies.set("rol",data.user.rol,{ 
                  expires: Date.now() + oneDay,
                  httpOnly:true
            })
            nextCookies.set("access_token",data.access_token,{ 
                  expires: Date.now() + oneDay,
                  httpOnly:true
            })
            
            return NextResponse.json(data,{status:200})
            
            // return new Response(JSON.stringify(data)    ,{
            //     headers: { 
                  //         "Set-Cookie": `access_token=${data.access_token};path:/;httpOnly=true;maxAge=60*60*24`,
            //     },
            //     status:200
            //  })
      } else {
            return NextResponse.json(data,{status:res.status})
      }
      }catch(e){
            console.log(e)
      console.log("error")
      return NextResponse.json("NO data",{status:500})
      }
}
