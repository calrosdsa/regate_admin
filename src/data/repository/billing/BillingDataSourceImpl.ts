import { LOCAL_URL } from "@/context/config";

class BillingDataSourceImpl implements BillingDataSource {
  GetBanks() {
    const res = fetch(`${LOCAL_URL}/api/admin/billing/banks`);
    return res;
  }

  GetBankAccounts() {
    const res = fetch(`${LOCAL_URL}/api/admin/billing/bank-account`);

    return res;
  }

  GetBankAccountEstablecimiento(uuid: string) {
    const res = fetch(
      `${LOCAL_URL}/api/admin/billing/bank-account/establecimiento?uuid=${uuid}`
    );

    return res;
  }

  GetDepositosEmpresa(page: number) {
    const res = fetch(
      `${LOCAL_URL}/api/admin/billing/depositos-empresa?page=${page}`
    );

    return res;
  }

  GetDepositosFromDepositoEmpresa(id: number) {
    const res = fetch(
      `${LOCAL_URL}/api/admin/billing/depositos-empresa/depositos?id=${id}`
    );

    return res;
  }

  GetDepositos(page: number, uuid: string) {
    const res = fetch(
      `${LOCAL_URL}/api/admin/billing/depositos?page=${page}&uuid=${uuid}`
    );

    return res;
  }
  GetDeposito(uuid: string) {
    const res = fetch(`${LOCAL_URL}/api/admin/billing/deposito?uuid=${uuid}`);

    return res;
  }

  GetReservasPagadas(data: ReservaDataFilter, page: number) {
    const res = fetch(
      `${LOCAL_URL}/api/admin/billing/reservas-pagadas?page=${page}`,
      {
        method: "post",
        body: JSON.stringify(data),
      }
    );

    return res;
  }

  UpdateBankAccount(data: AccountBank) {
    const res = fetch(
      `${LOCAL_URL}/api/admin/billing/bank-account?id=${data.id}`,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );

    return res;
  }

  CreateBankAccount(data: AccountBank) {
    const res = fetch(
      `${LOCAL_URL}/../api/admin/billing/bank-account/create/`,
      {
        method: "post",
        body: JSON.stringify(data),
      }
    );

    return res;
  }

  AssignBankAccount(data: AssignBankAccountRequest) {
    const res = fetch(
      `${LOCAL_URL}/../api/admin/billing/bank-account/assign/`,
      {
        method: "post",
        body: JSON.stringify(data),
      }
    );

    return res;
  }

//   getDepositoEstadoName = (estado: DepositoEstado): string => {
//     switch (estado) {
//       case DepositoEstado.EMITIDO:
//         return "Emitido";
//       case DepositoEstado.PENDIENTE:
//         return "Pendiente";
//     }
//   };
}
export default BillingDataSourceImpl;
