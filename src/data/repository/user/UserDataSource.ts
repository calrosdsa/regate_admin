import { LOCAL_URL } from "@/context/config";

export class UserDataSource {
  GetUserEmpresaDetail(id: number, uuid: string) {
    const res = fetch(
      `${LOCAL_URL}/api/users/empresa/detail?id=${id}&uuid=${uuid}`
    );
    return res;
  }

  SearchUsersEmpresa(query: string) {
    const res = fetch(`${LOCAL_URL}/api/users/empresa/search?query=${query}`);
    return res;
  }

  IsUserNameRepeat(name: string) {
    const res = fetch(
      `${LOCAL_URL}/api/users/empresa/name-repeat?name=${name}`
    );
    return res;
  }

  GetUsersEmpresaPagination(d: RequestUserEmpresaFilter, page: number) {
    const res = fetch(`${LOCAL_URL}/api/users/empresa?page=${page}`, {
      method: "POST",
      body: JSON.stringify(d),
    });
    return res;
  }

  UpdateUserEmpresa(d: UserEmpresa) {
    const res = fetch(`${LOCAL_URL}/api/users/empresa/update`, {
      method: "POST",
      body: JSON.stringify(d),
    });
    return res;
  }

  GetUserLocalReservas(uuid: string, id: string) {
    const res = fetch(
      `${LOCAL_URL}/api/users/empresa/reservas/?uuid=${uuid}&id=${id}`
    );
    return res;
  }

  GetUserEventos(body:UserEventosRequest,page:number){
    const res = fetch(`${LOCAL_URL}/api/users/eventos?page=${page}`, {
        method: "POST",
        body: JSON.stringify(body),
      });
      return res
  }

}
