import ButtonWithLoader from "@/components/util/button/ButtonWithLoader"
import ConfirmationDialog from "@/components/util/dialog/ConfirmationDialog"
import DialogCalendar from "@/components/util/dialog/DialogCalendar"
import DialogLayout from "@/components/util/dialog/DialogLayout"
import InputWithIcon from "@/components/util/input/InputWithIcon"
import { unexpectedError } from "@/context/config"
import { CancelReserva } from "@/core/repository/reservas"
import { Button, Typography } from "@mui/material"
import moment from "moment"
import { useState } from "react"
import { toast } from "react-toastify"


const CancelReservaDialog = ({open,close,update,reserva,uuid}:{
    open:boolean
    reserva:Reserva
    uuid:string
    close:()=>void
    update:()=>void
    
}) =>{
    const [openConfirmationDialog,setOpenConfirmationDialog] = useState(false)
    const [loading,setLoading] = useState(false)
    const [value,setValue] = useState("")
    const [openCalendar,setOpenCalendar] = useState(false)
    const [date,setDate] = useState<moment.Moment | null>(null)

    const onChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value)
    }

    const cancelarReserva = async() => {
        try{
            setLoading(true)
            let reasignarReservaRequest:ReasignarReservaRequest | null = null;
            const start = moment(reserva.start_date)
            const end = moment(reserva.end_date)
            const duration = moment.duration(end.diff(start));
            const minutes = duration.asMinutes();
            let cupos:CupoR[] = []
            if(minutes >0){
                const loops = (minutes/30)
                for(let i = 0;i < loops;i++){
                    console.log("INDEX",i)
                    const cupo:CupoR = {
                        instalacion_id:reserva.instalacion_id,
                        precio:reserva.paid/loops,
                        start_date:moment(start).add(30*i,"minutes").format()
                    }
                    cupos.push(cupo)
                }
                console.log("MINUTES",minutes)
            }
            console.log("Cupos",cupos)

            const request:ReservaCancelRequest = {
                content:value,
                establecimiento_id:reserva.establecimiento_id,
                establecimiento_uuid:uuid,
                reserva_uuid:reserva.uuid,
                reserva_type:reserva.reserva_type,
                reserva_id:reserva.id,  
                user_id:reserva.user_id,
                reasignar_reserva_request:reasignarReservaRequest,
                evento_id:reserva.evento.id,
            }
            console.log(request)
            //  await CancelReserva(request)
             setLoading(false)
             update()
             close()
            toast.success("Reserva Cancelada")
        }catch(err){
            setLoading(false)
            toast.error(unexpectedError)
        }
    }

    return(
        <>
        {openCalendar &&
        <DialogCalendar
        value={date}
        openModal={openCalendar}
        closeModal={()=>setOpenCalendar(false)}
        onAccept={(e)=>{setDate(e)}}
        />
        }
        {openConfirmationDialog &&
        <ConfirmationDialog
        open={openConfirmationDialog}
        close={()=>setOpenConfirmationDialog(false)}
        description="Al cancelar la reserva, se notificará al usuario que su reserva
        ha sido cancelada y se le reembolsará el monto gastado."
        performAction={()=>{
            setOpenConfirmationDialog(false)
            cancelarReserva()
        }}
        />
        }
        <DialogLayout
        open={open}
        close={close}
        title="Cancelar Reserva"
        className=" max-w-xl"
        >
            <div className="pt-1">
                <InputWithIcon
                onChange={(e)=>onChange(e)}
                value={value}
                name="content"
                label="Motivo de cancelación de la reserva."
                />

                {reserva.evento.id!= 0 &&
                <>
                {date != null &&
                    <div className="mt-3">
                    <Typography fontWeight={500}>La reserva se reasignara para la siguiente fecha</Typography>
                    <Typography>
                    {moment.utc(date).format("ll")} de {' '}
                    {moment.utc(reserva.start_date).format("LT")} a {' '}
                    {moment.utc(reserva.end_date).format("LT")} 
                    </Typography>
                    </div>
                }
                    <Button sx={{mt:2}}
                    onClick={()=>setOpenCalendar(true)}>
                        Reasignar
                    </Button>

                </>
                }

                <div className=" flex justify-end">
                <ButtonWithLoader
                loading={loading}
                onClick={()=>setOpenConfirmationDialog(true)}
                title="Confirmar"
                className="mt-2 w-28"
                />
                </div>
            </div>
        </DialogLayout>
        </>
    )
}

export default CancelReservaDialog;