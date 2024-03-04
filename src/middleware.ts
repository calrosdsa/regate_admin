import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const access_token = request.cookies.get("access_token")
  const rol = request.cookies.get("rol")
  if(access_token == undefined){
    console.log("URL",request.nextUrl)
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
  console.log(request.nextUrl.pathname)
  if(request.nextUrl.pathname == "/"){
    if(rol !=undefined){
        if(rol.value == "1"){
            return NextResponse.redirect(new URL('/admin/manage/establecimientos', request.url))
          }
          if(rol.value == "0"){
              return NextResponse.redirect(new URL('/auth/login', request.url))
            }
      }
    }

}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/admin/:path*','/establecimiento/:path*','/']
}