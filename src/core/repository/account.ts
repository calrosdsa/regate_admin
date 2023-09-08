import { API_URL } from "@/context/config"

export async function GetEstablecimientosUser() {
    const res = await fetch("../../api/account/establecimientos")
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
    return res.json()
  }

  export async function SendResetPasswordEmail(mail:string) {
    const res = await fetch(`${API_URL}/account/admin/sned-reset-password/${mail}/`)
    return res
  }

  export async function VerifyToken() {
    const res = await fetch(`${API_URL}/account/admin/verify-token/`)  
    return res
  }

  export async function ResetPassword(d:PasswordRequest,token:string) {
    const res = await fetch(`${API_URL}/account/admin/reset-password/`,{
      method:"POST",
      body:JSON.stringify(d),
      headers:{
        "Content-Type":"application/json",
        "Authorization":`Bearer ${token}`
      }
    })
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
    return res.json()
  }