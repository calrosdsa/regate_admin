import RequestReporteReservaDialog from "@/presentation/reservas/dialog/RequestReporteReservaDialog";
import { Button, Typography } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import SelectComponent from "@/presentation/util/input/SelectCompenent";
import DialogReservaDetail from "@/presentation/reservas/dialog/DialogReservaDetail";
import ReservaList from "@/presentation/reservas/ReservaList";
import Pagination from "@/presentation/shared/pagination/Pagination";


const EventoReservasTab= (props:{
    openRequestReporteDialog:boolean
    uuid:string
    setOpenRequestReporteDialog:(e:boolean)=>void
    instalaciones:Instalacion[]
    paginationProps:PaginationProps
    loading:boolean
    filterData:ReservaDataFilter
    setSelectedInstalacion:(e:string)=>void
    selectedInstalacion:string
    getReservas:(e:ReservaDataFilter,page:number)=>void
    changePage:(page:number)=>void
    reservas:Reserva[]
    // reservaDetail:ReservaDetail | null
    order:ReservaOrder
    getReservaDetail:(id:number)=>void
    changeOrder:(o:ReservaOrder)=>void
    // openReservaDetailDialog:boolean
    // setOpenReservaDetailDialog:(b:boolean)=>void
    // updateReserva:(r:Reserva | undefined)=>void
}) =>{

    return(
         <>
              {props.openRequestReporteDialog && (
                <RequestReporteReservaDialog
                  open={props.openRequestReporteDialog}
                  close={() => props.setOpenRequestReporteDialog(false)}
                  uuid={props.uuid}
                  instalacionOptions={props.instalaciones}    
                />
              )}
              <div className="p-2 overflow-auto h-screen">
                <div className="pt-10 xl:pt-2">
                  <Typography className="text-xl">
                    Reservas({props.paginationProps?.count})
                  </Typography>

                  <div className="flex space-x-3 py-2">
                    <Button
                     sx={{ height: 35 }}
                      variant="outlined"
                      disabled={props.loading}
                      onClick={() => {
                        props.getReservas(props.filterData, 1);
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
                      value={props.selectedInstalacion}
                      items={props.instalaciones
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
                          ...props.filterData,
                          instalacion_id: e.target.value,
                        };
                        props.setSelectedInstalacion(e.target.value);
                        props.getReservas(filterD, 1);
                      }}
                      name={"Instalaciones"}
                      containerClassName="h-9"
                    />

                  </div>
                  <div className="pt-2 pb-4 sm:flex md:justify-between md:items-center grid gap-2 relative">
                    {props.paginationProps != undefined && (
                      <Pagination
                        currentPage={props.paginationProps.currentPage}
                        setPage={props.changePage}
                        totalCount={props.paginationProps.count}
                        pageSize={props.paginationProps.pageSize}
                      />
                    )}
                  </div>
                </div>

                <div className=" overflow-auto">
                  <ReservaList
                    reservas={props.reservas}
                    loading={props.loading}
                    order={props.order}
                    getReservaDetail={(id) => props.getReservaDetail(id)}
                    changeOrder={props.changeOrder}
                  />
                </div>
                {/* {JSON.stringify(reservas)} */}
              </div>

                {/* {props.openReservaDetailDialog && props.reservaDetail != null && (
                    <DialogReservaDetail
                    open={props.openReservaDetailDialog}
                    close={() => props.setOpenReservaDetailDialog(false)}
                    data={props.reservaDetail}
                    uuid={props.uuid}
                    update={props.updateReserva}
                    getReservas={() => props.getReservas(props.filterData, props.paginationProps.currentPage)}
                    />
                )} */}
            </>
    )
}

export default EventoReservasTab;