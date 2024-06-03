"use client";

import EventoDetail from "@/presentation/pages/evento/EventoDetail";
import Calendar from "@/presentation/pages/evento/calendar/Calendar";
import ReservaList from "@/presentation/reservas/ReservaList";
import DialogReservaDetail from "@/presentation/reservas/dialog/DialogReservaDetail";
import RequestReporteReservaDialog from "@/presentation/reservas/dialog/RequestReporteReservaDialog";
import SelectComponent from "@/presentation/util/input/SelectCompenent";
import Loader from "@/presentation/util/loaders/Loader";
import Pagination from "@/presentation/shared/pagination/Pagination";
import { hours } from "@/context/actions/chart-actions";
import { useAppDispatch, useAppSelector } from "@/context/reduxHooks";
import { dataActions } from "@/context/slices/dataSlice";
import { uiActions } from "@/context/slices/uiSlice";
import { GetEventoDetail } from "@/core/repository/evento";
import { GetInstalaciones } from "@/core/repository/instalacion";
import {
  GetReservaDetail,
  getEstablecimientoReservas,
} from "@/core/repository/reservas";
import { Order, OrderQueueReserva, ReservaType } from "@/core/type/enums";
import { getRouteEstablecimiento } from "@/core/util/routes";
import { Button, Tab, Tabs, Typography } from "@mui/material";
import moment from "moment";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import { fetchInstalaciones } from "@/context/actions/data-actions";
import DownloadIcon from "@mui/icons-material/Download";
enum TabEvento {
  INFO,
  RESERVAS,
  CALENDARIO,
}
const Page = ({ params }: { params: { uuidEvento: string; uuid: string } }) => {
  const searchParams = useSearchParams();
  const [currentTab, setCurrentTab] = useState(TabEvento.INFO);
  const name = searchParams.get("name");
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
  const [paginationProps, setPaginationProps] = useState<
    PaginationProps | undefined
  >(undefined);
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

  const appendSerachParams = (key: string, value: string) => {
    current.set(key, value);
    const search = current.toString();
    const url = window.location.pathname + "?" + search;
    history.pushState(null, "", url);
  };
  const openExportReservasDialog = () => {
    if (instalaciones.length == 0) {
      //     getInstalaciones()
    }
    setOpenRequestReporteDialog(true);
  };

  const getReservaDetail = async (id: number) => {
    try {
      dispatch(uiActions.setLoaderDialog(true));
      const res = await GetReservaDetail(id);
      setReservaDetail(res);
      dispatch(uiActions.setLoaderDialog(false));
    } catch (err) {
      dispatch(uiActions.setLoaderDialog(false));
    }
  };

  const getEventoDetail = async () => {
    try {
      if (eventoDetail != null) return;
      setLoadingEvent(true);
      const res: EventoDetail = await GetEventoDetail(
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
    if (page != null) {
      getReservas(data, Number(page));
    } else {
      getReservas(data, 1);
    }
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
        if (page != null) {
          getReservas(filterData, Number(page));
        } else {
          getReservas(filterData, 1);
        }
    }
  }, [currentTab]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <>
      <div className="p-2 overflow-auto ">
        <div className="flex space-x-1">
          <Link
            href={getRouteEstablecimiento(params.uuid, "eventos")}
            className="cursor-pointer underline"
          >
            <Typography variant="body2">Eventos</Typography>
          </Link>
          <span> {" > "} </span>
          <Typography data-testid="evento-name" variant="body2">
            {name}
          </Typography>
        </div>
        <div className="pt-10 xl:pt-2">
          <div className="flex  space-x-1 items-center">
            <Typography variant="h6">{name}</Typography>
            <Typography className="text-sm">
              {" "}
              #{params.uuidEvento.slice(0, 7)}
            </Typography>
          </div>

          <Tabs
            value={currentTab}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example"
          >
            <Tab label="Info" onClick={() => console.log("")} />
            <Tab
              label="Reservas"
              data-testid="reservas-tab"
              onClick={() => console.log("")}
            />
            <Tab label="Calendario" />
          </Tabs>
          {currentTab == TabEvento.INFO && (
            <>
              {loadingEvent ? (
                <Loader className="w-full flex justify-center pt-10" />
              ) : (
                eventoDetail != null && (
                  <EventoDetail
                    eventoDetail={eventoDetail}
                    uuid={params.uuid}
                    updateEventoDetail={(e) => setEventoDetail(e)}
                  />
                )
              )}
            </>
          )}

          {currentTab == TabEvento.RESERVAS && (
            <>
              {openRequestReporteDialog && (
                <RequestReporteReservaDialog
                  open={openRequestReporteDialog}
                  close={() => setOpenRequestReporteDialog(false)}
                  uuid={params.uuid}
                  instalacionOptions={instalaciones}
                />
              )}
              <div className="p-2 overflow-auto h-screen">
                <div className="pt-10 xl:pt-2">
                  <Typography className="text-xl">
                    Reservas({paginationProps?.count})
                  </Typography>

                  <div className="flex space-x-3 py-2">
                    <Button
                      variant="outlined"
                      disabled={loading}
                      onClick={() => {
                        getReservas(filterData, 1);
                      }}
                    >
                      <RefreshIcon />
                    </Button>

                    {/* <Button variant="outlined" disabled={loading}  onClick={()=>{
                      openExportReservasDialog()
                        }}>
                            <DownloadIcon/>
                    </Button> */}

                    <SelectComponent
                      value={selectedInstalacion}
                      items={instalaciones
                        .map((t) => {
                          return {
                            value: t.id.toString(),
                            name: t.name,
                          };
                        })
                        .concat({ name: "Todas las canchas", value: "0" })}
                      onChange={(e) => {
                        console.log(e.target.value);
                        const filterD: ReservaDataFilter = {
                          ...filterData,
                          instalacion_id: e.target.value,
                        };
                        setSelectedInstalacion(e.target.value);
                        getReservas(filterD, 1);
                      }}
                      name={"Instalaciones"}
                      containerClassName="h-9"
                    />

                    {/* <button className="button-inv flex space-x-1" disabled={loading}  onClick={()=>setCreateReservaDialog(true)}>
                            <span>Crear Reserva</span>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path d="M10.75 6.75a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" />
                            </svg>
                    </button>
         */}
                  </div>
                  <div className="pt-2 pb-4 sm:flex md:justify-between md:items-center grid gap-2 relative">
                    {paginationProps != undefined && (
                      <Pagination
                        currentPage={paginationProps.currentPage}
                        setPage={(page) => {
                          // console.log(Math.ceil(paginationProps.count/paginationProps.pageSize))
                          appendSerachParams("page", page.toString());
                          getReservas(filterData, page);
                          setPaginationProps({
                            ...paginationProps,
                            currentPage: page,
                          });
                        }}
                        totalCount={paginationProps.count || 0}
                        pageSize={paginationProps.pageSize}
                      />
                    )}
                  </div>
                </div>

                <div className=" overflow-auto">
                  <ReservaList
                    reservas={reservas}
                    loading={loading}
                    order={order}
                    getReservaDetail={(id) => getReservaDetail(id)}
                    changeOrder={(order) => {
                      if (order.order == Order.DESC) {
                        setOrder({
                          ...order,
                          order: Order.ASC,
                        });
                        const data = {
                          ...filterData,
                          order: Order.ASC,
                          order_queue: order.queue,
                        };
                        applyChange(data);
                      } else {
                        setOrder({
                          ...order,
                          order: Order.DESC,
                        });
                        const data = {
                          ...filterData,
                          order: Order.DESC,
                          order_queue: order.queue,
                        };
                        applyChange(data);
                      }
                    }}
                  />
                </div>
                {/* {JSON.stringify(reservas)} */}
              </div>

              {openReservaDetailDialog && reservaDetail != null && (
                <DialogReservaDetail
                  open={openReservaDetailDialog}
                  close={() => setOpenReservaDetailDialog(false)}
                  data={reservaDetail}
                  uuid={params.uuid}
                  update={(reserva?: Reserva) => {
                    if (reserva == undefined) return;
                    dispatch(dataActions.updateReservas(reserva));
                  }}
                  getReservas={() => getReservas(filterData, Number(page))}
                />
              )}
            </>
          )}

          {currentTab == TabEvento.CALENDARIO && eventoDetail != null && (
            <Calendar
              uuid={params.uuid}
              uuidEvent={params.uuidEvento}
              eventoName={name || "Este evento"}
              reserva_type={ReservaType.Evento}
              eventoId={Number(eventoId || 0)}
              usersEvento={eventoDetail.users}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Page;
