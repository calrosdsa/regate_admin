import moment from "moment";
import CommonImage from "../util/image/CommonImage";


const ReservaList = ({reservas}:{
    reservas:Reserva[]
}) =>{

    return(
        <div className="grid">
             <table className="w-full shadow-xl">
        <thead className=" bg-gray-200 text-left">
            <tr>
                <th className="headerTable">
                    Usuario
                </th>
                <th className="headerTable">
                    Precio Total
                </th>
                <th className="headerTable">
                    Precio pagado
                </th>
                <th className=" headerTable">
                  Rango de Hora
                </th>
                <th className="headerTable">Creado el</th>
            </tr>
        </thead>
        <tbody>
        {reservas.map((item,index)=>{
                return(
                    <tr key={item.id} className={`${index % 2 && "bg-gray-100"}`}>
                        <td className="flex space-x-2 items-center rowTable">
                        <CommonImage
                        src={item.profile_photo || "/images/profile.png"}
                        h={30}
                        w={30}
                        className="rounded-full"
                        />
                        <span className="rowTable">{item.nombre + " "+ item.apellido || ""}</span>
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