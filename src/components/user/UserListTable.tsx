import moment from "moment";
import CommonImage from "../util/image/CommonImage";
import { getFullName } from "@/core/util";
import Loading from "../util/loaders/Loading";
import { Order, OrderQueue, ReservaEstado } from "@/core/type/enums";



const UserListTable = ({usersEmpresa,loading}:{
    usersEmpresa:UserEmpresa[]
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
                <th className="headerTable w-72">
                    Usuario
                </th>
                <th className="headerTable">
                    Numero de telefono
                </th>
                {/* <th className="headerTable">
                    Precio pagado
                </th> */}
                
            
                <th className="headerTable">
                </th>
            </tr>
        </thead>
        <tbody>
        {usersEmpresa.map((item,index)=>{
                return(
                    <tr key={item.id} className={`${index % 2 && "bg-gray-100"}`}>
                        <td className="rowTable font-medium">{index + 1}.-</td>
                        <td className="flex space-x-2 items-center rowTable ">
                        <CommonImage
                        src={"/images/profile.png"}
                        h={30}
                        w={30}
                        className="rounded-full w-9 h-9"
                        />
                        <span className="rowTable truncate ">{item.name}</span>
                        </td>
                        <td className="rowTable">{item.phone_number}</td>
                        {/* <td className="rowTable">{item.name}</td> */}
                        <td 
                        className="rowTable font-medium underline text-primary cursor-pointer">Ver</td>
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

export default UserListTable;