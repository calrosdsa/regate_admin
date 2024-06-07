interface BillingDataSource {
    GetBanks(): Promise<Response>;

    GetBankAccounts(): Promise<Response>;
  
    GetBankAccountEstablecimiento(uuid: string): Promise<Response>;
  
    GetDepositosEmpresa(page: number): Promise<Response>;
  
    GetDepositosFromDepositoEmpresa(id: number): Promise<Response>;
  
    GetDepositos(page: number, uuid: string): Promise<Response>;
  
    GetDeposito(uuid: string): Promise<Response>;
  
    GetReservasPagadas(data: ReservaDataFilter, page: number): Promise<Response>;
  
    UpdateBankAccount(data: AccountBank): Promise<Response>;
  
    CreateBankAccount(data: AccountBank): Promise<Response>;
  
    AssignBankAccount(data: AssignBankAccountRequest): Promise<Response>;
}