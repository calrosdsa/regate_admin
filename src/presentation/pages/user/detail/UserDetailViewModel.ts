import { useAppDispatch } from "@/context/reduxHooks";
import { uiActions } from "@/context/slices/uiSlice";
import { GetReservaDetail } from "@/core/repository/reservas";
import { GetUserEmpresaDetail, GetUserLocalReservas } from "@/core/repository/users";
import { Order, OrderQueueReserva } from "@/core/type/enums";
import useEffectOnce from "@/core/util/hooks/useEffectOnce";
import { reservaRepository as ReservaRepository } from "@/data/repository/reserva"
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const UserDetailViewModel = ({ params }: { params: { uuid: string,uuidUser: string} })=>{
    const reservaRepository = ReservaRepository
    const dispatch = useAppDispatch()
    const searchParams = useSearchParams();
    const name = searchParams.get("name")
    const id = searchParams.get("id")
    const phone = searchParams.get("phone")
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
            const body:ReservaDataFilter = {
                uuid:params.uuid,
                order:Order.DESC,
                order_queue:OrderQueueReserva.RESERVA_CREATED,
                user_id:userEmpresa.id
            }
            const res = await reservaRepository.GetEstablecimientoReservas(body,1)
            setReservas(res.results)
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
    return {
        state:{
            reservas,
            userEmpresa,
            openEditUserDialog,
            openReservaDetailDialog,
            loading,
            reservaDetail,
        },
        setOpenReservaDetailDialog,
        setOpenUserDialog,
        setUserEmpresa,
        getReservaDetail,
        setReservas,
        getUserReservas,
    }
}

export default UserDetailViewModel;