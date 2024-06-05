import EditUserEmpresaDialog from "@/presentation/user/dialog/EditUserEmpresaDialog";
import { useState } from "react";
import UserDetailViewModel from "./UserDetailViewModel";
import Link from "next/link";
import { getRouteEstablecimiento } from "@/core/util/routes";
import {
  Box,
  Button,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Tab,
  Typography,
} from "@mui/material";
import MenuLayout from "@/presentation/util/button/MenuLayout";
import EditIcon from "@mui/icons-material/Edit";
import UserReservaTable from "@/presentation/user/UserReservaTable";
import DialogReservaDetail from "@/presentation/reservas/dialog/DialogReservaDetail";
import Pagination from "@/presentation/shared/pagination/Pagination";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import UserReservaTab from "./tab/UserReservaTab";
import UserEventoTab from "./tab/UserEventoTab";

const UserDetail = ({
  params,
}: {
  params: { uuid: string; uuidUser: string };
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const vm = UserDetailViewModel({ params });
  const state = vm.state;

  return (
    <>
      {state.openEditUserDialog && (
        <EditUserEmpresaDialog
          open={state.openEditUserDialog}
          close={() => vm.setOpenUserDialog(false)}
          userEmpresa={state.userEmpresa}
          onUpdate={(name, phone) =>
            vm.setUserEmpresa({
              ...state.userEmpresa,
              name: name,
              phone_number: phone,
            })
          }
        />
      )}
      <div className="p-2 overflow-auto h-screen">
        <div className="flex space-x-1 items-center">
          <Link
            href={getRouteEstablecimiento(params.uuid, "users")}
            className="cursor-pointer underline"
          >
            <Typography variant="body2">Usuarios</Typography>
          </Link>
          <span> {" > "} </span>
          <Typography variant="body2" className="cursor-pointer">
            {" "}
            {state.userEmpresa.name}
          </Typography>
        </div>
        <div className="pt-10 xl:pt-2">
          <div className="flex justify-between">
            <Typography variant="h6" className="text-xl">
              {" "}
              {state.userEmpresa.name} ( {state.userEmpresa.phone_number} )
            </Typography>

            <MenuLayout anchorEl={anchorEl} setAnchorEl={(e) => setAnchorEl(e)}>
              <MenuItem
                onClick={() => {
                  setAnchorEl(null);
                  vm.setOpenUserDialog(true);
                }}
              >
                <ListItemIcon>
                  <EditIcon />
                </ListItemIcon>
                <ListItemText>Editar</ListItemText>
              </MenuItem>
            </MenuLayout>
          </div>

          <Box sx={{ width: "100%", typography: "body1" }}>
            <TabContext value={state.tab}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList onChange={vm.handleTabChange} aria-label="tabs">
                  <Tab label="Reservas" value="1" />
                  <Tab label="Eventos" value="2" />
                </TabList>
              </Box>
              <TabPanel value="1">
               <UserReservaTab
               paginationProps={state.paginationProps}
               loading={state.loading}
               reservas={state.reservas}
               changeOrder={vm.changeOrder}
               changePage={vm.changePage}
               order={state.order}
               getReservaDetail={vm.getReservaDetail}
               refresh={vm.refresh}
               />
              </TabPanel>
              <TabPanel value="2">
                <UserEventoTab
                paginationProps={state.paginationProps2}
                changePage={vm.changePage}
                eventos={state.eventos}
                uuid={params.uuid}
                loading={state.loading}  
                refresh={vm.refresh} 
                />
              </TabPanel>
            </TabContext>
          </Box>
        </div>
      </div>

      {state.openReservaDetailDialog && state.reservaDetail != null && (
        <DialogReservaDetail
          open={state.openReservaDetailDialog}
          close={() => vm.setOpenReservaDetailDialog(false)}
          data={state.reservaDetail}
          update={(reserva) => {
            if (reserva == undefined) return;
            const n = state.reservas.map((item) => {
              if (item.id == reserva.id) {
                item = reserva;
              }
              return item;
            });
            vm.setReservas(n);
          }}
          uuid={params.uuid}
          getReservas={() => {
            vm.getUserReservas(1);
          }}
        />
      )}
    </>
  );
};

export default UserDetail;
