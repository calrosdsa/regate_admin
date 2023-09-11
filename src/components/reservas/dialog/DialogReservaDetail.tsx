import DialogLayout from "@/components/util/dialog/DialogLayout";
import CommonImage from "@/components/util/image/CommonImage";
import { getFullName } from "@/core/util";
import moment from "moment";

const DialogReservaDetail = ({open,close,reserva}:{
    open:boolean
    close:()=>void
    reserva:Reserva
}) => {
    // const options: any | undefined = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    return(
        <>
     <DialogLayout open={open} close={close}>
        <div className='rounded-lg bg-white overflow-auto'>
        <div className="flex space-x-2 items-center  ">
                        <CommonImage
                        src={reserva.profile_photo || "/images/profile.png"}
                        h={30}
                        w={30}
                        className="rounded-full"
                        />
                        <span className="text-sm truncate ">{getFullName(reserva.nombre,reserva.apellido)}</span>
                        </div>
            
                       

                         <div className=" my-5 ">
                                <div className="grid sm:flex sm:justify-between sm:items-center sm:space-x-10 border-b-[1px] py-2">
                                        <span className="label">Fecha y hora de la reserva</span>
                                        <span className="text-xs  sm:whitespace-nowrap">{moment.utc(reserva.start_date).format("ll")} de {' '}
                                {moment.utc(reserva.start_date).format("LT")} a {' '}
                                {moment.utc(reserva.end_date).format("LT")} </span>
                                    </div>

                                    <div className="grid sm:flex sm:justify-between sm:items-center sm:space-x-10 border-b-[1px] py-2">
                                        <span className="label">Precio de la reserva</span>
                                        <span className="text-xs ">{reserva.total_price}</span>
                                    </div>

                                    <div className="grid sm:flex sm:justify-between sm:items-center sm:space-x-10 border-b-[1px] py-2">
                                        <span className="label">Cantidad pagada</span>
                                        <span className="text-xs ">{reserva.paid}</span>
                                    </div>

                                    <div className="grid sm:flex sm:justify-between sm:items-center sm:space-x-10 border-b-[1px] py-2">
                                        <span className="label">Hora en la que se hizo la reserva</span>
                                        <span className="text-xs ">
                                            {moment.utc(reserva.created_at).format("lll")}
                                        </span>
                                    </div>
                                </div>

         </div>   
     </DialogLayout>
    </>
    )
}

export default DialogReservaDetail;