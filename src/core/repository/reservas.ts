
export async function getInstalacionReservas(id:number) {
    const res = await fetch(`../../api/reservas/instalacion?id=${id}`)
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
    return res.json()
  }

export async function getEstablecimientoReservas(uuid:string) {
    const res = await fetch(`../../api/reservas/establecimiento?id=${uuid}`)
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
    return res.json()
  }