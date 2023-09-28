import ConfirmationDialog from "@/components/util/dialog/ConfirmationDialog";
import DialogLayout from "@/components/util/dialog/DialogLayout";
import CommonImage from "@/components/util/image/CommonImage";
import { getFullName } from "@/core/util";
import moment from "moment";
import {useRef, useState} from "react"
import CancelReservaDialog from "./CancelReservaDialog";
import { getEstadoReserva } from "../ReservaList";
import { ReservaEstado } from "@/core/type/enums";
const DialogReservaDetail = ({open,close,data}:{
    open:boolean
    close:()=>void
    data:ReservaDetail
}) => {
    const [cancelReservaDialog,setCancelReservaDialog] = useState(false)

    // const options: any | undefined = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    return(
        <>
     {cancelReservaDialog &&
     <CancelReservaDialog
     open={cancelReservaDialog}
     reserva={data.reserva}
     close={()=>setCancelReservaDialog(false)}

     />
     }
     <DialogLayout
     className=" max-w-md sm:max-w-lg md:max-w-xl"
     title="Detalles de la Reserva"
     allowFullScreen={true}
     allowClose={true}
     open={open} close={close}>

        <div className='rounded-lg bg-white overflow-auto pt-2'>

            {/* <div className="pb-2 flex justify-between items-center">
                <span className="title text-lg">Detalles de la Reserva</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                </svg>
            </div> */}

        <div className=" border-b-[1px] pb-2">
                    <div className="grid sm:grid-cols-2 sm:gap-x-2">
                    <CommonImage
                        src={data.instalacion.portada}
                        h={100}
                        w={170}
                        className="rounded-lg h-48 w-full"
                        />
                        <div className="flex flex-col gap-y-2">
                        <span className="text-sm font-semibold">{data.instalacion.name}</span>
                        <div className="flex w-40 space-x-2 items-center border-[1px] p-1 rounded-lg cursor-default">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" 
                                    className="w-3 h-3">
                                    <path fillRule="evenodd" d="M5.25 2.25a3 3 0 00-3 3v4.318a3 3 0 00.879 2.121l9.58 9.581c.92.92 2.39 1.186 3.548.428a18.849 18.849 0 005.441-5.44c.758-1.16.492-2.629-.428-3.548l-9.58-9.581a3 3 0 00-2.122-.879H5.25zM6.375 7.5a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z" clipRule="evenodd" />
                                </svg>
                                <span className="text-xs font-medium">{data.instalacion.category_name}</span>
                        </div>
                        </div>
                    </div>
                       
            </div>
            
        {data.reserva.nombre != undefined &&
        <div className="flex space-x-2 items-center pt-2">
                        <CommonImage
                        src={data.reserva.profile_photo || "/images/profile.png"}
                        h={30}
                        w={30}
                        className="rounded-full"
                        />
                        <span className="text-sm truncate ">{getFullName(data.reserva.nombre,data.reserva.apellido)}</span>
                        </div>
                    }                                
                         <div className=" my-4 ">
                                <div className="grid sm:flex sm:justify-between sm:items-center sm:space-x-10 border-b-[1px] py-2">
                                        <span className="label">Fecha y hora de la data</span>
                                        <span className="text-xs  sm:whitespace-nowrap">{moment.utc(data.reserva.start_date).format("ll")} de {' '}
                                {moment.utc(data.reserva.start_date).format("LT")} a {' '}
                                {moment.utc(data.reserva.end_date).format("LT")} </span>
                                    </div>

                                    <div className="grid sm:flex sm:justify-between sm:items-center sm:space-x-10 border-b-[1px] py-2">
                                        <span className="label">Estado de la reserva</span>
                                        <span className="text-xs ">{getEstadoReserva(data.reserva.estado)}</span>
                                    </div>

                                    <div className="grid sm:flex sm:justify-between sm:items-center sm:space-x-10 border-b-[1px] py-2">
                                        <span className="label">Precio de la reserva</span>
                                        <span className="text-xs ">{data.reserva.total_price}</span>
                                    </div>

                                    <div className="grid sm:flex sm:justify-between sm:items-center sm:space-x-10 border-b-[1px] py-2">
                                        <span className="label">Cantidad pagada</span>
                                        <span className="text-xs ">{data.reserva.paid}</span>
                                    </div>


                                    <div className="grid sm:flex sm:justify-between sm:items-center sm:space-x-10 border-b-[1px] py-2">
                                        <span className="label">Hora en la que se hizo la reserva</span>
                                        <span className="text-xs ">
                                            {moment.utc(data.reserva.created_at).format("lll")}
                                        </span>
                                    </div>
                                </div>

                                <>
                                {data.reserva.estado == ReservaEstado.Valid &&
                                <div className={`button flex justify-center h-10 `}
                                onClick={()=>setCancelReservaDialog(true)} >
                                Cancelar reserva
                                </div>
                                }
      </>
                                {/* <button onClick={()=>setCancelReservaDialog(true)}
                                className="button">Cancelar reserva</button> */}

         </div>   
     </DialogLayout>
    </>
    )
}

export default DialogReservaDetail;