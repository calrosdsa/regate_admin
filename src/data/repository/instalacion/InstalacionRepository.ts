class InstalacionRepository {
    datasource:InstalacionDataSource
    constructor(d:InstalacionDataSource){
        this.datasource = d
    }
UpdateInstalacion= async(data:string,id:number,uuid:string,instalacionUuid:string) => {
    const res = await this.datasource.UpdateInstalacion(data,id,uuid,instalacionUuid)
    if (!res.ok) {
      throw new Error('Failed to fetch data')
    }
    return res.json()
  }
  
UpdateInstalacionPhoto= async(data:FormData)=> {
    const res = await this.datasource.UpdateInstalacionPhoto(data)
    if (!res.ok) {
      throw new Error('Failed to fetch data')
    }
    return res.json()
  }
  
DeleteInstalacion= async(data:DeleteInstalacionRequest)=> {
    const res = await this.datasource.DeleteInstalacion(data)
    if (!res.ok) {
      throw new Error('Failed to fetch data')
    }
    return res.json()
  }
  
  
CreateInstalacion= async(data:FormData)=> {
    const res = await this.datasource.CreateInstalacion(data)
    if (!res.ok) {
      throw new Error('Failed to fetch data')
    }
    return res.json()
  }
  
GetInstalaciones= async(uuid:string)=>{
      const res = await this.datasource.GetInstalaciones(uuid)
      if (!res.ok) {
          // This will activate the closest `error.js` Error Boundary
          throw new Error('Failed to fetch data')
        }
       
        return res.json()
  }
  
GetInstalacion= async(uuid:string)=>{
      const res = await this.datasource.GetInstalacion(uuid)
      if (!res.ok) {
          // This will activate the closest `error.js` Error Boundary
          throw new Error('Failed to fetch data')
        }
       
        return res.json()
  }
  
  
GetInstalacionById= async(id:number)=>{
    const res = await this.datasource.GetInstalacionById(id)
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
      }
     
      return res.json()
  }
  
  
  
GetInstalacionDayHorario= async(instalacionId:number,dayWeek:number)=>{
    const res = await this.datasource.GetInstalacionDayHorario(instalacionId,dayWeek)
      if (!res.ok) {
          // This will activate the closest `error.js` Error Boundary
          throw new Error('Failed to fetch data')
        }
        return res.json()
  }
  
EditInstalacionesHorario= async(d:EditInstalacionesPreciosRequest)=>{
    const res = await this.datasource.EditInstalacionesHorario(d)
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
      }
     
      return res.json()
  }
  
CopyInstalacionHorario= async(d:string)=>{
    const res = await this.datasource.CopyInstalacionHorario(d)
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
      }
     
      return res.json()
  }
  
ResetInstalacionHorarioDay= async(d:string)=>{
    const res = await this.datasource.ResetInstalacionHorarioDay(d)
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
      }
     
      return res.json()
  }
  
  
GetCupoReservaInstalciones= async(d:CupoReservaRequest)=>{
    const res = await this.datasource.GetCupoReservaInstalciones(d)
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
      }
     
      return res.json()
  }
  
  
CreateUpdateCupos= async(data:CreateUpdateCuposRequest)=> {
    const res = await this.datasource.CreateUpdateCupos(data)
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
    return res.json()
  }
  
  
DeleteCupos= async(ids:(number | undefined)[])=> {
    const res = await this.datasource.DeleteCupos(ids)
  
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
    return res.json()
  }
}

export default InstalacionRepository;