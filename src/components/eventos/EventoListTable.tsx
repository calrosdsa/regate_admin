import moment from "moment";
import CommonImage from "../util/image/CommonImage";
import { formatBlankorNull, formatDateTime, getFullName } from "@/core/util";
import Loading from "../util/loaders/Loading";
import { EventoEstado, Order, OrderQueue, ReservaEstado } from "@/core/type/enums";
import Link from "next/link";
import { getRouteEstablecimiento } from "@/core/util/routes";
import { Paper, Table, TableBody, TableContainer, TableHead, TableRow } from "@mui/material";
import { StyledTableCell, StyledTableRow } from "../util/table/StyleTableCell";
import LinearProgressMui from "../util/loaders/LinnearProgressMui";

export const getEstadoEvento = (estado:EventoEstado)=>{
    switch(estado){
        case EventoEstado.Valid:
            return "Pagado"
            case EventoEstado.Pendiente:
                return "Pendiente"
        case EventoEstado.Cancel:
            return "Cancelado"
        default:
            return "-"    
    }
}


const EventoListTable = ({eventos,loading,uuid,deleteEvento}:{
    eventos:Evento[]
    // selectUser:(userEmpresa:UserEmpresa)=>void
    loading:boolean
    uuid:string
    deleteEvento:(id:number) => void
}) =>{
    

    return(
        <div className={`relative`}>
            <LinearProgressMui
            loading={loading}
            />
            <Paper sx={{ width: '100%'}} elevation={2}>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell></StyledTableCell>
                            <StyledTableCell>
                                Evento
                            </StyledTableCell>
                            <StyledTableCell>
                                Precio Total
                            </StyledTableCell>
                            <StyledTableCell>
                                Monto Pagado
                            </StyledTableCell>
                            <StyledTableCell>
                                Estado
                            </StyledTableCell>
                            <StyledTableCell>
                                Fecha de Inicio
                            </StyledTableCell>
                            <StyledTableCell>
                                Fecha de Finalización
                            </StyledTableCell>
                            <StyledTableCell>
                            Horas totales
                            </StyledTableCell>
                            <StyledTableCell>
                            Organizador
                            </StyledTableCell>
                        </TableRow>
                    
                    </TableHead>
                    <TableBody>
                    {eventos.map((item,index)=>{
                        return(
                            <StyledTableRow key={index}>
                                <StyledTableCell>{index + 1}.-</StyledTableCell>
                                <StyledTableCell>
                                    <div className="flex items-center space-x-1 ">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                        <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd" />
                                        </svg>
                                        <Link data-testid={`evento-name-link-${index}`}
                                         href={getRouteEstablecimiento(uuid,`eventos/${item.uuid}?name=${item.name}&id=${item.id}`)} 
                                        className="rowTable truncate underline font-medium ">{item.name}</Link>
                                    </div>
                                </StyledTableCell>
                                <StyledTableCell>{formatBlankorNull(item.total_price)}</StyledTableCell>
                                <StyledTableCell>{formatBlankorNull(item.paid)}</StyledTableCell>
                                <StyledTableCell>{getEstadoEvento(item.estado)}</StyledTableCell>
                                <StyledTableCell>{formatDateTime(item.start_date)}</StyledTableCell>
                                <StyledTableCell>{formatDateTime(item.end_date)}</StyledTableCell>
                                <StyledTableCell>{formatBlankorNull(item.total_hours," hrs")}</StyledTableCell>
                                <StyledTableCell>{formatBlankorNull(item.organizador)}</StyledTableCell>


                                {/* <td className="rowTable">{item.name}</td> */}
                            </StyledTableRow>
                        )
                    })}
                    </TableBody>

             {/* <table className="w-full shadow-xl">
        <thead className=" bg-gray-200 text-left noselect">
            <tr>
                <th className="headerTable w-10">
                </th>
                <th className="headerTable w-72">
                    Evento
                </th>
                <th className="headerTable">
                    Precio total 
                </th>
                <th className="headerTable">
                    Monto pagado
                </th>
                <th className="headerTable">
                    Estado
                </th>
                <th className="headerTable">
                    Fecha de Inicio
                </th>
                <th className="headerTable">
                    Fecha de finalización
                </th>
                <th className="headerTable">
                    Horas totales
                </th>
                <th className="headerTable">
                    Organizador
                </th>
                <th className="headerTable">
                </th>
            </tr>
        </thead>
        <tbody>
        {eventos.map((item,index)=>{
                return(
                    <tr key={index} 
                     className={`${index % 2 && "bg-gray-100"}`}>
                        <td className="rowTable font-medium">{index + 1}.-</td>
                        <td className="flex space-x-2 items-center rowTable ">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd" />
                        </svg>

                        <Link href={getRouteEstablecimiento(uuid,`eventos/${item.uuid}?name=${item.name}&id=${item.id}`)} 
                        className="rowTable truncate underline font-medium ">{item.name}</Link>
                        </td>
                        <td className="rowTable ">{formatBlankorNull(item.total_price)}</td>
                        <td className="rowTable ">{formatBlankorNull(item.paid)}</td>
                        <td className="rowTable">{getEstadoEvento(item.estado)}</td>
                        <td className="rowTable ">{formatDateTime(item.start_date)}</td>
                        <td className="rowTable ">{formatDateTime(item.end_date)}</td>
                        <td className="rowTable ">{formatBlankorNull(item.total_hours," hrs")}</td>
                        <td className="rowTable ">{formatBlankorNull(item.organizador)}</td>
                    </tr>
                )
            })}

        </tbody>
    </table> */}

    
    </Table>
            </TableContainer>
            </Paper>
           
           
        </div>
    )   
}

export default EventoListTable;