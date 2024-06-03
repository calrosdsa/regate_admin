import EditUserEmpresaDialog from "@/presentation/user/dialog/EditUserEmpresaDialog";
import { useState } from "react";
import UserDetailViewModel from "./UserDetailViewModel";
import Link from "next/link";
import { getRouteEstablecimiento } from "@/core/util/routes";
import { ListItemIcon, ListItemText, MenuItem, Typography } from "@mui/material";
import MenuLayout from "@/presentation/util/button/MenuLayout";
import EditIcon from '@mui/icons-material/Edit';
import UserReservaTable from "@/presentation/user/UserReservaTable";
import DialogReservaDetail from "@/presentation/reservas/dialog/DialogReservaDetail";

const UserDetail = ({ params }: { params: { uuid: string,uuidUser:string } }) =>{
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const vm = UserDetailViewModel({params})
    const state = vm.state
    

    return (
        <>
        {state.openEditUserDialog && 
        <EditUserEmpresaDialog
        open={state.openEditUserDialog}
        close={()=>vm.setOpenUserDialog(false)}
        userEmpresa={state.userEmpresa}
        onUpdate={(name,phone)=>vm.setUserEmpresa({...state.userEmpresa,name:name,phone_number:phone})}
        />
        }
        <div className="p-2 overflow-auto h-screen">
            <div className="flex space-x-1 items-center">
                <Link href={getRouteEstablecimiento(params.uuid,"users")}  className="cursor-pointer underline">
                    <Typography variant="body2">
                    Usuarios
                    </Typography>
                     </Link>
                <span> {' > '} </span>
                <Typography variant="body2" className="cursor-pointer"> {state.userEmpresa.name}</Typography>
            </div>
            <div className="pt-10 xl:pt-2">

                <div className="flex justify-between">
                <Typography variant="h6" className="text-xl">{' '} {state.userEmpresa.name} ( {state.userEmpresa.phone_number} )</Typography>

                <MenuLayout
                 anchorEl={anchorEl}
                 setAnchorEl={(e)=>setAnchorEl(e)}>

                <MenuItem onClick={()=>{
                    setAnchorEl(null)
                    vm.setOpenUserDialog(true)
                    }} >                  
                    <ListItemIcon>
                    <EditIcon/>
                </ListItemIcon>
                <ListItemText>Editar</ListItemText>
                    </MenuItem>

                {/* <MenuItem onClick={()=>{
                setOpenUserDialog(true)
                }} >                  
                <ListItemIcon>
                <DeleteIcon/>
                </ListItemIcon>
                <ListItemText>Eliminar usuario</ListItemText>
                </MenuItem>     */}

            </MenuLayout>

                </div>
                <div className="mt-2">
                <Typography>Reservas</Typography>
                <div className="mt-4">
                   <UserReservaTable
                   loading={state.loading}
                   selectReserva={(e)=>vm.getReservaDetail(e.id)}
                   reservas={state.reservas}
                   />
                </div>

                </div>

            </div>
        </div>

        {(state.openReservaDetailDialog && state.reservaDetail != null) &&
        <DialogReservaDetail
        open={state.openReservaDetailDialog}
        close={()=>vm.setOpenReservaDetailDialog(false)}
        data={state.reservaDetail}
        update={(reserva)=>{
            if(reserva == undefined) return
            const n = state.reservas.map((item)=>{
                if(item.id == reserva.id){
                    item = reserva
                }
                return item
            })
            vm.setReservas(n)
        }}
        uuid={params.uuid}
        getReservas={()=>{vm.getUserReservas()}}
        />
        }
        </>
    )
}

export default UserDetail;