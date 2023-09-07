import moment from "moment";
import CommonImage from "../util/image/CommonImage";
import { getFullName } from "@/core/util";
import Loading from "../util/loaders/Loading";
import { Order, OrderQueue } from "@/core/type/enums";


const ReservaList = ({reservas,loading,order,changeOrder}:{
    reservas:Reserva[]
    loading:boolean
    changeOrder:(order:ReservaOrder)=>void
    order?:ReservaOrder
}) =>{
    
    return(
        <div className={`grid relative ${loading && "h-20"}`}>
            <Loading
            loading={loading}
            className="absolute top-12 left-1/2 -translate-x-1/2"
            />
             <table className="w-full shadow-xl">
        <thead className=" bg-gray-200 text-left noselect">
            <tr>
                <th className="headerTable w-72">
                    Usuario
                </th>
                <th className="headerTable">
                    Precio Total
                </th>
                <th className="headerTable">
                    Precio pagado
                </th>
                <th className=" headerTable  cursor-pointer" onClick={()=>{
                    if(order == undefined) return
                    changeOrder({
                        ...order,
                        queue:OrderQueue.RESERVA_CREATED
                    })
                    }}>
                    <div className="flex space-x-2 items-center">
                  <span>Fecha de la reserva</span>
                  {order?.queue == OrderQueue.RESERVA_CREATED ?
                  order?.order == Order.DESC ?
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" focusable="false" aria-hidden="true" className="h-5 w-5"><path d="M4 5h8l-4 6-4-6z"></path></svg>
                  :
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" focusable="false" aria-hidden="true"><path d="M4 11h8L8 5l-4 6z"></path></svg>
                    :
                    <svg className="h-5 w-5 opacity-40" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 16 16" focusable="false" aria-hidden="true"><path  d="M4 5h8l-4 6-4-6z"></path></svg>
                }
                </div>
                </th>
                <th className="headerTable flex space-x-2 items-center cursor-pointer" onClick={()=>{
                    if(order == undefined) return
                    changeOrder({
                        ...order,
                        queue:OrderQueue.CREATED
                    })
                    }}>
                    <span>Fecha de creación</span>
                    {order?.queue == OrderQueue.CREATED ?
                    order?.order == Order.DESC ?
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" focusable="false" aria-hidden="true" className="h-5 w-5"><path d="M4 5h8l-4 6-4-6z"></path></svg>
                    :
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" focusable="false" aria-hidden="true"><path d="M4 11h8L8 5l-4 6z"></path></svg>
                    :
                    <svg className="h-5 w-5 opacity-40" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 16 16" focusable="false" aria-hidden="true"><path  d="M4 5h8l-4 6-4-6z"></path></svg>
                }
                {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" focusable="false" aria-hidden="true"><path  d="M4 5h8l-4 6-4-6z"></path></svg> */}
                </th>
            </tr>
        </thead>
        <tbody>
        {reservas.map((item,index)=>{
                return(
                    <tr key={item.id} className={`${index % 2 && "bg-gray-100"}`}>
                        <td className="flex space-x-2 items-center rowTable ">
                        <CommonImage
                        src={item.profile_photo || "/images/profile.png"}
                        h={30}
                        w={30}
                        className="rounded-full"
                        />
                        <span className="rowTable truncate ">{getFullName(item.nombre,item.apellido)}</span>
                        </td>
                        <td className="rowTable">{item.total_price}</td>
                        <td className="rowTable">{item.paid}</td>
                        <td className="rowTable">{moment(item.start_date).utc().format('ll')} de
                         {moment(item.start_date).utc().format('LT')} a {moment(item.end_date).utc().format('LT')}</td>
                         <td className="rowTable">{moment(item.created_at).format("lll")}</td>
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

export default ReservaList;