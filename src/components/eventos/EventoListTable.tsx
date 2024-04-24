import moment from "moment";
import CommonImage from "../util/image/CommonImage";
import { formatBlankorNull, formatDateTime, getFullName } from "@/core/util";
import Loading from "../util/loaders/Loading";
import { Order, OrderQueue, ReservaEstado } from "@/core/type/enums";
import Link from "next/link";
import { getRouteEstablecimiento } from "@/core/util/routes";



const EventoListTable = ({eventos,loading,uuid,deleteEvento}:{
    eventos:Evento[]
    // selectUser:(userEmpresa:UserEmpresa)=>void
    loading:boolean
    uuid:string
    deleteEvento:(id:number) => void
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
                {/* <th className="headerTable">
                    Precio pagado
                </th> */}
                
            
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
                        <td className="rowTable ">{formatDateTime(item.start_date)}</td>
                        <td className="rowTable ">{formatDateTime(item.end_date)}</td>

                        {/* <td className="rowTable">{item.name}</td> */}
                        <td className="rowTable">
                            <div className="flex space-x-2 items-center">
                                <Link href={getRouteEstablecimiento(uuid,`eventos/${item.uuid}?name=${item.name}&id=${item.id}`)}
                                className="font-medium underline noSelect">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" 
                                    className="w-[26px] h-[26px] noSelect icon-button text-primary">
                                    <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                                    <path fillRule="evenodd" d="M1.38 8.28a.87.87 0 0 1 0-.566 7.003 7.003 0 0 1 13.238.006.87.87 0 0 1 0 .566A7.003 7.003 0 0 1 1.379 8.28ZM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" clipRule="evenodd" />
                                    </svg>

                                </Link>

                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                                 className="w-[26px] h-[26px] noSelect icon-button text-primary"
                                 onClick={()=>deleteEvento(item.id)}>
                                <path fillRule="evenodd" d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711Z" clipRule="evenodd" />
                                </svg>

                            </div>

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

export default EventoListTable;