import { LOCAL_URL } from "@/context/config";

class InstalacionDataSourceImpl implements InstalacionDataSource {
  UpdateInstalacion(
    data: string,
    id: number,
    uuid: string,
    instalacionUuid: string
  ) {
    const res = fetch(
      `${LOCAL_URL}/api/establecimiento/instalacion?instalacion_id=${id}&uuid=${uuid}&instalacionUuid=${instalacionUuid}`,
      {
        method: "PUT",
        body: data,
      }
    );
    return res;
  }

  UpdateInstalacionPhoto(data: FormData) {
    const res = fetch(`${LOCAL_URL}/api/establecimiento/instalacion/photo`, {
      method: "PUT",
      body: data,
    });
    return res;
  }

  DeleteInstalacion(data: DeleteInstalacionRequest) {
    const res = fetch(`${LOCAL_URL}/api/establecimiento/instalacion/delete`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res;
  }

  CreateInstalacion(data: FormData) {
    const res = fetch(`${LOCAL_URL}/api/establecimiento/instalacion`, {
      method: "POST",
      body: data,
    });
    return res;
  }

  GetInstalaciones(uuid: string) {
    const res = fetch(
      `${LOCAL_URL}/api/establecimiento/instalacion/list?uuid=${uuid}`
    );

    return res;
  }

  GetInstalacion(uuid: string) {
    const res = fetch(
      `${LOCAL_URL}/api/establecimiento/instalacion?uuid=${uuid}`
    );

    return res;
  }

  GetInstalacionById(id: number) {
    const res = fetch(`${LOCAL_URL}/api/establecimiento/instalacion/${id}`);

    return res;
  }

  GetInstalacionDayHorario(instalacionId: number, dayWeek: number) {
    const res = fetch(
      `${LOCAL_URL}/api/establecimiento/instalacion/horario?instalacionId=${instalacionId}&dayWeek=${dayWeek}`
    );
    return res;
  }

  EditInstalacionesHorario(d: EditInstalacionesPreciosRequest) {
    const res = fetch(`${LOCAL_URL}/api/establecimiento/instalacion/horario`, {
      method: "POST",
      body: JSON.stringify(d),
    });

    return res;
  }

  CopyInstalacionHorario(d: string) {
    const res = fetch(
      `${LOCAL_URL}/api/establecimiento/instalacion/horario/copy`,
      {
        method: "POST",
        body: d,
      }
    );

    return res;
  }

  ResetInstalacionHorarioDay(d: string) {
    const res = fetch(
      `${LOCAL_URL}/api/establecimiento/instalacion/horario/reset`,
      {
        method: "POST",
        body: d,
      }
    );

    return res;
  }

  GetCupoReservaInstalciones(d: CupoReservaRequest) {
    const res = fetch(
      `${LOCAL_URL}/api/establecimiento/instalacion/reserva-cupo`,
      {
        cache: "no-store",
        method: "POST",
        body: JSON.stringify(d),
      }
    );

    return res;
  }

  CreateUpdateCupos(data: CreateUpdateCuposRequest) {
    const res = fetch(`${LOCAL_URL}/api/cupo/create-update`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res;
  }

  DeleteCupos(ids: (number | undefined)[]) {
    const res = fetch(`${LOCAL_URL}/api/cupo/delete`, {
      method: "POST",
      body: JSON.stringify(ids),
    });
    return res;
  }
}

export default InstalacionDataSourceImpl