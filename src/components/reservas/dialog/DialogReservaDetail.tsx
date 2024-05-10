import ConfirmationDialog from "@/components/util/dialog/ConfirmationDialog";
import DialogLayout from "@/components/util/dialog/DialogLayout";
import CommonImage from "@/components/util/image/CommonImage";
import { getFullName } from "@/core/util";
import moment from "moment";
import {useEffect, useRef, useState} from "react"
import CancelReservaDialog from "./CancelReservaDialog";
import { getEstadoReserva } from "../ReservaList";
import { ReservaEstado, ReservaType } from "@/core/type/enums";
import ConfirmReservaDialog from "./ConfirmReservaDialog";
import EditReservaDialog from "./EditDialogReserva";
import { useAppDispatch } from "@/context/reduxHooks";
import EditIcon from '@mui/icons-material/Edit';
import { dataActions } from "@/context/slices/dataSlice";
import Link from "next/link";
import { getRouteEstablecimiento } from "@/core/util/routes";
import { Button, Chip, DialogActions, IconButton, List, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import LabelIcon from '@mui/icons-material/Label';

const DialogReservaDetail = ({open,close,data,update,uuid,getReservas}:{
    open:boolean
    close:()=>void
    data:ReservaDetail,
    update:(reserva?:Reserva)=>void
    uuid:string
    getReservas:()=>void
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
        console.log(data)
    },[data])
    return(
        <>
        {editReservaDialog &&
        <EditReservaDialog
        open={editReservaDialog}
        close={()=>setEditReservaDialog(false)}
        reserva={detail.reserva}
        update={(paid,estado,endDate)=>{
            console.log("ENDDATE",endDate)
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
     instalacion={detail.instalacion}
     close={()=>setCancelReservaDialog(false)}
     getReservas={getReservas}
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
     testId="d-detail-reserva"
     title="Detalles de la Reserva"
     allowFullScreen={true}
     open={showReservaDetail} close={()=>setShowReservaDetail(false)}>

        <div className=' overflow-auto'>

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
                        className="rounded-full h-14 w-14 object-cover bg-gray-200 "
                        />
                        <div className="flex flex-col gap-y-2">
                        <Typography data-testid="detail-cancha-name">{detail.instalacion.name}</Typography>
                        <Chip
                        size="small"
                        label={detail.instalacion.category_name}
                        icon={<LabelIcon/>}
                        />
                        {/* <div className="flex px-2 space-x-2 items-center border-[1px] p-1 rounded-lg cursor-default">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" 
                                    className="w-3 h-3">
                                    <path fillRule="evenodd" d="M5.25 2.25a3 3 0 00-3 3v4.318a3 3 0 00.879 2.121l9.58 9.581c.92.92 2.39 1.186 3.548.428a18.849 18.849 0 005.441-5.44c.758-1.16.492-2.629-.428-3.548l-9.58-9.581a3 3 0 00-2.122-.879H5.25zM6.375 7.5a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z" clipRule="evenodd" />
                                </svg>
                                <Typography variant="caption">{detail.instalacion.category_name}</Typography>
                        </div> */}
                        </div>
                    </div>


                   

                       
            </div>
            
        {detail.reserva.nombre != undefined &&
                <div className="">
                    <List>
                    <ListItem 
                    secondaryAction={
                        detail.reserva.reserva_type != ReservaType.App &&
                        <IconButton edge="end" aria-label="see" size="small"
                                 href={getRouteEstablecimiento(uuid,`users/${detail.reserva.user_uuid}?id=${detail.reserva.user_id}&name=${detail.reserva.nombre}`)}
                                 target="_blank">
                            <OpenInNewIcon fontSize="small"/>
                        </IconButton>
                    }
                    >
                        <ListItemIcon>
                        <CommonImage
                            src={detail.reserva.profile_photo || "/images/profile.png"}
                            h={30}
                            w={30}
                            className="rounded-full"
                            />
                        </ListItemIcon>
                        <ListItemText
                            primary={getFullName(detail.reserva.nombre,detail.reserva.apellido)}
                            />
                    </ListItem>
                    </List>
                        {/* <div className="flex space-x-2 items-center pt-2">
                            <CommonImage
                            src={detail.reserva.profile_photo || "/images/profile.png"}
                            h={30}
                            w={30}
                            className="rounded-full"
                            />
                            <span className="text-sm truncate ">{getFullName(detail.reserva.nombre,detail.reserva.apellido)}</span>
                        </div>
                        {detail.reserva.estado != ReservaEstado.Cancel &&
                        <IconButton onClick={()=>setEditReservaDialog(true)}>
                        <EditIcon/>
                        </IconButton>
                         } */}

                      

                </div>
                    }
                    

                         <div className=" mb-4 ">
                                <div className="grid sm:grid-cols-2 items-center gap-x-4 border-b-[1px] py-2">
                                        <Typography variant="subtitle2"  className="label">Fecha y hora de la reserva</Typography>
                                        <Typography data-testid="reserva-fecha" variant="body2" className="sm:whitespace-nowrap">{moment.utc(detail.reserva.start_date).format("ll")} de {' '}
                                {moment.utc(detail.reserva.start_date).format("LT")} a {' '}
                                {moment.utc(detail.reserva.end_date).format("LT")} </Typography>
                                    </div>

                                    <div className="grid sm:grid-cols-2 items-center gap-x-4 border-b-[1px] py-2">
                                        <Typography variant="subtitle2"  className="label">Estado de la reserva</Typography>
                                        <Typography data-testid="reserva-estado" variant="body2">{getEstadoReserva(detail.reserva.estado)}</Typography>
                                    </div>

                                    <div className="grid sm:grid-cols-2 items-center gap-x-4 border-b-[1px] py-2">
                                        <Typography variant="subtitle2"  className="label">Precio de la reserva</Typography>
                                        <Typography data-testid="reserva-precio" variant="body2">{detail.reserva.total_price}</Typography>
                                    </div>

                                    <div className="grid sm:grid-cols-2 items-center gap-x-4 border-b-[1px] py-2">
                                        <Typography variant="subtitle2"  className="label">Cantidad pagada</Typography>
                                        <Typography data-testid="reserva-monto-pagado" variant="body2">{detail.reserva.paid}</Typography>
                                    </div>


                                    <div className="grid sm:grid-cols-2 items-center gap-x-4 border-b-[1px] py-2">
                                        <Typography variant="subtitle2"  className="label">Hora en la que se hizo la reserva</Typography>
                                        <Typography variant="body2">
                                            {moment(detail.reserva.created_at).format("lll")}
                                        </Typography>
                                    </div>

                                    {detail.reserva.evento.id != 0 &&
                                    <div className="grid sm:grid-cols-2 items-center gap-x-4 border-b-[1px] py-2">
                                        <Typography variant="subtitle2"  className="label">Evento</Typography>
                                        <Link  href={getRouteEstablecimiento(uuid,`eventos/${detail.reserva.evento.uuid}?name=${detail.reserva.evento.name}&id=${detail.reserva.evento.id}`)} 
                                        className="text-xs underline">
                                            <Typography color="primary" variant="body2">
                                            {detail.reserva.evento.name}
                                            </Typography>
                                        </Link>
                                    </div>
                                    }
                                    {detail.reserva.cancellation_reason != null && 
                                    <div className="grid sm:grid-cols-2 items-center gap-x-4 border-b-[1px] py-2">
                                        <Typography variant="subtitle2"  className="label">Motivo de cancelación</Typography>
                                        <Typography variant="body2">{detail.reserva.cancellation_reason}</Typography>
                                    </div>
                                    }
                                    
                                </div>

                                <>
                                    <DialogActions>
                                        <div className="flex flex-wrap gap-2">
                                    {detail.reserva.estado == ReservaEstado.Pendiente &&
                                    <Button variant="contained"
                                    onClick={()=>setConfirmReservaDialog(true)} >
                                        Completar monto de la reserva
                                    </Button>
                                    }

                                    {(detail.reserva.estado == ReservaEstado.Valid || detail.reserva.estado == ReservaEstado.Pendiente) &&
                                    <Button  data-testid="cancelar-reserva" variant="contained"
                                    onClick={()=>setCancelReservaDialog(true)} >
                                    Cancelar reserva
                                    </Button>
                                    }

                                    {detail.reserva.estado != ReservaEstado.Cancel &&
                                    <Button data-testid="edit-reserva" variant="contained"
                                     onClick={()=>setEditReservaDialog(true)}>
                                    <EditIcon/>
                                    </Button>
                                    }
                                    </div>
                                    </DialogActions>
      </>
                                {/* <button onClick={()=>setCancelReservaDialog(true)}
                                className="button">Cancelar reserva</button> */}

         </div>   
     </DialogLayout>
    </>
    )
}

export default DialogReservaDetail;