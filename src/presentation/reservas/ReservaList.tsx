import moment from "moment";
import CommonImage from "../util/image/CommonImage";
import { getFullName } from "@/core/util";
import { Order, OrderQueueReserva, ReservaEstado } from "@/data/model/types/enums";
import TruncateText from "../util/text/TruncateText";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import { StyledTableCell, StyledTableRow } from "../util/table/StyleTableCell";
import LinearProgressMui from "../util/loaders/LinnearProgressMui";
import VisibilityIcon from '@mui/icons-material/Visibility';

export const getEstadoReserva = (estado:ReservaEstado)=>{
    switch(estado){
        case ReservaEstado.Valid:
            return "Pagada"
        case ReservaEstado.Pendiente:
            return "Pendiente"
        case ReservaEstado.Cancel:
            return "Cancelada"
    }
}

const ReservaList = ({reservas,loading,order,changeOrder,getReservaDetail}:{
    reservas:Reserva[]
    loading:boolean
    getReservaDetail:(id:number)=>void
    changeOrder:(order:ReservaOrder)=>void
    order:ReservaOrder
}) =>{
    

    return(
        <div className={`relative`}>
            <LinearProgressMui
            loading={loading}
            />
             <Paper sx={{ width: '100%'}} elevation={2}>
             <TableContainer>
             <Table
            aria-labelledby="tableTitle"
          >
            <TableHead>
            <TableRow>
            <StyledTableCell></StyledTableCell>

                <StyledTableCell 
                align="left"
                sortDirection={order?.order == Order.DESC ? "desc" : false}
                >
                     <TableSortLabel
                    active={order?.queue == OrderQueueReserva.USERNAME_ORDER}
                    direction={order?.order == Order.DESC ? "desc" : 'asc'}
                    onClick={()=>{
                        if(order == undefined) return
                        changeOrder({
                            ...order,
                            queue:OrderQueueReserva.USERNAME_ORDER
                        })
                    }}
                    >
                    Usuarios
                 
                    </TableSortLabel>
                    
                </StyledTableCell>
                <StyledTableCell align="left">
                    Cancha
                </StyledTableCell>
                <StyledTableCell align="left" className="whitespace-nowrap">
                    Precio Total
                </StyledTableCell>
                <StyledTableCell align="left" className=" whitespace-nowrap">
                    Saldo por Pagar
                </StyledTableCell>
                <StyledTableCell align="left" className=" whitespace-nowrap">
                    Monto Pagado
                </StyledTableCell>
                <StyledTableCell align="left">
                    Estado
                </StyledTableCell>

                <StyledTableCell 
                align="left"
                sortDirection={order?.order == Order.DESC ? "desc" : false}
                >
                     <TableSortLabel
                    active={order?.queue == OrderQueueReserva.RESERVA_CREATED}
                    direction={order?.order == Order.DESC ? "desc" : 'asc'}
                    onClick={()=>{
                        if(order == undefined) return
                        changeOrder({
                            ...order,
                            queue:OrderQueueReserva.RESERVA_CREATED
                        })
                    }}
                    >
                    Fecha de la reserva
                   
                    </TableSortLabel>
                    
                </StyledTableCell>

                <StyledTableCell 
                align="left"
                sortDirection={order?.order == Order.DESC ? "desc" : false}
                >
                     <TableSortLabel
                    active={order?.queue == OrderQueueReserva.CREATED}
                    direction={order?.order == Order.DESC ? "desc" : 'asc'}
                    onClick={()=>{
                        if(order == undefined) return
                        changeOrder({
                            ...order,
                            queue:OrderQueueReserva.CREATED
                        })
                    }}
                    >
                    Fecha de creación
                   
                    </TableSortLabel>
                    
                </StyledTableCell>
                <StyledTableCell></StyledTableCell>

            </TableRow>
            </TableHead>

            <TableBody>
            {reservas.map((item,index)=>{
                return(
                   <StyledTableRow key={index}>
                        <StyledTableCell >{index + 1}.-</StyledTableCell>
                        <StyledTableCell align="left">
                            <div className="flex space-x-2 items-center mr-2" >
                        <CommonImage
                        src={item.profile_photo || "/images/profile.png"}
                        h={30}
                        w={30}
                        className="w-8 h-8 rounded-full bg-gray-200"
                        />
                        <TruncateText
                        maxLength={30}
                        text={getFullName(item.nombre,item.apellido)}
                        classNameText=" truncate"
                        />
                        </div>
                        </StyledTableCell>
                        <StyledTableCell align="left" >
                        <TruncateText
                        maxLength={30}
                        text={item.instalacion_name}
                        classNameText=" truncate"
                        />
                        </StyledTableCell>
                        <StyledTableCell align="left">
                        {Math.round(item.total_price * 100) / 100} BOB
                        </StyledTableCell>
                        <StyledTableCell className="rowTable">{item.total_price > item.paid ? Math.round((item.total_price-item.paid)*100)/100: "0"} BOB</StyledTableCell>
                        <StyledTableCell className="rowTable">{Math.round(item.paid * 100) / 100} BOB</StyledTableCell>
                        <StyledTableCell className="rowTable">{getEstadoReserva(item.estado)}</StyledTableCell>
                        <StyledTableCell className="rowTable">{moment(item.start_date).utc().format('ll')} de {" "}
                         {moment(item.start_date).utc().format('LT')} a {moment(item.end_date).utc().format('LT')}</StyledTableCell>
                         <StyledTableCell className="rowTable">{moment(item.created_at).format("lll")}</StyledTableCell>
                        <StyledTableCell>
                            <IconButton 
                            data-testid={`see-reserva-detail-${index}`}
                            size="small" color="primary" onClick={()=>getReservaDetail(item.id)}>
                                <VisibilityIcon fontSize="inherit"/>
                            </IconButton>
                        </StyledTableCell>
                  </StyledTableRow>
                )
            })}
            </TableBody>
          </Table>

             </TableContainer>
             </Paper>
           
        </div>
    )   
}

export default ReservaList;


// return(
//     <div className={`relative ${loading && "h-20"}`}>
//         <Loading
//         loading={loading}
//         className="absolute top-12 left-1/2 -translate-x-1/2"
//         />
//          <table className="w-full shadow-xl">
//     <thead className=" bg-gray-200 text-left noselect">
//         <tr className="">
//             <th className="headerTable w-10">
//             </th>
//             <th className="headerTable w-72" onClick={()=>{
//                 if(order == undefined) return
//                 changeOrder({
//                     ...order,
//                     queue:OrderQueue.USERNAME_ORDER
//                 })
//                 }}>
//                  <div className="flex space-x-2 items-center">
//               <span>Usuario</span>
//               {order?.queue == OrderQueue.USERNAME_ORDER ?
//               order?.order == Order.DESC ?
//               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" focusable="false" aria-hidden="true" className="h-5 w-5"><path d="M4 5h8l-4 6-4-6z"></path></svg>
//               :
//               <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" focusable="false" aria-hidden="true"><path d="M4 11h8L8 5l-4 6z"></path></svg>
//                 :
//                 <svg className="h-5 w-5 opacity-40" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 16 16" focusable="false" aria-hidden="true"><path  d="M4 5h8l-4 6-4-6z"></path></svg>
//             }
//             </div>
//             </th>
//             <th className="headerTable">
//                 Cancha
//             </th>
//             <th className="headerTable">
//                 Precio Total
//             </th>
//             <th className="headerTable">
//                 Saldo por pagar
//             </th>
//             <th className="headerTable">
//                 Monto pagado
//             </th>
//             <th className="headerTable">
//                 Estado
//             </th>
//             <th className=" headerTable  cursor-pointer" onClick={()=>{
//                 if(order == undefined) return
//                 changeOrder({
//                     ...order,
//                     queue:OrderQueue.RESERVA_CREATED
//                 })
//                 }}>
//                 <div className="flex space-x-2 items-center">
//               <span>Fecha de la reserva</span>
//               {order?.queue == OrderQueue.RESERVA_CREATED ?
//               order?.order == Order.DESC ?
//               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" focusable="false" aria-hidden="true" className="h-5 w-5"><path d="M4 5h8l-4 6-4-6z"></path></svg>
//               :
//               <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" focusable="false" aria-hidden="true"><path d="M4 11h8L8 5l-4 6z"></path></svg>
//                 :
//                 <svg className="h-5 w-5 opacity-40" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 16 16" focusable="false" aria-hidden="true"><path  d="M4 5h8l-4 6-4-6z"></path></svg>
//             }
//             </div>
//             </th>
//             <th className="headerTable flex space-x-2 items-center cursor-pointer" onClick={()=>{
//                 if(order == undefined) return
//                 changeOrder({
//                     ...order,
//                     queue:OrderQueue.CREATED
//                 })
//                 }}>
//                 <span>Fecha de creación</span>
//                 {order?.queue == OrderQueue.CREATED ?
//                 order?.order == Order.DESC ?
//                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" focusable="false" aria-hidden="true" className="h-5 w-5"><path d="M4 5h8l-4 6-4-6z"></path></svg>
//                 :
//                 <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" focusable="false" aria-hidden="true"><path d="M4 11h8L8 5l-4 6z"></path></svg>
//                 :
//                 <svg className="h-5 w-5 opacity-40" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 16 16" focusable="false" aria-hidden="true"><path  d="M4 5h8l-4 6-4-6z"></path></svg>
//             }
//             {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" focusable="false" aria-hidden="true"><path  d="M4 5h8l-4 6-4-6z"></path></svg> */}
//             </th>
//             <th className="headerTable">
//             </th>
//         </tr>
//     </thead>
//     <tbody>
//     {reservas.map((item,index)=>{
//             return(
//                 <tr key={item.id} className={`${index % 2 && "bg-gray-100"}`}>
//                     <td className="rowTable font-medium">{index + 1}.-</td>
//                     <td className="flex space-x-2 items-center rowTable ">
//                     <CommonImage
//                     src={item.profile_photo || "/images/profile.png"}
//                     h={30}
//                     w={30}
//                     className="rounded-full w-9 h-9"
//                     />
//                     <TruncateText
//                     maxLength={30}
//                     text={getFullName(item.nombre,item.apellido)}
//                     classNameText="rowTable truncate"
//                     />
//                     </td>

//                     <td className="rowTable">
//                             <TruncateText
//                             maxLength={20}
//                             text={item.instalacion_name}
//                             classNameText="rowTable"
//                             />
//                     </td>

//                     <td className="rowTable">{Math.round(item.total_price * 100) / 100} BOB</td>
//                     <td className="rowTable">{item.total_price > item.paid ? Math.round((item.total_price-item.paid)*100)/100: "0"} BOB</td>
//                     <td className="rowTable">{Math.round(item.paid * 100) / 100} BOB</td>
//                     <td className="rowTable">{getEstadoReserva(item.estado)}</td>
//                     <td className="rowTable">{moment(item.start_date).utc().format('ll')} de
//                      {moment(item.start_date).utc().format('LT')} a {moment(item.end_date).utc().format('LT')}</td>
//                      <td className="rowTable">{moment(item.created_at).format("lll")}</td>
//                     <td 
//                     className="rowTable noSelect">
//                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" 
//                                 className="w-[26px] h-[26px] noSelect icon-button text-primary"
//                                 onClick={()=>getReservaDetail(item.id)}>
//                                 <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
//                                 <path fillRule="evenodd" d="M1.38 8.28a.87.87 0 0 1 0-.566 7.003 7.003 0 0 1 13.238.006.87.87 0 0 1 0 .566A7.003 7.003 0 0 1 1.379 8.28ZM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" clipRule="evenodd" />
//                                 </svg>
//                     </td>
//                 </tr>
//             )
//         })}

        
       
      
//         {/* {data.map((item)=>{
//             return(
//         <tr className="bg-white border-b">
//             <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
//                 <Link href={`./establecimiento/${item.uuid}`}>
//                 {item.name}
//                 </Link>
//             </th>
//             <td className="px-6 py-4">
//                 Silver
//             </td>
//         </tr>
//    )})} */}

//     </tbody>
// </table>
       
       
//     </div>