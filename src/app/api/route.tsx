import axios from "axios";
import { NextResponse } from "next/server";
import { cookies } from 'next/headers'; // Import cookies
import { API_URL } from "@/context/config";
export async function POST(request:Request) {
   try{
      const nextCookies = cookies(); // Get cookies object
      const token = nextCookies.get("access_token")?.value
      console.log(token)
      //    const cookies = cookie.parse(request.headers.get("cookie")?? "")
//    const access = cookies.access_token ?? ""
//    console.log(access)
//    if (access === "") {
//       return NextResponse.json("usuario no authorizado",{status:401})
//   }
//    console.log(request.headers.get("cookie"))
   // const body = await request.json()
   // const res = await axios.post("http://localhost:9090/v1/account/admin/login/",body)
   // const data = res.data
   const body = await request.json();
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
   if(res.status == 200){
      //  console.log(data)
      const oneDay = 24 * 60 * 60 * 1000
      nextCookies.set("rol",data.user.idRol,{ 
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
   return NextResponse.json("NO data")
}
}
