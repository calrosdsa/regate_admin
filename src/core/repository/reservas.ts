
export async function getInstalacionReservas(id:number) {
    const res = await fetch(`../../api/reservas/instalacion?id=${id}`)
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
    return res.json()
  }

export async function getEstablecimientoReservas(data:ReservaDataFilter) {
    const res = await fetch(`../../api/reservas/establecimiento/`,{
      method:"post",
      body:JSON.stringify(data)
    })
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
    return res.json()
  }