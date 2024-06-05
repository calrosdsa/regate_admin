import { ReservaType } from "@/data/model/types/enums"
import Calendar from "../../../eventos/components/calendar/Calendar"

const EventoCalendarioTab = (props:{
    uuid:string
    uuidEvento:string
    eventoId:number
    eventoName:string
    usersEvento:UserEmpresa[]
}) => {
    return (
        <Calendar
        uuid={props.uuid}
        uuidEvent={props.uuidEvento}
        eventoName={props.eventoName}
        reserva_type={ReservaType.Evento}
        eventoId={props.eventoId}
        usersEvento={props.usersEvento}
      />
    )
}

export default EventoCalendarioTab;