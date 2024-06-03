import moment from "moment";
import { getFullName } from "@/core/util";
import { Order, OrderQueueReserva, ReservaEstado } from "@/core/type/enums";
import Link from "next/link";
import { getRouteEstablecimiento } from "@/core/util/routes";
import Loading from "@/presentation/util/loaders/Loading";
import { getEstadoReserva } from "@/presentation/reservas/ReservaList";
import { IconButton, Paper, Table, TableBody, TableContainer, TableHead, TableRow } from "@mui/material";
import { StyledTableCell, StyledTableRow } from "../util/table/StyleTableCell";
import LinearProgressMui from "../util/loaders/LinnearProgressMui";
import VisibilityIcon from '@mui/icons-material/Visibility';



const UserReservaTable = ({reservas,loading,selectReserva}:{
    reservas:Reserva[]
    selectReserva:(userEmpresa:Reserva)=>void
    loading:boolean
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
                            <StyledTableCell className="headerTable w-10">
                            </StyledTableCell>
                            <StyledTableCell className="headerTable">
                                Cancha
                            </StyledTableCell>
                            <StyledTableCell className="headerTable">
                                Precio Total
                            </StyledTableCell>
                            <StyledTableCell className="headerTable">
                                Precio pagado
                            </StyledTableCell>
                            <StyledTableCell className="headerTable">
                                Estado
                            </StyledTableCell>
                            <StyledTableCell className="headerTable">
                                Fecha de la reserva
                            </StyledTableCell>
                            <StyledTableCell className="headerTable">
                            </StyledTableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {reservas.map((item,index)=>{
                            return(
                                <StyledTableRow key={item.id} >
                                   <StyledTableCell>{index + 1}.-</StyledTableCell>
                                   <StyledTableCell>
                                    {item.instalacion_name}
                                   </StyledTableCell>
                                   <StyledTableCell>
                                {item.total_price}
                                   </StyledTableCell>
                                   <StyledTableCell>{item.paid}</StyledTableCell>
                                   <StyledTableCell>{getEstadoReserva(item.estado)}</StyledTableCell>
           
                                   <StyledTableCell>{moment(item.start_date).utc().format('ll')} de
                                    {moment(item.start_date).utc().format('LT')} a {moment(item.end_date).utc().format('LT')}</StyledTableCell>
           
                                   <StyledTableCell>
                                    <IconButton size="small" onClick={()=>selectReserva(item)}>
                                        <VisibilityIcon fontSize="small"/>
                                    </IconButton>
                                               {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" 
                                               className="w-[26px] h-[26px] noSelect icon-button text-primary"
                                               onClick={()=>selectReserva(item)}>
                                               <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                                               <path fillRule="evenodd" d="M1.38 8.28a.87.87 0 0 1 0-.566 7.003 7.003 0 0 1 13.238.006.87.87 0 0 1 0 .566A7.003 7.003 0 0 1 1.379 8.28ZM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" clipRule="evenodd" />
                                               </svg> */}
                                   </StyledTableCell>
                               </StyledTableRow>
                            )
                        })}
                        </TableBody>

                    </Table>
                </TableContainer>
            </Paper>
             {/* <table className="w-full shadow-xl">
        <thead className=" bg-gray-200 text-left noselect">
            <tr>
                <th className="headerTable w-10">
                </th>
                <th className="headerTable">
                    Precio Total
                </th>
                <th className="headerTable">
                    Precio pagado
                </th>
                <th className="headerTable">
                    Estado
                </th>
                <th className="headerTable">
                    Fecha de la reserva
                </th>
                
            
                <th className="headerTable">
                </th>
            </tr>
        </thead>
        <tbody>
        {reservas.map((item,index)=>{
                return(
                    <tr key={item.id} 
                     className={`${index % 2 && "bg-gray-100"}`}>
                        <td className="rowTable font-medium">{index + 1}.-</td>
                        <td className="flex space-x-2 items-center rowTable ">
                     
                        <span className="rowTable truncate ">{item.total_price}</span>
                        </td>
                        <td className="rowTable">{item.paid}</td>
                        <td className="rowTable">{getEstadoReserva(item.estado)}</td>

                        <td className="rowTable">{moment(item.start_date).utc().format('ll')} de
                         {moment(item.start_date).utc().format('LT')} a {moment(item.end_date).utc().format('LT')}</td>

                       
                        <td className="rowTable font-medium underline text-primary cursor-pointer 
                        noSelect">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" 
                                    className="w-[26px] h-[26px] noSelect icon-button text-primary"
                                    onClick={()=>selectReserva(item)}>
                                    <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                                    <path fillRule="evenodd" d="M1.38 8.28a.87.87 0 0 1 0-.566 7.003 7.003 0 0 1 13.238.006.87.87 0 0 1 0 .566A7.003 7.003 0 0 1 1.379 8.28ZM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" clipRule="evenodd" />
                                    </svg>
                        </td>
                    </tr>
                )
            })}
        </tbody>
    </table> */}
           
           
        </div>
    )   
}

export default UserReservaTable;