"use client"
import ReservaList from "@/components/reservas/ReservaList";
import { getEstablecimientoReservas } from "@/core/repository/reservas";
import { useEffect, useState } from "react";


const Page = ({params}:{params:{uuid:string}}) => {
    const [reservas ,setReservas ] = useState<Reserva[]>([])
    const getReservas = async() =>{
        const res =await getEstablecimientoReservas(params.uuid)
        setReservas(res)
    }
    useEffect(()=>{
        getReservas()
    },[])

    return(
        <div className="p-2">
            <ReservaList
            reservas={reservas}
            />
            {/* {JSON.stringify(reservas)} */}
        </div>
    )
}

export default Page;