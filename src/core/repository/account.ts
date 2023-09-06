export async function GetEstablecimientosUser() {
    const res = await fetch("../../api/account/establecimientos")
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
    return res.json()
  }