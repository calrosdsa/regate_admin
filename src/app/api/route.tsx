import axios from "axios";
import { NextResponse } from "next/server";
import { cookies } from 'next/headers'; // Import cookies
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
   const body = await request.json()
   const res = await axios.post("http://localhost:9090/v1/account/admin/login/",body)
   const data = res.data
   // console.log(data)
   // setCookie('access_token', data.access_token, { request, res,
      //    httpOnly:true,
      //    secure: process.env.NODE_ENV !== 'development',
      //    maxAge: 60 * 60 * 24,
      //    // sameSite: 'strict',
      //    path:"/api/",
      //    });
   //   setCookie('rol', data.user.idRol, { req, res,
   //       httpOnly:true,
   //       secure: process.env.NODE_ENV !== 'development',
   //       maxAge: 60 * 60 * 24,
   //       // sameSite: 'strict',
   //       path:"/api/",
   //       });
   return new Response(JSON.stringify(res.data),{
      headers: { "Set-Cookie": `access_token=${data.access_token};path:/;httpOnly=true;maxAge=60*60*24` },
      // headers: { 'Set-Cookie': `access_token=${data.access_token}` },
   })
}catch(e){
   console.log(e)
   return NextResponse.json("NO data")
}
}
