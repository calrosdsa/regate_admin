"use client";
import ReservaList from "@/presentation/reservas/ReservaList";
import CreateReservaDialog from "@/presentation/reservas/dialog/CreateReservaDialog";
import DialogReservaDetail from "@/presentation/reservas/dialog/DialogReservaDetail";
import RequestReporteReservaDialog from "@/presentation/reservas/dialog/RequestReporteReservaDialog";
import SearchInput from "@/presentation/util/input/SearchInput";
import SelectComponent from "@/presentation/util/input/SelectCompenent";
// import Pagination from "@/components/util/pagination/Pagination";
import { downloadReporteReservasExcel } from "@/context/actions/download-actions";
import { useAppDispatch, useAppSelector } from "@/context/reduxHooks";
import { dataActions } from "@/context/slices/dataSlice";
import { uiActions } from "@/context/slices/uiSlice";
import { GetInstalaciones } from "@/core/repository/instalacion";
import {
  GetReservaDetail,
  getEstablecimientoReservas,
  getEstablecimientoReservasCount,
} from "@/core/repository/reservas";
import { Order, OrderQueueReserva } from "@/core/type/enums";
import { appendSerachParams } from "@/core/util/routes";
import { Button } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { use, useEffect, useState } from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import DownloadIcon from "@mui/icons-material/Download";
import Pagination from "@/presentation/shared/pagination/Pagination";
import AutocompleteMui from "@/presentation/util/input/AutocompleteMui";
import { ReservasViewModel } from "./ReservasViewModel";

export default function Page({ params }: { params: { uuid: string } }) {
  const { state, action } = ReservasViewModel({ params });

  return (
    <>
      {state.openRequestReporteDialog && (
        <RequestReporteReservaDialog
          open={state.openRequestReporteDialog}
          close={() => action.setOpenRequestReporteDialog(false)}
          uuid={params.uuid}
          instalacionOptions={state.instalaciones}
        />
      )}
      <div className="p-2 overflow-auto">
        <div className="">
          <span className="text-xl">
            Reservas({state.paginationProps?.count})
          </span>

          <div className="flex flex-wrap space-x-3 py-2">
            <Button
              sx={{ height: 35 }}
              variant="outlined"
              disabled={state.loading}
              onClick={() => {
                action.setQuery("");
                action.getReservas(state.filterData, 1);
              }}
            >
              <RefreshIcon />
            </Button>

            <Button
              sx={{ height: 35 }}
              variant="outlined"
              disabled={state.loading}
              onClick={() => {
                action.openExportReservasDialog();
              }}
            >
              <DownloadIcon />
            </Button>
            <SelectComponent
              value={state.selectedInstalacion}
              items={state.instalaciones
                .map((t) => {
                  return {
                    value: t.id.toString(),
                    name: t.name,
                  };
                })
                .concat({ name: "Todas las canchas", value: "0" })}
              onChange={(e) => {
                const filterD: ReservaDataFilter = {
                  ...state.filterData,
                  instalacion_id: e.target.value,
                };
                action.setSelectedInstalacion(e.target.value);
                action.getReservas(filterD, 1);
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
            <AutocompleteMui
        // label="Nombre"
        options={state.users} 
        loading={state.loadingUsers}
        setQuery={(e)=>{
            console.log("NEWQUERY",e)
            action.setQuery(e)
            action.setUserEmpresa(null)
        }}
        onReset={()=>{
            action.getReservas({...state.filterData,user_id:0},1)
        }}
        className="w-[264px]"
        placeholder="Buscar por nombre de usuario..."
        query={state.query}
        onSelect={(e)=>{
            if(e == null) return
            action.setQuery(e.name)
            action.getReservas({...state.filterData,user_id:e.id},1)
            // action.setUserEmpresa(e)
            action.setUsers([])
        }}
        value={null}
        />

            {/* <div className="flex space-x-2 items-center">
                <SearchInput
                className=" sm:w-64"
                placeholder="Buscar por nombre"
                onChange={onChange}
                value={query}
                clear={()=>{
                    setQuery("")
                    const filter  = {...filterData,query:""}
                    setFilterData(filter)
                    getReservas(filter,1)
                    if(paginationProps == undefined) return
                    setPaginationProps({
                        ...paginationProps,
                        count:0
                    })
                }}
                onEnter={(query)=>searchQuery(query)}
                />
                {(paginationProps != undefined && paginationProps.count > 0 && query != "") &&
                <span>{paginationProps.count} {paginationProps.count > 1 ? "coincidencias":"coincidencia"}</span>
                }
                </div> */}

            {state.paginationProps != undefined && (
              <Pagination
                currentPage={state.paginationProps.currentPage}
                setPage={(page) => {
                  // console.log(Math.ceil(paginationProps.count/paginationProps.pageSize))
                  action.appendSerachParams("page", page.toString());
                  action.getReservas(state.filterData, page);
                  action.setPaginationProps({
                    ...state.paginationProps,
                    currentPage: page,
                  });
                  // action.setPaginationProps({
                  //     ...state.paginationProps,
                  //     currentPage:page
                  // })
                }}
                totalCount={state.paginationProps.count || 0}
                pageSize={state.paginationProps.pageSize}
              />
            )}
          </div>
          {/* {query != "" &&
                <span className="italic text-sm  text-gray-600">Pulse intro para filtrar por prefijo:{query}</span>
                } */}
        </div>

        <div className=" overflow-auto">
          <ReservaList
            reservas={state.reservas}
            loading={state.loading}
            order={state.order}
            getReservaDetail={(id) => action.getReservaDetail(id)}
            changeOrder={(order) => {
              if (order.order == Order.DESC) {
                action.setOrder({
                  ...order,
                  order: Order.ASC,
                });
                const data = {
                  ...state.filterData,
                  order: Order.ASC,
                  order_queue: order.queue,
                };
                action.applyChange(data);
              } else {
                action.setOrder({
                  ...order,
                  order: Order.DESC,
                });
                const data = {
                  ...state.filterData,
                  order: Order.DESC,
                  order_queue: order.queue,
                };
                action.applyChange(data);
              }
            }}
          />
        </div>
        {/* {JSON.stringify(reservas)} */}
      </div>

      {state.openReservaDetailDialog && state.reservaDetail != null && (
        <DialogReservaDetail
          open={state.openReservaDetailDialog}
          close={() => action.setOpenReservaDetailDialog(false)}
          data={state.reservaDetail}
          uuid={params.uuid}
          update={(reserva?: Reserva) => {
            if (reserva == undefined) return;
            action.updateReservas(reserva);
          }}
          getReservas={() =>
            action.getReservas(state.filterData, Number(state.pageParam))
          }
        />
      )}
    </>
  );
}
