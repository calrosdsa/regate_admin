import { Box, Card, CardActionArea, Container, Typography } from "@mui/material";
import EditComponent from "../util/input/EditComponent";
import { formatDateTime } from "@/core/util";
import { useState } from "react";
import { EditEvento } from "@/core/repository/evento";
import { toast } from "react-toastify";
import { successfulMessage, unexpectedError } from "@/context/config";


const EventoDetail = ({
    evento,uuid,updateEvento
}:{
    evento:Evento
    uuid:string
    updateEvento:(e:Evento)=>void
}) =>{
    const [eventoData,setEventoData] = useState(evento)

    const editEvento = async(addLoader:()=>void,removeLoader:()=>void,name:string,value:string) =>{
        try{
            addLoader()
            const d  = {
                ...eventoData,
                [name]:value
            }
            const body:EditEventoRequest = {
                uuid:d.uuid,
                id:d.id,
                name:d.name,
                description:d.description,
                paid:Number(d.paid),
                should_update_amount:name == "paid",
                establecimiento_uuid:uuid
            }
            console.log(body)
            await EditEvento(body)
            setEventoData(d)
            updateEvento(d)
            toast.success(successfulMessage)
            removeLoader()
        }catch(err){
            removeLoader()
            toast.error(unexpectedError)
            console.log(err)
        }
    }

    return (
        <div>

            <Container maxWidth="md" sx={{mt:3}}>
            <Card sx={{p:{xs:1,sm:2}}}>
                <Box sx={{width:"100%",}} >
                    <Typography variant="h6">
                    Información del Evento
                    </Typography>
                </Box>
            <EditComponent
            label='Nombre del Evento'
            content={eventoData.name}
            edit={(addLoader,removeLoader,e)=>{
                editEvento(addLoader,removeLoader,"name",e)
            }}
            />
            <EditComponent
            label='Descripción del Evento'
            content={eventoData.description}
            multiline={true}
            edit={(addLoader,removeLoader,e)=>{
                editEvento(addLoader,removeLoader,"description",e)
            }}
            />
            <div className="grid md:grid-cols-2 gap-x-4">
             <EditComponent
            label='Precio Total'
            disabled={eventoData.total_price == null}
            content={eventoData.total_price?.toString() || "0"}
            enableEdit={false}
            />
             <EditComponent
            label='Monto pagado'
            disabled={eventoData.paid == null}
            content={eventoData.paid?.toString() || "0"}
            multiline={true}
            enableEdit={false}
            // edit={(addLoader,removeLoader,e)=>{
            //     editEvento(addLoader,removeLoader,"paid",e)
            // }}
            />
            <EditComponent
            label='Fecha de Inicio'
            content={formatDateTime(eventoData.start_date)}
            disabled={eventoData.paid == null}
            enableEdit={false}
            />
             <EditComponent
            label='Fecha de Finalizacion'
            disabled={eventoData.paid == null}
            content={formatDateTime(eventoData.end_date)}
            enableEdit={false}
            />
            </div>

            </Card>
            </Container>
        </div>
    )
}

export default EventoDetail;