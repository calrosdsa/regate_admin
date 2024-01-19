"use client"

import Calendar from "@/components/eventos/calendar/Calendar";
import { hours } from "@/context/actions/chart-actions";
import { ReservaType } from "@/core/type/enums";
import { getRouteEstablecimiento } from "@/core/util/routes";
import moment from "moment";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const Page = ({ params }: { params: { uuidEvento: string,uuid:string } }) =>{
    const searchParams = useSearchParams();
    const name = searchParams.get("name")
    const id = searchParams.get("id")
   
    return(
        <>
        <div className="p-2 overflow-auto h-screen">
            <div className="flex subtitle space-x-1">
                <Link href={getRouteEstablecimiento(params.uuid,"eventos")}  className="cursor-pointer underline">Eventos </Link>
                <span> {' > '} </span>
                <span className="text-primary cursor-pointer"> {name}</span>
            </div>
            <div className="pt-10 xl:pt-2">

                <div className="grid">
                <span className="text-xl">{name} 
                <span className="text-sm subtitle"> #{params.uuidEvento.slice(0,7)}</span>
                </span>
                </div>
                <div>
               </div>

                <Calendar
                uuid={params.uuid}
                uuidEvent={params.uuidEvento}
                reserva_type={ReservaType.Evento}
                eventoId={Number(id || 0)}
                />


                </div>
            </div>
        </>
    )
}

export default Page;

