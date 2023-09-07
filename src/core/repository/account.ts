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
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
    return res.json()
  }

  export async function VerifyToken() {
    const res = await fetch(`${API_URL}/account/admin/verify-token/`)  
    return res
  }