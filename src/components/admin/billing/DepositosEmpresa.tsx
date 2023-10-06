import Loading from "@/components/util/loaders/Loading"
import { Order, OrderQueue } from "@/core/type/enums"
import { adminRoutes } from "@/core/util/routes"
import moment from "moment"
import Link from "next/link"

const DepositosEmpresa = ({loading,changeOrder,order,depositos,getDepositosFromDepositoEmpresa}:{
    depositos:DepositoEmpresa[]
    loading:boolean
    changeOrder:(order:Order)=>void
    getDepositosFromDepositoEmpresa:(id:number)=>void
    order?:Order
}) =>{

    return(

        <>

<div className={`relative overflow-auto w-full ${loading && "h-20"}`}>
            <Loading
            loading={loading}
            className="absolute top-12 left-1/2 -translate-x-1/2"
            />
             <table className="w-full shadow-xl">
        <thead className=" bg-gray-200 text-left noselect">
            <tr>
                <th className="headerTable w-10">
                </th>
                
                    
                <th className=" headerTable  cursor-pointer w-64">
                    <div className="flex space-x-2 items-center">
                  <span>Fecha del depósito</span>
                    {/* {order == Order.DESC ?
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" focusable="false" aria-hidden="true" className="h-5 w-5"><path d="M4 5h8l-4 6-4-6z"></path></svg>
                    :
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" focusable="false" aria-hidden="true"><path d="M4 11h8L8 5l-4 6z"></path></svg>
                    } */}
                </div>
                </th>

                <th className="headerTable  cursor-pointer w-64 flex ">Ingreso</th>
                {/* <th className="headerTable w-28">
                    Monto 
                </th>
                <th className="headerTable">
                    Detalle
                </th> */}
                <th className="headerTable"></th>
                <th className="headerTable"></th>
            </tr>
        </thead>
        <tbody>
        {depositos.map((item,index)=>{
                return(
                    <>
                    <tr key={item.id} className={`${index % 2 && "bg-gray-100"}`}>
                        <td onClick={()=>getDepositosFromDepositoEmpresa(item.id)}
                         className="rowTable font-medium ">
                             {/* <svg aria-hidden="true" 
                             className="w-4 h-4  text-gray-100 animate-spin  fill-gray-600" 
                             viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 64.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                            </svg> */}
                            {item.depositos == undefined ?
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                            className="w-5 h-5  border-[1px] border-gray-600 text-gray-600">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                        </svg>
                        :
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                        className="w-5 h-5  border-[1px] border-gray-600 text-gray-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
                        </svg>

                        }
                        </td>
                        <td className="rowTable w-64 font-medium">{moment(item.created_at).utc().format("LL")}</td>

                        <td className="rowTable font-medium  w-64  flex  justify-start space-x-1">
                            <div className="grid grid-cols-2 gap-x-1">
                                <span className=" place-self-end">{item.total_income}</span>
                                <span className=" place-self-start">BOB</span>
                            </div>
                        </td>

                        <td></td>
                        <td></td>

                        {/* <td className="rowTable w-28">{item.income}</td> */}
                        {/* <td className="rowTable">{item.gloss}</td> */}

                        {/* <td onClick={()=>{}}
                        className="rowTable font-medium underline text-primary cursor-pointer">
                            <Link href={`${adminRoutes.depositos}/${item.uuid}?gloss=${item.gloss}`}>Ver reporte</Link>
                            </td> */}

                    </tr>

                            {item.depositos != undefined &&
                                item.depositos.map((item,index)=>{
                                    return(
                                        <tr key={index} className={`${index % 2 && "bg-gray-100 "}`}>
                                            <td></td>
                                            <td className="rowTable w-64 pl-6">{moment(item.created_at).utc().format("LL")}</td>

                                            <td className="rowTable  w-64 pl-6 flex  justify-start space-x-1">
                                                <div className="grid grid-cols-2 gap-x-1">
                                                    <span className=" place-self-end">{item.income}</span>
                                                    <span className=" place-self-start">BOB</span>
                                                </div>
                                            </td>

                                        <td className="rowTable">{item.establecimiento_name}</td>
                                        <td onClick={()=>{}}
                                        className="rowTable font-medium underline text-primary cursor-pointer">
                                            <Link href={`${adminRoutes.depositos}/${item.uuid}?gloss=${item.gloss}`}>Ver reporte</Link>
                                        </td>

                                        </tr>
                                    )
                                })}
                    </>
                )
            })}
        </tbody>
    </table>
           
           
        </div>
        </>
    )
}

export default DepositosEmpresa;