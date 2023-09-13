
export async function GetEstablecimientosUserByUuid(data:string) {
    const res = await fetch("../../api/admin/manage/user/establecimientos",{
      method:"post",
      body:data
    })
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
    return res.json()
  }

  export async function SendResetPasswordEmail(mail:string) {
    const res = await fetch(`../../api/account/auth/send-reset-password?mail=${mail}`)
    return res
  }

  export async function VerifyToken(token:string) {
    const res = await fetch(`../../api/account/auth/verify-token?token=${token}`)  
    return res
  }
  
  export async function ResetPassword(d:PasswordRequest,token:string) {
    const res = await fetch(`../../api/account/auth/reset-password?token=${token}`,{
      method:"POST",
      body:JSON.stringify(d),
    })
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
    return res.json()
  }