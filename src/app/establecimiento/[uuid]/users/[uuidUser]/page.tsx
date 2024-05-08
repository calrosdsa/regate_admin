"use client"

import EditUserEmpresaDialog from "@/components/user/dialog/EditUserEmpresaDialog";
import MenuLayout from "@/components/util/button/MenuLayout";
import { Menu } from "@headlessui/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getRouteEstablecimiento } from "@/core/util/routes";
import { GetUserEmpresaDetail, GetUserLocalReservas } from "@/core/repository/users";
import useEffectOnce from "@/core/util/hooks/useEffectOnce";
import UserReservaTable from "@/components/user/UserReservaTable";
import { useAppDispatch } from "@/context/reduxHooks";
import { GetReservaDetail } from "@/core/repository/reservas";
import { uiActions } from "@/context/slices/uiSlice";
import DialogReservaDetail from "@/components/reservas/dialog/DialogReservaDetail";
import { dataActions } from "@/context/slices/dataSlice";
import { ListItemIcon, ListItemText, MenuItem, Typography } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Page = ({ params }: { params: { uuidUser: string,uuid:string } }) => {
    const dispatch = useAppDispatch()
    const searchParams = useSearchParams();
    const name = searchParams.get("name")
    const id = searchParams.get("id")
    const phone = searchParams.get("phone")
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [userEmpresa,setUserEmpresa] = useState<UserEmpresa>({
        id:Number(id),
        name:name || "", 
        phone_number:phone || "",
        uuid:params.uuidUser,
    })
    const [openEditUserDialog,setOpenUserDialog] = useState(false)
    const [loading,setLoading] = useState(false)
    const [reservas,setReservas] = useState<Reserva[]>([])
    const [reservaDetail,setReservaDetail] = useState<ReservaDetail | null>(null)
    const [openReservaDetailDialog,setOpenReservaDetailDialog] = useState(false)
   

    const getUserEmpresaDetail = async() => {
        try{
            const res:UserEmpresa = await GetUserEmpresaDetail(Number(id),params.uuidUser )
            setUserEmpresa(res)
        }catch(err){
        }
    }

    const getReservaDetail = async(id:number) => {
        try{
            dispatch(uiActions.setLoaderDialog(true))
            const res = await GetReservaDetail(id)
            setReservaDetail(res)
            dispatch(uiActions.setLoaderDialog(false))
        }catch(err){
            dispatch(uiActions.setLoaderDialog(false))
        }
    }

    const getUserReservas = async() =>{
        try{
            setReservas([])
            setLoading(true)
            const res:Reserva[] = await GetUserLocalReservas(params.uuidUser,id || "0")
            setReservas(res)
            setLoading(false)
        }catch(err){
            console.log(err)
            setLoading(false)

        }
    }
    // const router = useRouter()
    // const current = new URLSearchParams(Array.from(searchParams.entries()))

    useEffect(()=>{
        if(reservaDetail != null){
            setOpenReservaDetailDialog(true)
        }
    },[reservaDetail])

    useEffectOnce(()=>{
        getUserEmpresaDetail()
        getUserReservas()
    })

    return(
        <>
        {openEditUserDialog && 
        <EditUserEmpresaDialog
        open={openEditUserDialog}
        close={()=>setOpenUserDialog(false)}
        userEmpresa={userEmpresa}
        onUpdate={(name,phone)=>setUserEmpresa({...userEmpresa,name:name,phone_number:phone})}
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
                <Typography variant="body2" className="text-primary cursor-pointer"> {userEmpresa.name}</Typography>
            </div>
            <div className="pt-10 xl:pt-2">

                <div className="flex justify-between">
                <Typography variant="h6" className="text-xl">{' '} {userEmpresa.name} ( {userEmpresa.phone_number} )</Typography>

                <MenuLayout
                 anchorEl={anchorEl}
                 setAnchorEl={(e)=>setAnchorEl(e)}>

                <MenuItem onClick={()=>{
                    setAnchorEl(null)
                    setOpenUserDialog(true)
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
                   loading={loading}
                   selectReserva={(e)=>getReservaDetail(e.id)}
                   reservas={reservas}
                   />
                </div>

                </div>

            </div>
        </div>

        {(openReservaDetailDialog && reservaDetail != null) &&
        <DialogReservaDetail
        open={openReservaDetailDialog}
        close={()=>setOpenReservaDetailDialog(false)}
        data={reservaDetail}
        update={(reserva)=>{
            if(reserva == undefined) return
            const n = reservas.map((item)=>{
                if(item.id == reserva.id){
                    item = reserva
                }
                return item
            })
            setReservas(n)
        }}
        uuid={params.uuid}
        getReservas={()=>{getUserReservas() }}
        />
        }
        </>
    )
}


export default Page;
