interface EstablecimientoDataSource {
    GetEstablecimientos(): Promise<Response>;
  
    GetEstablecimiento(uuid: string): Promise<Response>;
  
    GetPlaces(lng: string, lat: string): Promise<Response>;
  
    CreateEstablecimiento(data: FormData): Promise<Response>;
  
    UpdateEstablecimiento(data: string, id: number): Promise<Response>;
  
    UpdateEstablecimientoPhoto(data: FormData): Promise<Response>;
  
    AddEstablecimientoPhoto(data: FormData): Promise<Response>;
  
    DeleteEstablecimientoPhoto(data: Photo): Promise<Response>;
  
    UpdateEstablecimientoAddress(data: string): Promise<Response>;
  }
  