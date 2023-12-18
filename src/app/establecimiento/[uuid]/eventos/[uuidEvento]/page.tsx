"use client"

import Calendar from "@/components/eventos/calendar/Calendar";
import { hours } from "@/context/actions/chart-actions";
import { ReservaType } from "@/core/type/enums";
import { getRouteEstablecimiento } from "@/core/util/routes";
import moment from "moment";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

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

                <div className="flex pt-2 items-center">
                    <button className="button flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                    </svg>
                        <span>Añadir cancha</span>
                        </button>
                </div>

                <Calendar
                uuid={params.uuid}
                uuidEvent={params.uuidEvento}
                reserva_type={ReservaType.Evento}
                />


                </div>
            </div>
        </>
    )
}

export default Page;