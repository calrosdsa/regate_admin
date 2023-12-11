import moment from "moment";
import CommonImage from "../util/image/CommonImage";
import { getFullName } from "@/core/util";
import Loading from "../util/loaders/Loading";
import { Order, OrderQueue, ReservaEstado } from "@/core/type/enums";
import Link from "next/link";
import { getRouteEstablecimiento } from "@/core/util/routes";



const UserListTable = ({usersEmpresa,loading,uuid,selectUser}:{
    usersEmpresa:UserEmpresa[]
    selectUser:(userEmpresa:UserEmpresa)=>void
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
                    <tr key={item.id} 
                     className={`${index % 2 && "bg-gray-100"}`}>
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
                        <td className="rowTable font-medium underline text-primary cursor-pointer">
                                {/* <Link href={getRouteEstablecimiento(uuid,`users/${item.uuid}?id=${item.id}&name=${item.name}&phone=${item.phone_number}`)}
                                className="rowTable font-medium underline text-primary cursor-pointer">Ver</Link> */}
                            <svg onClick={()=>selectUser(item)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="icon-button noSelect">
                            <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                            <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
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

export default UserListTable;