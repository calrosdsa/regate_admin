export async function addIntervalsHorario(data:AddIntervalRequest){
    const res = await fetch(`../../api/setting/interval`,{
        method:'POST',
        body:JSON.stringify(data)
    })
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
      }
      return res.json()
}

export async function deleteIntervalsHorario(data:HorarioInterval[]){
    const res = await fetch(`../../api/setting/interval`,{
        method:'PUT',
        body:JSON.stringify(data)
    })
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
      }
      return res.json()
}

export async function UpdatePayMethod(data:string,id:number) {
    const res = await fetch(`../../api/establecimiento/update/pay-method`,{
      method:"POST",
      body:data,
    })
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
    return res.json()
  }

export async function UpdateSettings(data:string,id:number) {
    const res = await fetch(`../../api/establecimiento/update/settings?establecimiento_id=${id}`,{
      method:"POST",
      body:data,
    })
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
    return res.json()
  }