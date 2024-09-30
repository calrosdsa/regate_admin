import { useAppDispatch } from "@/context/reduxHooks";
import { uiActions } from "@/context/slices/uiSlice";
import { Order, OrderQueueReserva } from "@/data/model/types/enums";
import useEffectOnce from "@/core/util/hooks/useEffectOnce";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { reservaRepository, userRepository } from "@/data/repository";

const UserDetailViewModel = ({
  params,
}: {
  params: { uuid: string; uuidUser: string };
}) => {
  const reservaTab = "1";
  const eventoTab = "2";

  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const id = searchParams.get("id");
  const phone = searchParams.get("phone");
  const [userEmpresa, setUserEmpresa] = useState<UserEmpresa>({
    id: Number(id),
    name: name || "",
    phone_number: phone || "",
    uuid: params.uuidUser,
  });
  const [openEditUserDialog, setOpenUserDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [reservaDetail, setReservaDetail] = useState<ReservaDetail | null>(
    null
  );
  const [openReservaDetailDialog, setOpenReservaDetailDialog] = useState(false);
  const [filterData, setFilterData] = useState<ReservaDataFilter>({
    order: Order.DESC,
    order_queue: OrderQueueReserva.RESERVA_CREATED,
    uuid: params.uuid,
    user_id: userEmpresa.id,
  });
  const [order, setOrder] = useState<ReservaOrder>({
    order: Order.DESC,
    queue: OrderQueueReserva.RESERVA_CREATED,
  });
  const [paginationProps, setPaginationProps] = useState<PaginationProps>({
    pageSize: 0,
    count: 0,
    nextPage: 0,
    currentPage: 1,
  });

  const [paginationProps2, setPaginationProps2] = useState<PaginationProps>({
    pageSize: 0,
    count: 0,
    nextPage: 0,
    currentPage: 1,
  });
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [tab, setTab] = useState("1");

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };

  const getUserEmpresaDetail = async () => {
    try {
      const res: UserEmpresa = await userRepository.GetUserEmpresaDetail(
        Number(id),
        params.uuidUser
      );
      setUserEmpresa(res);
    } catch (err) {}
  };

  const getReservaDetail = async (id: number) => {
    try {
      dispatch(uiActions.setLoaderDialog(true));
      const res = await reservaRepository.GetReservaDetail(id);
      setReservaDetail(res);
      dispatch(uiActions.setLoaderDialog(false));
    } catch (err) {
      dispatch(uiActions.setLoaderDialog(false));
    }
  };

  const getUserReservas = async (page: number) => {
    try {
      setReservas([]);
      setLoading(true);
      const res = await reservaRepository.GetEstablecimientoReservas(
        filterData,
        page
      );
      setPaginationProps({
        ...paginationProps,
        pageSize: res.page_size,
        count: res.count > 0 ? res.count : 0,
        nextPage: res.next_page,
        currentPage: page,
      });
      setReservas(res.results);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const getUserEventos = async (page: number) => {
    try {
      setEventos([]);
      setLoading(true);
      const body: UserEventosRequest = {
        user_id: userEmpresa.id,
      };
      const res = await userRepository.GetUserEventos(body, page);
      setPaginationProps2({
        ...paginationProps2,
        pageSize: res.page_size,
        count: res.count > 0 ? res.count : 0,
        nextPage: res.next_page,
        currentPage: page,
      });
      setEventos(res.results);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const changeOrder = (reservaOrder: ReservaOrder) => {
    let data: ReservaDataFilter;
    if (reservaOrder.order == Order.DESC) {
      setOrder({
        ...order,
        order: Order.ASC,
      });
      data = {
        ...filterData,
        order: Order.ASC,
        order_queue: reservaOrder.queue,
      };
    } else {
      setOrder({
        ...order,
        order: Order.DESC,
      });
      data = {
        ...filterData,
        order: Order.DESC,
        order_queue: reservaOrder.queue,
      };
    }
    setFilterData(data);
  };

  const changePage = (page: number) => {
    switch (tab) {
      case reservaTab:
        getUserReservas(page);
      case eventoTab:
        getUserEventos(page);
    }
  };
  const refresh = () => {
    switch (tab) {
      case reservaTab:
        getUserReservas(1);
      case eventoTab:
        getUserEventos(1);
    }
  };

  useEffect(() => {
    if (reservaDetail != null) {
      setOpenReservaDetailDialog(true);
    }
  }, [reservaDetail]);

  useEffectOnce(() => {
    getUserEmpresaDetail();
  });
  useEffect(() => {
    getUserReservas(paginationProps.currentPage);
  }, [filterData]);
  useEffect(() => {
    switch (tab) {
      case eventoTab:
        if (eventos.length == 0) {
          getUserEventos(paginationProps2.currentPage);
        }
    }
  }, [tab]);
  return {
    state: {
      reservas,
      userEmpresa,
      openEditUserDialog,
      openReservaDetailDialog,
      loading,
      reservaDetail,
      filterData,
      order,
      paginationProps,
      paginationProps2,
      tab,
      eventos,
    },
    setOpenReservaDetailDialog,
    setOpenUserDialog,
    setUserEmpresa,
    getReservaDetail,
    setReservas,
    getUserReservas,
    changeOrder,
    changePage,
    handleTabChange,
    refresh,
  };
};

export default UserDetailViewModel;
