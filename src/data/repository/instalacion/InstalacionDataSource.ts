
interface InstalacionDataSource {
    UpdateInstalacion(data: string, id: number, uuid: string, instalacionUuid: string): Promise<Response>;

    UpdateInstalacionPhoto(data: FormData): Promise<Response>;
  
    DeleteInstalacion(data: DeleteInstalacionRequest): Promise<Response>;
  
    CreateInstalacion(data: FormData): Promise<Response>;
  
    GetInstalaciones(uuid: string): Promise<Response>;
  
    GetInstalacion(uuid: string): Promise<Response>;
  
    GetInstalacionById(id: number): Promise<Response>;
  
    GetInstalacionDayHorario(instalacionId: number, dayWeek: number): Promise<Response>;
  
    EditInstalacionesHorario(d: EditInstalacionesPreciosRequest): Promise<Response>;
  
    CopyInstalacionHorario(d: string): Promise<Response>;
  
    ResetInstalacionHorarioDay(d: string): Promise<Response>;
  
    GetCupoReservaInstalciones(d: CupoReservaRequest): Promise<Response>;
  
    CreateUpdateCupos(data: CreateUpdateCuposRequest): Promise<Response>;
  
    DeleteCupos(ids: (number | undefined)[]): Promise<Response>;
}