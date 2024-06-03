import InstalacionesDialog from "@/presentation/establecimiento/instalacion/dialog/InstalacionesDialog";
import { EventoViewModel } from "./EventosViewModel";
import CreateEventDialog from "./dialog/CreateEventDialog";
import CreateReservaDialog from "@/presentation/reservas/dialog/CreateReservaDialog";
import EditAmountEventoDialog from "./dialog/EditAmountEventoDialog";
import { Button, Typography } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import Pagination from "@/presentation/shared/pagination/Pagination";
import EventoListTable from "./EventoListTable";

const Eventos = ({ params }: { params: { uuid: string } }) => {
  const vm = EventoViewModel({ params });
  const state = vm.state;
  return (
    <>
      {state.openInstalacionesDialog && (
        <InstalacionesDialog
          instalaciones={state.instalaciones}
          openModal={state.openInstalacionesDialog}
          closeModal={() => vm.setOpenInstalacionesDialog(false)}
          onAccept={(e) => {
            vm.setInstacion(e);
            vm.setOpenReservaDialog(true);
          }}
        />
      )}
      
      {state.createEventoDialog && (
        <CreateEventDialog
          addEvento={(e) => vm.setEventos([e, ...state.eventos])}
          open={state.createEventoDialog}
          close={() => vm.setCreateEventoDialog(false)}
          establecimientoUuid={params.uuid}
          onCreateEvento={(e) => {
            vm.setEventoCreated(e);
            vm.getInstalaciones();
          }}
        />
      )}

      {state.openReservaDialog &&
        state.eventoCreated != null &&
        state.instalacion != null && (
          <CreateReservaDialog
            uuid={params.uuid}
            open={state.openReservaDialog}
            close={() => vm.setOpenReservaDialog(false)}
            cupos={[]}
            onComplete={() => {
              vm.getUsersEmpresa(1);
              vm.setOpenInstalacionesDialog(false);
            }}
            usersEvento={
              state.eventoCreated.user_evento != undefined
                ? [state.eventoCreated.user_evento]
                : []
            }
            cancha={state.instalacion}
            useAdvanceOptions={true}
            eventoId={state.eventoCreated.id}
          />
        )}

      {state.selectedEvento != null && (
        <EditAmountEventoDialog
          open={state.selectedEvento != null}
          close={() => vm.setSelectedEvento(null)}
          evento={state.selectedEvento}
          update={(e) => {vm.updateEventoInTable(e)}}
          uuid={params.uuid}
          editEventoAmount={vm.editEventoAmount}
        />
      )}

      <div className="p-2 overflow-auto h-screen">
        <div>
          <Typography variant="body2">Eventos</Typography>
        </div>

        <div className="pt-10 xl:pt-2">
          <span className="text-xl">
            Eventos({state.paginationProps?.count})
          </span>

          <div className="flex space-x-3 py-2">
            <Button
              variant="outlined"
              disabled={state.loading}
              onClick={() => {
                vm.setQuery("");
                vm.getUsersEmpresa(1);
              }}
            >
              <RefreshIcon />
            </Button>

            <Button
              data-testid="crear-evento"
              variant="outlined"
              onClick={() => vm.setCreateEventoDialog(true)}
              endIcon={<AddIcon />}
            >
              <span>Crear evento</span>
            </Button>

          </div>
          <div className="pt-2 pb-4 sm:flex md:justify-between md:items-center grid gap-2 relative">
            <div className="flex space-x-2 items-center">
             
            </div>
            {state.paginationProps != null && (
              <Pagination
                currentPage={state.paginationProps.currentPage}
                setPage={(page) => {
                  vm.appendSerachParams("page", page.toString());
                  vm.getUsersEmpresa(page);
                  if(state.paginationProps == null) return
                  vm.setPaginationProps({
                    ...state.paginationProps,
                    currentPage: page,
                  });
                }}
                totalCount={state.paginationProps.count || 0}
                pageSize={state.paginationProps.pageSize}
              />
            )}
          </div>
          {state.query != "" && (
            <span className="italic text-sm  text-gray-600">
              Pulse intro para filtrar por prefijo:{state.query}
            </span>
          )}
        </div>

        <div className=" overflow-auto">
          <EventoListTable
            eventos={state.eventos}
            loading={state.loading}
            uuid={params.uuid}
            openEditAmountDialog={(e) => vm.setSelectedEvento(e)}
          />
        </div>
      </div>
    </>
  );
};
export default Eventos;
