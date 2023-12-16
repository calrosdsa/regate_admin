import moment from "moment";
import CommonImage from "../util/image/CommonImage";
import { getFullName } from "@/core/util";
import Loading from "../util/loaders/Loading";
import { Order, OrderQueue, ReservaEstado } from "@/core/type/enums";
import Link from "next/link";
import { getRouteEstablecimiento } from "@/core/util/routes";



const EventoListTable = ({evnetos,loading,uuid}:{
    evnetos:Evento[]
    // selectUser:(userEmpresa:UserEmpresa)=>void
    loading:boolean
    uuid:string
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
                    Descripcion 
                </th>
                {/* <th className="headerTable">
                    Precio pagado
                </th> */}
                
            
                <th className="headerTable">
                </th>
            </tr>
        </thead>
        <tbody>
        {evnetos.map((item,index)=>{
                return(
                    <tr key={index} 
                     className={`${index % 2 && "bg-gray-100"}`}>
                        <td className="rowTable font-medium">{index + 1}.-</td>
                        <td className="flex space-x-2 items-center rowTable ">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd" />
                        </svg>

                        <span className="rowTable truncate ">{item.name}</span>
                        </td>
                        <td className="rowTable ">{item.description}</td>
                        {/* <td className="rowTable">{item.name}</td> */}
                        <td className="rowTable">
                                <Link href={getRouteEstablecimiento(uuid,`eventos/${uuid}?name=${item.name}&id=${item.id}`)}
                                className="font-medium underline text-primary cursor-pointer">Ver</Link>

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