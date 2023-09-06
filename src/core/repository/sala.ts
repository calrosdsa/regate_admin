export async function GetEstablecimientoSalas(uuid:string){
    const res = await fetch(`../../api/establecimiento/${uuid}/salas`)
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
      }
      return res.json()
}