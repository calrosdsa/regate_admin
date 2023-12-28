"use client"

import EditUserEmpresaDialog from "@/components/user/dialog/EditUserEmpresaDialog";
import MenuLayout from "@/components/util/button/MenuLayout";
import { Menu } from "@headlessui/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getRouteEstablecimiento } from "@/core/util/routes";
import { GetUserLocalReservas } from "@/core/repository/users";
import useEffectOnce from "@/core/util/hooks/useEffectOnce";
import UserReservaTable from "@/components/user/UserReservaTable";
import { useAppDispatch } from "@/context/reduxHooks";
import { GetReservaDetail } from "@/core/repository/reservas";
import { uiActions } from "@/context/slices/uiSlice";
import DialogReservaDetail from "@/components/reservas/dialog/DialogReservaDetail";


const Page = ({ params }: { params: { uuidUser: string,uuid:string } }) => {
    const dispatch = useAppDispatch()
    const searchParams = useSearchParams();
    const name = searchParams.get("name")
    const id = searchParams.get("id")
    const phone = searchParams.get("phone")
    const [userEmpresa,setUserEmpresa] = useState<UserEmpresa>({
        id:Number(id),
        name:name || "", 
        phone_number:phone || ""
    })
    const [openEditUserDialog,setOpenUserDialog] = useState(false)
    const [loading,setLoading] = useState(false)
    const [reservas,setReservas] = useState<Reserva[]>([])
    const [reservaDetail,setReservaDetail] = useState<ReservaDetail | null>(null)
    const [openReservaDetailDialog,setOpenReservaDetailDialog] = useState(false)



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
            <div className="flex subtitle space-x-1">
                <Link href={getRouteEstablecimiento(params.uuid,"users")}  className="cursor-pointer underline">Usuarios </Link>
                <span> {' > '} </span>
                <span className="text-primary cursor-pointer"> {userEmpresa.name}</span>
            </div>
            <div className="pt-10 xl:pt-2">

                <div className="flex justify-between">
                <span className="text-xl">{' '} {userEmpresa.name} ( {userEmpresa.phone_number} )</span>

                <MenuLayout>
                <>
                
            <Menu.Item>
                {({ active }) => (
                    <button
                    onClick={()=>setOpenUserDialog(true)}
                    className={`${active ? 'bg-primary text-white' : 'text-gray-900'} 
                    group whitespace-nowrap flex w-full items-center rounded-md px-2 py-2 text-sm
                    `}
                    >
                    Editar
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                    <button
                    //   disabled={user.estado == UserEstado.ENABLED}
                    onClick={()=>{}}
                    className={`${active ? 'bg-primary text-white' : 'text-gray-900'} 
                    group whitespace-nowrap flex w-full items-center rounded-md px-2 py-2 text-sm
                    `}
                    >
                    Eliminar usuario
                  </button>
                )}
              </Menu.Item>
                </>
            </MenuLayout>

                </div>
                <div className="mt-2">
                <span className="sutitle text-lg">Reservas</span>
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
        update={()=>{}}
        />
        }
        </>
    )
}


export default Page;
