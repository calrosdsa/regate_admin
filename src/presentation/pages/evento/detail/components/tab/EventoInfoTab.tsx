import { Box, Button, Card, CardActionArea, Container, IconButton, ListItemText, Typography } from "@mui/material";
import { formatDateTime } from "@/core/util";
import { useEffect, useState } from "react";
import { EditEvento } from "@/core/repository/evento";
import { toast } from "react-toastify";
import { successfulMessage, unexpectedError } from "@/context/config";
import { eventoEstados } from "@/core/util/data";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import EditIcon from '@mui/icons-material/Edit';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { getRouteEstablecimiento } from "@/core/util/routes";
import EditComponent from "@/presentation/util/input/EditComponent";
import EditComponentSelect from "@/presentation/util/input/EditComponentSelect";
import EditUserEmpresaDialog from "@/presentation/user/dialog/EditUserEmpresaDialog";
import { getEstadoEvento } from "../../../eventos/components/EventoListTable";
import LaunchIcon from '@mui/icons-material/Launch';
import Link from "next/link";
const EventoInfoTab = ({
    eventoDetail,uuid,updateEventoDetail
}:{
    eventoDetail:EventoDetail
    uuid:string
    updateEventoDetail:(e:EventoDetail)=>void
}) =>{
    const {evento,users} = eventoDetail
    const [eventoData,setEventoData] = useState(evento)
    const [openEditUserDialog,setOpenEditUserDialog] = useState(false)
    const [userEmpresa,setUserEmpresa] = useState<UserEmpresa | undefined>(undefined)

    const editEvento = async(addLoader:()=>void,removeLoader:()=>void,name:string,value:string) =>{
        try{
            addLoader()
            const d  = {
                ...eventoData,
                [name]:name == "estado" ? Number(value) : value
            }
            const body:EditEventoRequest = {
                uuid:d.uuid,
                id:d.id,
                name:d.name,
                estado:Number(d.estado),
                description:d.description,
                establecimiento_uuid:uuid
            }
            console.log(d)
            await EditEvento(body)
            setEventoData(d)
            updateEventoDetail({
                ...eventoDetail,
                evento:d
            })
            toast.success(successfulMessage)
            removeLoader()
        }catch(err){
            removeLoader()
            toast.error(unexpectedError)
            console.log(err)
        }
    }

    useEffect(()=>{
        setEventoData(evento)
    },[evento])

    return (
        <>
            {(openEditUserDialog && userEmpresa != undefined) && 
                <EditUserEmpresaDialog
                open={openEditUserDialog}
                close={()=>setOpenEditUserDialog(false)}
                userEmpresa={userEmpresa}
                onUpdate={(name,phone)=>{
                    const updateUser = {...userEmpresa,name:name,phone_number:phone}
                    const updateUserList= users.map(item=> {
                        if(item.id == updateUser.id){
                            item = updateUser
                        }
                        return item
                    })
                    updateEventoDetail({
                        ...eventoDetail,
                        users:updateUserList
                    })
                }}/>
            }
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
            <EditComponentSelect
             label='Estado del Evento'
             items={eventoEstados}
             getItems={()=>{}}
             updateSelect={(value,addLoader,removeLoader)=>editEvento(addLoader,removeLoader,"estado",value)}
             currentSelected={{value:eventoData.estado.toString(),name:getEstadoEvento(eventoData.estado)}}
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

            <Box sx={{width:"100%",}} >
                    <Typography variant="h6">
                    Organizador(es)
                    </Typography>
                </Box>

                <List>
                    {users.map((item,idx)=>{
                        return(
                            <ListItem key={idx}
                            secondaryAction={
                                <Box sx={{display:"flex"}}  >
                                <IconButton edge="end" size="small"
                                onClick={()=>{
                                    setUserEmpresa(item)
                                    setOpenEditUserDialog(true)
                                }}
                                aria-label="edit" sx={{mr:1}}>
                                  <EditIcon />
                                </IconButton>
                                <IconButton edge="end" aria-label="see" size="small"
                                LinkComponent={Link}  target="_blank"
                                 href={getRouteEstablecimiento(uuid,`users/${item.uuid}?id=${item.id}&name=${item.name}&phone=${item.phone_number}`)}>
                                  <LaunchIcon />
                                </IconButton>
                                </Box>
                              }>
                                <ListItemText primary={item.name} secondary={item.phone_number}/>
                            </ListItem>
                    )
                })}
                </List>

            </Card>
            </Container>
        </>
    )
}

export default EventoInfoTab;