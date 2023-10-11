import Loading from "@/components/util/loaders/Loading"
import { getDepositoEstadoName } from "@/core/repository/billing"
import { DepositoEstado, Order, OrderQueue } from "@/core/type/enums"
import { downloadFile } from "@/core/util"
import { adminRoutes, rootEstablecimiento } from "@/core/util/routes"
import moment from "moment"
import Link from "next/link"

const Depositos = ({loading,changeOrder,order,depositos,uuid}:{
    depositos:Deposito[]
    loading:boolean
    uuid:string
    changeOrder:(order:Order)=>void
    order?:Order
}) =>{

    return(
        <>

<div className={`relative w-full ${loading && "h-20"}`}>
            <Loading
            loading={loading}
            className="absolute top-12 left-1/2 -translate-x-1/2"
            />
             <table className="w-full shadow-xl">
        <thead className=" bg-gray-200 text-left noselect">
            <tr>
                <th className="headerTable w-10">
                </th>
                
                    
                <th className=" headerTable  cursor-pointer w-96">
                    <div className="flex space-x-2 items-center">
                  <span>Fecha del depósito</span>
                    {/* {order == Order.DESC ?
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" focusable="false" aria-hidden="true" className="h-5 w-5"><path d="M4 5h8l-4 6-4-6z"></path></svg>
                    :
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" focusable="false" aria-hidden="true"><path d="M4 11h8L8 5l-4 6z"></path></svg>
                    } */}
                </div>
                </th>
                <th className="headerTable w-28">
                    Monto 
                </th>
                <th className="headerTable">
                    Detalle
                </th>
                <th className="headerTable">
                Estado    
                </th>
                <th className="headerTable">

                </th>
                
            </tr>
        </thead>
        <tbody>
        {depositos.map((item,index)=>{
                return(
                    <tr key={item.id} className={`${index % 2 && "bg-gray-100"}`}>
                        <td className="rowTable font-medium">{index + 1}.-</td>
                        <td className="rowTable w-96">
                            <Link href={`${rootEstablecimiento}/${uuid}/depositos/detail?depositoUuid=${item.uuid}&gloss=${item.gloss}`}
                            className=" underline font-semibold">
                            {moment(item.created_at).utc().format("LL")}
                            </Link>
                            </td>
                        <td className="rowTable w-28">{item.income}</td>
                        <td className="rowTable">{item.gloss}</td>
                        <td className={`rowTable font-semibold
                        ${item.estado ==DepositoEstado.EMITIDO && "text-green-600"}
                        ${item.estado ==DepositoEstado.PENDIENTE && "text-gray-600"}
                        `}>
                            <div className="flex space-x-1 items-center">
                            {item.estado == DepositoEstado.PENDIENTE &&
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                            className="w-4 h-4 text-gray-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            }
                            {item.estado == DepositoEstado.EMITIDO &&
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                            className="w-4 h-4 text-green-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            }
                            <span>{getDepositoEstadoName(item.estado)}</span>
                            </div>
                        </td>

                        <td onClick={()=>{}}
                        className="rowTable font-medium underline text-primary cursor-pointer flex justify-center">
                            {/* <Link href={`${rootEstablecimiento}/${uuid}/depositos/detail?depositoUuid=${item.uuid}&gloss=${item.gloss}`}>Ver reporte</Link> */}
                            {item.comprobante_url != null &&
                            <button className=" flex space-x-2"
                            onClick={()=>{
                                if(item.comprobante_url == null) return
                                downloadFile(item.comprobante_url,`comprobante-${item.date_paid.slice(0,10)}-${item.id}.png`)
                            }}
                            disabled={item.comprobante_url == null}>
                            <span >Descargar comprobante</span>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-primary">
                            <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
                            <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
                            </svg>

                            </button>
                            }
                            </td>

                    </tr>
                )
            })}
        </tbody>
    </table>
           
           
        </div>
        </>
    )
}

export default Depositos;