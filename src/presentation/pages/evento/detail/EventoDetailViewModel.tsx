import { useAppDispatch, useAppSelector } from "@/context/reduxHooks";
import { uiActions } from "@/context/slices/uiSlice";
import { Order, OrderQueueReserva } from "@/data/model/types/enums";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { dataActions } from "@/context/slices/dataSlice";
import { getEstablecimientoReservas } from "@/core/repository/reservas";
import { fetchInstalaciones } from "@/context/actions/data-actions";
import RefreshIcon from "@mui/icons-material/Refresh";
import { eventoRepository, reservaRepository } from "@/data/repository";

export enum TabEvento {
  INFO,
  RESERVAS,
  CALENDARIO,
}
export const EventoDetailViewModel = ({
  params,
  searchParams,
}: {
  params: {
    uuid: string;
    uuidEvento: string;
  };
  searchParams: ReadonlyURLSearchParams;
}) => {
  const [currentTab, setCurrentTab] = useState(TabEvento.INFO);
  const eventoId = searchParams.get("id");
  const page = searchParams.get("page");
  const dispatch = useAppDispatch();
  const current = new URLSearchParams(Array.from(searchParams.entries()));
  const reservas = useAppSelector((state) => state.data.reservas);
  const [reservaDetail, setReservaDetail] = useState<ReservaDetail | null>(
    null
  );
  const [filterData, setFilterData] = useState<ReservaDataFilter>({
    uuid: params.uuid,
    query: "",
    order: Order.DESC,
    order_queue: OrderQueueReserva.CREATED,
    instalacion_id: "",
  });
  const [paginationProps, setPaginationProps] = useState<PaginationProps>({
    pageSize: 0,
    count: 0,
    nextPage: 0,
    currentPage: 1,
  });
  // const [reservasCount,setReservasCount] = useState<number | undefined>(undefined)
  const [loading, setLoading] = useState(false);
  const [openReservaDetailDialog, setOpenReservaDetailDialog] = useState(false);
  const [order, setOrder] = useState<ReservaOrder>({
    order: Order.DESC,
    queue: OrderQueueReserva.CREATED,
  });
  const [loadingEvent, setLoadingEvent] = useState(false);
  const [eventoDetail, setEventoDetail] = useState<EventoDetail | null>(null);
  const instalaciones = useAppSelector((state) => state.data.instalaciones);
  const [selectedInstalacion, setSelectedInstalacion] = useState("0");
  const [openRequestReporteDialog, setOpenRequestReporteDialog] =
    useState(false);
  const [openEditAmountEventoDialog,setOpenEditAmountEventoDialog] = useState(false)

  const updateEvento = (e:Evento)=>{
    if(eventoDetail == null) return
    setEventoDetail({
        ...eventoDetail,
        evento:e
    })
    switch (currentTab) {
        case TabEvento.RESERVAS:
            getReservas(filterData, paginationProps.currentPage);
    }
  }
  
  const openExportReservasDialog = () => {
    if (instalaciones.length == 0) {
      //     getInstalaciones()
    }
    setOpenRequestReporteDialog(true);
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

  const getEventoDetail = async () => {
    try {
    //   if (eventoDetail != null) return
      setLoadingEvent(true);
      const res: EventoDetail = await eventoRepository.GetEventoDetail(
        params.uuidEvento,
        Number(eventoId)
      );
      console.log(res);
      setEventoDetail(res);
      setLoadingEvent(false);
    } catch (err) {
      setLoadingEvent(false);
    }
  };

  const getReservas = async (data: ReservaDataFilter, page: number) => {
    try {
      dispatch(dataActions.setReservas([]));
      setFilterData(data);
      setLoading(true);
      let eventId = null;
      if (eventoId != undefined) {
        eventId = Number(eventoId);
      }
      const res: ReservaPaginationResponse = await getEstablecimientoReservas(
        { ...data, evento_id: eventId },
        page
      );
      setPaginationProps({
        pageSize: res.page_size,
        count: res.count > 0 ? res.count : 0,
        nextPage: res.next_page,
        currentPage: page,
      });
      dispatch(dataActions.setReservas(res.results));
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };
  const applyChange = (data: ReservaDataFilter) => {
    setFilterData(data);
    getReservas(data, paginationProps.currentPage);
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
    applyChange(data);
  };

  const changePage = (page: number) => {
    getReservas(filterData, page);
  };

  const updateReserva = (e?: Reserva) => {
    if (e == undefined) return;
    dispatch(dataActions.updateReservas(e));
  };

  useEffect(() => {
    if (reservaDetail != null) {
      setOpenReservaDetailDialog(true);
    }
  }, [reservaDetail]);

  useEffect(() => {
    getEventoDetail();
    switch (currentTab) {
      case TabEvento.RESERVAS:
        setReservaDetail(null);
        dispatch(fetchInstalaciones(params.uuid));       
        getReservas(filterData, paginationProps.currentPage);
    }
  }, [currentTab]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return {
    state: {
      paginationProps,
      reservas,
      openRequestReporteDialog,
      openReservaDetailDialog,
      loading,
      loadingEvent,
      selectedInstalacion,
      currentTab,
      eventoDetail,
      instalaciones,
      filterData,
      reservaDetail,
      order,
      openEditAmountEventoDialog,
    },
    openExportReservasDialog,
    handleChange,
    getReservaDetail,
    getReservas,
    setEventoDetail,
    setOpenRequestReporteDialog,
    setOpenReservaDetailDialog,
    updateReserva,
    setSelectedInstalacion,
    changeOrder,
    changePage,
    setOpenEditAmountEventoDialog,
    updateEvento,
    editEventoAmount:eventoRepository.EditEventoAmount,
  };
};
