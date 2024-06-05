import { useSearchParams } from "next/navigation";
import { EventoDetailViewModel, TabEvento } from "./EventoDetailViewModel";
import Link from "next/link";
import { getRouteEstablecimiento } from "@/core/util/routes";
import { Button, Tab, Tabs, Typography } from "@mui/material";
import Loader from "@/presentation/util/loaders/Loader";
import { ReservaType } from "@/data/model/types/enums";
import EditIcon from "@mui/icons-material/Edit";
import EventoInfoTab from "./components/tab/EventoInfoTab";
import EventoReservasTab from "./components/tab/EventoResevasTab";
import EventoCalendarioTab from "./components/tab/EventoCalendarioTab";
import EditAmountEventoDialog from "../eventos/components/dialog/EditAmountEventoDialog";
import DialogReservaDetail from "@/presentation/reservas/dialog/DialogReservaDetail";
const EventoDetail = ({
  params,
}: {
  params: {
    uuid: string;
    uuidEvento: string;
  };
}) => {
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const eventoId = searchParams.get("id");
  const vm = EventoDetailViewModel({ params, searchParams });
  const state = vm.state;

  return (
    <>
      {state.openEditAmountEventoDialog && state.eventoDetail != null && (
        <EditAmountEventoDialog
          open={state.openEditAmountEventoDialog}
          close={() => vm.setOpenEditAmountEventoDialog(false)}
          evento={state.eventoDetail.evento}
          update={vm.updateEvento}
          uuid={params.uuid}
          editEventoAmount={vm.editEventoAmount}
        />
      )}
      <div className="p-2 overflow-auto">
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
        <div className="grid gap-y-2">
          <div className="flex  space-x-1 items-center">
            <Typography variant="h6">{name}</Typography>
            <Typography className="text-sm">
              {" "}
              #{params.uuidEvento.slice(0, 7)}
            </Typography>
          </div>

          <div>
            <Button
              onClick={() => vm.setOpenEditAmountEventoDialog(true)}
              size={"small"}
              startIcon={<EditIcon />}
              variant="outlined"
            >
              Editar
            </Button>
          </div>

          <Tabs
            value={state.currentTab}
            onChange={vm.handleChange}
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
          {state.currentTab == TabEvento.INFO && (
            <>
              {state.loadingEvent ? (
                <Loader className="w-full flex justify-center pt-10" />
              ) : (
                state.eventoDetail != null && (
                  <EventoInfoTab
                    eventoDetail={state.eventoDetail}
                    uuid={params.uuid}
                    updateEventoDetail={(e) => vm.setEventoDetail(e)}
                  />
                )
              )}
            </>
          )}

          {state.currentTab == TabEvento.RESERVAS && (
            <EventoReservasTab
              openRequestReporteDialog={state.openRequestReporteDialog}
              uuid={params.uuid}
              setOpenRequestReporteDialog={(e: boolean) => {
                vm.setOpenRequestReporteDialog(e);
              }}
              instalaciones={state.instalaciones}
              paginationProps={state.paginationProps}
              loading={state.loading}
              filterData={state.filterData}
              setSelectedInstalacion={(e: string) =>
                vm.setSelectedInstalacion(e)
              }
              selectedInstalacion={state.selectedInstalacion}
              changePage={vm.changePage}
              reservas={state.reservas}
              order={state.order}
              changeOrder={vm.changeOrder}
              getReservas={vm.getReservas}
              getReservaDetail={vm.getReservaDetail}
            />
          )}

          {state.currentTab == TabEvento.CALENDARIO &&
            state.eventoDetail != null && (
              <EventoCalendarioTab
                uuid={params.uuid}
                uuidEvento={params.uuidEvento || ""}
                eventoName={name || ""}
                eventoId={Number(eventoId)}
                usersEvento={state.eventoDetail.users}
              />
            )}
        </div>
      </div>

      {state.openReservaDetailDialog && state.reservaDetail != null && (
        <DialogReservaDetail
          open={state.openReservaDetailDialog}
          close={() => vm.setOpenReservaDetailDialog(false)}
          data={state.reservaDetail}
          uuid={params.uuid}
          update={vm.updateReserva}
          getReservas={() =>
            vm.getReservas(state.filterData, state.paginationProps.currentPage)
          }
        />
      )}
    </>
  );
};

export default EventoDetail;
