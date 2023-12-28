import moment from "moment";
import { getFullName } from "@/core/util";
import { Order, OrderQueue, ReservaEstado } from "@/core/type/enums";
import Link from "next/link";
import { getRouteEstablecimiento } from "@/core/util/routes";
import Loading from "@/components/util/loaders/Loading";
import { getEstadoReserva } from "@/components/reservas/ReservaList";



const UserReservaTable = ({reservas,loading,selectReserva}:{
    reservas:Reserva[]
    selectReserva:(userEmpresa:Reserva)=>void
    loading:boolean
}) =>{
    

    return(
        <div className={`relative ${loading && "h-20"}`}>
            <Loading
            loading={loading}
            className="absolute top-12 left-1/2 -translate-x-1/2"
            />
             <table className="w-full shadow-xl">
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
                {/* <th className="headerTable">
                    Precio pagado
                </th> */}
                
            
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

                        <td className="rowTable">{moment(item.start_date).utc().format('ll')}</td>


                        {/* <td className="rowTable">{item.name}</td> */}
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

            
           
          
            {/* {data.map((item)=>{
                return(
            <tr className="bg-white border-b">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    <Link href={`./establecimiento/${item.uuid}`}>
                    {item.name}
                    </Link>
                </th>
                <td className="px-6 py-4">
                    Silver
                </td>
            </tr>
       )})} */}

        </tbody>
    </table>
           
           
        </div>
    )   
}

export default UserReservaTable;