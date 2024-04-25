import ConfirmationDialog from "@/components/util/dialog/ConfirmationDialog";
import DialogLayout from "@/components/util/dialog/DialogLayout";
import CommonImage from "@/components/util/image/CommonImage";
import { getFullName } from "@/core/util";
import moment from "moment";
import {useEffect, useRef, useState} from "react"
import CancelReservaDialog from "./CancelReservaDialog";
import { getEstadoReserva } from "../ReservaList";
import { ReservaEstado } from "@/core/type/enums";
import ConfirmReservaDialog from "./ConfirmReservaDialog";
import EditReservaDialog from "./EditDialogReserva";
import { useAppDispatch } from "@/context/reduxHooks";
import { dataActions } from "@/context/slices/dataSlice";
import Link from "next/link";
import { getRouteEstablecimiento } from "@/core/util/routes";
const DialogReservaDetail = ({open,close,data,update,uuid}:{
    open:boolean
    close:()=>void
    data:ReservaDetail,
    update:(reserva?:Reserva)=>void
    uuid:string
    
}) => {
    const [cancelReservaDialog,setCancelReservaDialog] = useState(false)
    const [detail,setDetail] = useState<ReservaDetail>(data)
    const [confirmReservaDialog,setConfirmReservaDialog] = useState(false)
    const [editReservaDialog,setEditReservaDialog] = useState(false)
    const [showReservaDetail,setShowReservaDetail] = useState(true)

    const dispatch = useAppDispatch()
    // const options: any | undefined = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    useEffect(()=>{
        setShowReservaDetail(true)
        setDetail(data)
    },[data])
    return(
        <>
        {editReservaDialog &&
        <EditReservaDialog
        open={editReservaDialog}
        close={()=>setEditReservaDialog(false)}
        reserva={detail.reserva}
        update={(paid,estado,endDate)=>{
            const reserva = {
                ...detail.reserva,
                estado:estado,
                paid:paid,
                end_date:endDate
            }
            const n:ReservaDetail = {...detail,reserva:reserva}
            setDetail(n)
            dispatch(dataActions.updateReservas(n.reserva))
            update(reserva)
        }}
        />
        }
     {cancelReservaDialog &&
     <CancelReservaDialog
     open={cancelReservaDialog}
     uuid={uuid}
     reserva={detail.reserva}
     close={()=>setCancelReservaDialog(false)}
     update={()=>{
         close()
         const reserva = {
             ...detail.reserva,
             estado:ReservaEstado.Cancel,
            }
        const n:ReservaDetail = {...detail,reserva:reserva}
        update(reserva)
        setDetail(n)
        dispatch(dataActions.updateReservas(n.reserva))
     }}
     />
     }
     {confirmReservaDialog &&
     <ConfirmReservaDialog
     open={confirmReservaDialog}
     reserva={detail.reserva}
     close={()=>setConfirmReservaDialog(false)}
     update={(amount:number)=>{
        close()
        const n:ReservaDetail = {...detail,reserva:{
            ...detail.reserva,
            estado:ReservaEstado.Valid,
            paid:detail.reserva.paid + amount,
        }}
        setDetail(n)
        dispatch(dataActions.updateReservas(n.reserva))
     }}
     />
     }
     <DialogLayout
     className=" max-w-md sm:max-w-lg md:max-w-xl"
     title="Detalles de la Reserva"
     allowFullScreen={true}
     open={showReservaDetail} close={()=>setShowReservaDetail(false)}>

        <div className='rounded-lg bg-white overflow-auto pt-2'>

            {/* <div className="pb-2 flex justify-between items-center">
                <span className="title text-lg">Detalles de la Reserva</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                </svg>
            </div> */}

        <div className=" border-b-[1px] pb-2">
                    <div className="flex space-x-2 items-center">
                    <CommonImage
                        src={detail.instalacion.portada}
                        h={100}
                        w={100}
                        className="rounded-full h-14 w-14 object-cover"
                        />
                        <div className="flex flex-col gap-y-2">
                        <span className="text-sm font-semibold">{detail.instalacion.name}</span>
                        <div className="flex w-40 space-x-2 items-center border-[1px] p-1 rounded-lg cursor-default">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" 
                                    className="w-3 h-3">
                                    <path fillRule="evenodd" d="M5.25 2.25a3 3 0 00-3 3v4.318a3 3 0 00.879 2.121l9.58 9.581c.92.92 2.39 1.186 3.548.428a18.849 18.849 0 005.441-5.44c.758-1.16.492-2.629-.428-3.548l-9.58-9.581a3 3 0 00-2.122-.879H5.25zM6.375 7.5a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z" clipRule="evenodd" />
                                </svg>
                                <span className="text-xs font-medium">{detail.instalacion.category_name}</span>
                        </div>
                        </div>
                    </div>


                   

                       
            </div>
            
        {detail.reserva.nombre != undefined &&
                <div className=" flex justify-between items-center">
                        <div className="flex space-x-2 items-center pt-2">
                            <CommonImage
                            src={detail.reserva.profile_photo || "/images/profile.png"}
                            h={30}
                            w={30}
                            className="rounded-full"
                            />
                            <span className="text-sm truncate ">{getFullName(detail.reserva.nombre,detail.reserva.apellido)}</span>
                        </div>

                        {detail.reserva.estado != ReservaEstado.Cancel &&
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" 
                        className="w-7 h-7 noSelect icon-button" onClick={()=>{
                            setEditReservaDialog(true)
                            // setShowReservaDetail(false)
                        }}>
                            <path d="M13.488 2.513a1.75 1.75 0 0 0-2.475 0L6.75 6.774a2.75 2.75 0 0 0-.596.892l-.848 2.047a.75.75 0 0 0 .98.98l2.047-.848a2.75 2.75 0 0 0 .892-.596l4.261-4.262a1.75 1.75 0 0 0 0-2.474Z" />
                            <path d="M4.75 3.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h6.5c.69 0 1.25-.56 1.25-1.25V9A.75.75 0 0 1 14 9v2.25A2.75 2.75 0 0 1 11.25 14h-6.5A2.75 2.75 0 0 1 2 11.25v-6.5A2.75 2.75 0 0 1 4.75 2H7a.75.75 0 0 1 0 1.5H4.75Z" />
                            </svg>
                        }

                </div>
                    }
                    

                         <div className=" my-4 ">
                                <div className="grid sm:flex sm:justify-between sm:items-center sm:space-x-10 border-b-[1px] py-2">
                                        <span className="label">Fecha y hora de la reserva</span>
                                        <span className="text-xs  sm:whitespace-nowrap">{moment.utc(detail.reserva.start_date).format("ll")} de {' '}
                                {moment.utc(detail.reserva.start_date).format("LT")} a {' '}
                                {moment.utc(detail.reserva.end_date).format("LT")} </span>
                                    </div>

                                    <div className="grid sm:flex sm:justify-between sm:items-center sm:space-x-10 border-b-[1px] py-2">
                                        <span className="label">Estado de la reserva</span>
                                        <span className="text-xs ">{getEstadoReserva(detail.reserva.estado)}</span>
                                    </div>

                                    <div className="grid sm:flex sm:justify-between sm:items-center sm:space-x-10 border-b-[1px] py-2">
                                        <span className="label">Precio de la reserva</span>
                                        <span className="text-xs ">{detail.reserva.total_price}</span>
                                    </div>

                                    <div className="grid sm:flex sm:justify-between sm:items-center sm:space-x-10 border-b-[1px] py-2">
                                        <span className="label">Cantidad pagada</span>
                                        <span className="text-xs ">{detail.reserva.paid}</span>
                                    </div>


                                    <div className="grid sm:flex sm:justify-between sm:items-center sm:space-x-10 border-b-[1px] py-2">
                                        <span className="label">Hora en la que se hizo la reserva</span>
                                        <span className="text-xs ">
                                            {moment.utc(detail.reserva.created_at).format("lll")}
                                        </span>
                                    </div>

                                    {detail.reserva.evento.uuid != "" &&
                                    <div className="grid sm:flex sm:justify-between sm:items-center sm:space-x-10 border-b-[1px] py-2">
                                        <span className="label">Evento</span>
                                        <Link  href={getRouteEstablecimiento(uuid,`eventos/${detail.reserva.evento.uuid}?name=${detail.reserva.evento.name}&id=${detail.reserva.evento.id}`)} 
                                        className="text-xs link">
                                            {detail.reserva.evento.name}
                                        </Link>
                                    </div>
                                    }
                                    
                                </div>

                                <>
                                <div className="flex space-x-2">
                                    {detail.reserva.estado == ReservaEstado.Pendiente &&
                                    <div className={`button flex justify-center text-sm `}
                                    onClick={()=>setConfirmReservaDialog(true)} >
                                        Completar monto de la reserva
                                    </div>
                                    }

                                    {(detail.reserva.estado == ReservaEstado.Valid || detail.reserva.estado == ReservaEstado.Pendiente) &&
                                    <div className={`button flex justify-center h-10 `}
                                    onClick={()=>setCancelReservaDialog(true)} >
                                    Cancelar reserva
                                    </div>
                                    }
                                </div>
      </>
                                {/* <button onClick={()=>setCancelReservaDialog(true)}
                                className="button">Cancelar reserva</button> */}

         </div>   
     </DialogLayout>
    </>
    )
}

export default DialogReservaDetail;