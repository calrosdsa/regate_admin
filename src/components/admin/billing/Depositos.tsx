import Loading from "@/components/util/loaders/Loading"
import { Order, OrderQueue } from "@/core/type/enums"
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
                </th>
                
            </tr>
        </thead>
        <tbody>
        {depositos.map((item,index)=>{
                return(
                    <tr key={item.id} className={`${index % 2 && "bg-gray-100"}`}>
                        <td className="rowTable font-medium">{index + 1}.-</td>
                        <td className="rowTable w-96">{moment(item.created_at).utc().format("LL")}</td>
                        <td className="rowTable w-28">{item.income}</td>
                        <td className="rowTable">{item.gloss}</td>

                        <td onClick={()=>{}}
                        className="rowTable font-medium underline text-primary cursor-pointer">
                            <Link href={`${rootEstablecimiento}/${uuid}/depositos/detail?depositoUuid=${item.uuid}&gloss=${item.gloss}`}>Ver reporte</Link>
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