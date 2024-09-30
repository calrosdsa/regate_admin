interface ManageDataSource {
    GetUsersEmpresa(): Promise<Response>;
  
    CreateUser(body: CreateUserRequest): Promise<Response>;
  
    AddEstablecimientoUser(d: EstablecimientoUser): Promise<Response>;
  
    DeleteEstablecimientoUser(establecimientoUuid: string, adminId: string): Promise<Response>;
  
    UpdateUserEstado(body: string): Promise<Response>;

}