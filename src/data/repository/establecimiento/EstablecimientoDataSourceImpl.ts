import { LOCAL_URL, MB_API_KEY } from "@/context/config"


class EstablecimientoDataSourceImpl implements EstablecimientoDataSource{
    
    GetEstablecimientos() {
    const res =  fetch(`${LOCAL_URL}/api/establecimiento`)
    return res
  }
  
    GetEstablecimiento(uuid:string){
      const res = fetch(`${LOCAL_URL}/api/establecimiento/${uuid}`)
        return res
  }   
  
  
    GetPlaces(lng:string,lat:string){
      const res = fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MB_API_KEY}&limit=1`)
        return res
  }
  
    CreateEstablecimiento(data:FormData) {
    const res = fetch(`${LOCAL_URL}/api/establecimiento`,{
      method:"POST",
      body:data,
    })
    return res
  }
  
    UpdateEstablecimiento(data:string,id:number) {
    const res = fetch(`${LOCAL_URL}/api/establecimiento/update?establecimiento_id=${id}`,{
      method:"POST",
      body:data,
    })
    return res
  }
  
    UpdateEstablecimientoPhoto(data:FormData) {
    const res = fetch(`${LOCAL_URL}/api/establecimiento/update/photo`,{
      method:"POST",
      body:data,
    })
    return res
  }
  
    AddEstablecimientoPhoto(data:FormData) {
    const res = fetch(`${LOCAL_URL}/api/establecimiento/photo/add`,{
      method:"POST",
      body:data,
    })
    return res
  }
  
    DeleteEstablecimientoPhoto(data:Photo) {
    const res = fetch(`${LOCAL_URL}/api/establecimiento/photo/delete`,{
      method:"POST",
      body:JSON.stringify(data),
    })
    return res
  }
  
    UpdateEstablecimientoAddress(data:string) {
    const res = fetch(`${LOCAL_URL}/api/establecimiento/update/address`,{
      method:"POST",
      body:data,
    })
    return res
  }
  
  
}

export default EstablecimientoDataSourceImpl;