import { LOCAL_URL } from "@/context/config";

export class EventoDataSource {
  CreateEvento(data: CreateEventoRequest) {
    const res = fetch(`${LOCAL_URL}/api/establecimiento/eventos/create`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res;
  }

  EditEvento(data: EditEventoRequest) {
    const res = fetch(`${LOCAL_URL}/api/establecimiento/eventos/edit`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res;
  }

  EditEventoAmount(data: EditEventoAmountRequest) {
    const res = fetch(`${LOCAL_URL}/api/establecimiento/eventos/edit/amount`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res;
  }

  GetEventoDetail(eventoUuid: string, eventoId: number) {
    const res = fetch(
      `${LOCAL_URL}/api/establecimiento/eventos/detail?uuid=${eventoUuid}&id=${eventoId}`
    );
    return res;
  }

  GetEventos(uuid: string, page: number) {
    const res = fetch(
      `${LOCAL_URL}/api/establecimiento/eventos?uuid=${uuid}&page=${page}`
    );

    return res;
  }

  DeleteEvento(eventoId: number) {
    const res = fetch(
      `${LOCAL_URL}/api/establecimiento/eventos/delete?eventoId=${eventoId}`
    );
    return res;
  }
}
