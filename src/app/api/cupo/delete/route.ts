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
    const token = nextCookies.get('access_token')?.value
  try{
      const body  = await request.text()
      const res = await fetch(`${API_URL}/instalacion/admin/cupo/delete/`,{
            method:"POST",
            body:body,
            headers:{
               'Authorization':`Bearer ${token}`,
               'Content-Type':"application/json"
            }
        })
      const data =await res.json()
      return NextResponse.json(data,{status:res.status})
   }catch(err){
      return NextResponse.json("Error Request",{status:500})
   }
}

