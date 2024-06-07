class EstablecimentoRepository {
    datasource:EstablecimientoDataSource
    util:Util
    constructor(d:EstablecimientoDataSource,util:Util){
        this.datasource = d
        this.util = util
    }
    GetEstablecimientos = async() =>{
        const res = await this.datasource.GetEstablecimientos()
        if(res.status == 401) {
          this.util.redirectToLoginPage()
          throw new Error('Failed to fetch data')
        }
        if (!res.ok) {
          // This will activate the closest `error.js` Error Boundary
          throw new Error('Failed to fetch data')
        }
        return res.json()
      }
      
    GetEstablecimiento = async(uuid:string)=>{
          const res = await this.datasource.GetEstablecimiento(uuid)
          if (!res.ok) {
              // This will activate the closest `error.js` Error Boundary
              throw new Error('Failed to fetch data')
            }
            return res.json()
      }
      
      
    GetPlaces = async(lng:string,lat:string)=>{
          const res = await this.datasource.GetPlaces(lng,lat)
          if (!res.ok) {
              // This will activate the closest `error.js` Error Boundary
              throw new Error('Failed to fetch data')
            }
            return res.json()
      }
      
    CreateEstablecimiento = async(data:FormData) =>{
        const res = await this.datasource.CreateEstablecimiento(data)
        if(res.status == 401) {
          this.util.redirectToLoginPage()
        }
        if (!res.ok) {
          throw new Error('Failed to fetch data')
        }
        return res.json()
      }
      
    UpdateEstablecimiento = async(data:string,id:number) =>{
        const res = await this.datasource.UpdateEstablecimiento(data,id)
        if(res.status == 401) {
          this.util.redirectToLoginPage()
        }
        if (!res.ok) {
          // This will activate the closest `error.js` Error Boundary
          throw new Error('Failed to fetch data')
        }
        return res.json()
      }
      
    UpdateEstablecimientoPhoto = async(data:FormData) =>{
        const res = await this.datasource.UpdateEstablecimientoPhoto(data)
        if(res.status == 401) {
          this.util.redirectToLoginPage()
        }
        if (!res.ok) {
          throw new Error('Failed to fetch data')
        }
        return res.json()
      }
      
    AddEstablecimientoPhoto = async(data:FormData) =>{
        const res = await this.datasource.AddEstablecimientoPhoto(data)
        if(res.status == 401) {
          this.util.redirectToLoginPage()
        }
        if (!res.ok) {
          throw new Error('Failed to fetch data')
        }
        return res.json()
      }
      
    DeleteEstablecimientoPhoto = async(data:Photo) =>{
        const res = await this.datasource.DeleteEstablecimientoPhoto(data)
        if(res.status == 401) {
          this.util.redirectToLoginPage()
        }
        if (!res.ok) {
          throw new Error('Failed to fetch data')
        }
        return res.json()
      }
      
    UpdateEstablecimientoAddress = async(data:string) =>{
        const res = await this.datasource.UpdateEstablecimientoAddress(data)
        if(res.status == 401) {
          this.util.redirectToLoginPage()
        }
        if (!res.ok) {
          throw new Error('Failed to fetch data')
        }
        return res.json()
      }
      
      
}


export default EstablecimentoRepository;