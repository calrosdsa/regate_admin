import InstalacionesDialog from "@/components/establecimiento/instalacion/dialog/InstalacionesDialog"
import ButtonWithLoader from "@/components/util/button/ButtonWithLoader"
import ConfirmationDialog from "@/components/util/dialog/ConfirmationDialog"
import DialogCalendar from "@/components/util/dialog/DialogCalendar"
import DialogLayout from "@/components/util/dialog/DialogLayout"
import InputWithIcon from "@/components/util/input/InputWithIcon"
import { fetchInstalaciones } from "@/context/actions/data-actions"
import { unexpectedError } from "@/context/config"
import { useAppDispatch, useAppSelector } from "@/context/reduxHooks"
import { CancelReserva } from "@/core/repository/reservas"
import { ReservaType } from "@/core/type/enums"
import { Button, Typography } from "@mui/material"
import moment from "moment"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"


const CancelReservaDialog = ({open,close,update,reserva,uuid,instalacion,getReservas}:{
    open:boolean
    reserva:Reserva
    instalacion:Instalacion
    uuid:string
    close:()=>void
    update:()=>void
    getReservas:()=>void
}) =>{
    const dispatch = useAppDispatch()
    const instalaciones = useAppSelector(state=>state.data.instalaciones)
    const [openConfirmationDialog,setOpenConfirmationDialog] = useState(false)
    const [loading,setLoading] = useState(false)
    const [value,setValue] = useState("")
    const [openCalendar,setOpenCalendar] = useState(false)
    const [date,setDate] = useState<moment.Moment | null>(null)
    const [selectedInstalacion,setSelectedInstalacion] = useState(instalacion)
    const [openInstalacionesDialog,setOpenInstalacionesDialog] = useState(false)

    const onChange = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setValue(e.target.value)
    }

    const cancelarReserva = async() => {
        try{
            setLoading(true)
            let reasignarReservaRequest:ReasignarReservaRequest | null = null;
            if(date != null){
                const start = moment(reserva.start_date)
                const end = moment(reserva.end_date)
                const duration = moment.duration(end.diff(start));
                const minutes = duration.asMinutes();
                const selectedDate = date.format("YYYY-MM-DD")
                console.log(selectedDate)
                const time = start.utc().format("hh:mm")
                console.log(time)
                const newDatetime = selectedDate + " " + time
                console.log(newDatetime)
                const newStart = moment(selectedDate + " " + time)
                console.log(newStart.format())  
                let cupos:CupoR[] = []
                if(minutes >0){
                    const loops = (minutes/30)
                    for(let i = 0;i < loops;i++){
                        console.log("INDEX",i)
                        const cupo:CupoR = {
                            instalacion_id:selectedInstalacion.id,
                            precio:reserva.paid/loops,
                            start_date:newStart.add(30*i,"minutes").format()
                        }
                        cupos.push(cupo)
                    }
                    console.log("MINUTES",minutes)
                }
                if(cupos.length >0){
                reasignarReservaRequest = {
                    cupo_interval:{
                        interval:cupos,
                        paid:reserva.paid,
                        total:reserva.total_price
                    },
                    evento_id:reserva.evento.id,
                    evento_uuid:reserva.evento.uuid
                }   
                }   
                console.log("Cupos",reasignarReservaRequest)
            }   
            const request:ReservaCancelRequest = {
                content:value,
                establecimiento_id:reserva.establecimiento_id,
                establecimiento_uuid:uuid,
                reserva_uuid:reserva.uuid,
                reserva_type:reserva.reserva_type,
                reserva_id:reserva.id,  
                user_id:reserva.user_id,
                reasignar_reserva_request:reasignarReservaRequest,
            }
            console.log(request)
             await CancelReserva(request)
             if(reasignarReservaRequest != null ){
                getReservas()
             }
             setLoading(false)
             update()
             close()
            toast.success("Reserva Cancelada")
        }catch(err){
            setLoading(false)
            toast.error(unexpectedError)
        }
    }

    useEffect(()=>{
            dispatch(fetchInstalaciones(uuid))
    },[])

    return(
        <>
        {openInstalacionesDialog &&
        <InstalacionesDialog
        instalaciones={instalaciones}
        onAccept={(e)=>{
            setSelectedInstalacion(e)
            setOpenInstalacionesDialog(false)
        }}
        openModal={openInstalacionesDialog}
        closeModal={()=>setOpenInstalacionesDialog(false)}
        />
        }
        {openCalendar &&
        <DialogCalendar
        value={date}
        openModal={openCalendar}
        closeModal={()=>setOpenCalendar(false)}
        onAccept={(e)=>{
            setDate(e)
        }}
        />
        }
        {openConfirmationDialog &&
        <ConfirmationDialog
        open={openConfirmationDialog}
        close={()=>setOpenConfirmationDialog(false)}
        description={ reserva.reserva_type == ReservaType.App?`Al cancelar la reserva, se notificará al usuario que su reserva ha sido cancelada y se le reembolsará el monto gastado.`
        :"Al continuar con la acción requerida, se cancelará la reserva."}
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
                multiline={true}
                maxLenght={255}
                label="Motivo de cancelación de la reserva."
                />

               
                <>
                {date != null &&
                    <div className="mt-3">
                    <Typography fontWeight={500}>La reserva se reasignara para la siguiente fecha</Typography>
                    <Typography>
                    {moment.utc(date).format("ll")} de {' '}
                    {moment.utc(reserva.start_date).format("LT")} a {' '}
                    {moment.utc(reserva.end_date).format("LT")} 
                    </Typography>

                    <Typography fontWeight={500}>Cancha</Typography>
                    <div className="flex space-x-3">
                    <Typography>{selectedInstalacion.name}</Typography>
                    <Button size="small" onClick={()=>setOpenInstalacionesDialog(true)}>
                        <Typography variant="caption">
                            Seleccionar otra cancha
                        </Typography>
                    </Button>
                    </div>
                    </div>
                }
                    <Button sx={{mt:2}}
                    onClick={()=>setOpenCalendar(true)}>
                        Reasignar
                    </Button>

                    {date != null &&
                    <Button sx={{mt:2}}
                    onClick={()=>setDate(null)}>
                        Descartar
                    </Button>
                    }

                </>
                

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