"use client"
import CommonImage from "@/components/util/image/CommonImage"
import Loading from "@/components/util/loaders/Loading"
import { getInstalacionById } from "@/core/repository/instalacion"
import { GetEstablecimientoSalas } from "@/core/repository/sala"
import moment from "moment"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"


export default function Page({ params }: { params: { uuid: string } }){
    const searchParams = useSearchParams();
    const salaId = searchParams.get("id")
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    const pathname = usePathname();
    const router = useRouter()
    const [loading,setLoading] = useState(false)
    const [salas,setSalas] = useState<Sala[]>([])
    const [currentSala,setCurrentSala] = useState<Sala | null>(null)
    const [instalacion,setInstalacion] = useState<Instalacion | null>(null)
    const getSalas = async() =>{
        try{
            setSalas([])
            setLoading(true)
            const res:SalaPaginationResponse = await GetEstablecimientoSalas(params.uuid)
            setSalas(res.results)
            if(res.results.length > 0){
                if(salaId != null){
                    const sala = res.results.find(item => item.uuid == salaId)
                    if(sala != undefined){
                        selectSala(sala)
                    }
                }else{
                    selectSala(res.results[0])
                }
            }
            setLoading(false)
        }catch(err){
            setLoading(false)
            console.log(err)
        }
    }

    const selectSala = async(sala:Sala) =>{
            try{
                current.set("id",sala.uuid);
                const search = current.toString();
                const query = search ? `?${search}` : "";
                router.push(`${pathname}${query}`);
                setCurrentSala(sala)
                const instalacion:Instalacion = await getInstalacionById(sala.instalacion_id)
                setInstalacion(instalacion)
            }catch(err){
                console.log(err)
            }
        }
    

    useEffect(()=>{
        console.log("GETTING_SALAS")
        getSalas()
    },[])

    return (
        <div className="px-2 h-screen w-full">

        <div className="flex flex-col xl:grid xl:grid-cols-7 h-full gap-2 w-full">

            <div className=" col-span-2 bg-white  rounded-lg shadow-lg p-2 relative h-56 xl:h-full">
                <div className="flex justify-between items-center border-b-2 pb-2">
                <span className="headline">Salas</span>
                <button className="button w-min h-10" disabled={loading} onClick={()=>{
                    setSalas([])
                    getSalas()
                    }}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z" clipRule="evenodd" />
                                </svg>
                                </button>
                </div>
                <Loading
              loading={loading}
              className='pt-2 flex w-full justify-center'
              />
              <div className="flex overflow-x-auto xl:grid xl:overflow-hidden">
                {salas.map((item,idx)=>{
                    return(
                        <div onClick={()=>selectSala(item)} className={`hover:bg-gray-200 w-[500px] xl:w-full p-2
                        flex justify-between cursor-pointer items-center border-b-[1px]
                        ${currentSala?.id == item.id && "bg-gray-200"}`} key={idx}>
                            <div className="grid">
                                <span className="subtitle ">{item.titulo}</span>
                                <div className="flex items-center space-x-1">
                                <span className="text-xs font-semibold">{item.users}/{item.cupos}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" 
                                className="w-4 h-4">
                                <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
                               </svg>
                                </div>
                                <span className="text-xs font-semibold whitespace-nowrap">Se jugara:{moment(item.horas[0]).format("ll")} de {' '}
                                {moment(item.horas[0]).format("LT")} a {' '}
                                {moment(item.horas[item.horas.length -1]).add(30,'minutes').format("LT")} </span>
                            </div>
                        </div>
                    )
                })}
            </div>
            </div>


            <div className="col-start-3 w-full col-span-full bg-white  rounded-lg shadow-lg p-2 relative h-full">
                {/* {loading && <Loader className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"/> } */}

                <div className="flex w-full md:w-2/3 md:mx-auto justify-between items-center px-2 ">
                    {currentSala != null &&
                         <div className="flex flex-col w-full">
                                <span className="title line-clamp-1 ">{currentSala.titulo}</span>
                                <span className="h-5"/>
                                <span className="label">Descripcion de la sala</span>
                                <p className="text-xs py-2">{currentSala.descripcion}</p>

                                <div className="h-56">

                                {instalacion != null &&
                                <div className="w-full sm:w-96 relative">
                                    <CommonImage
                                    src={instalacion.portada}
                                    h={300}
                                    w={300}
                                    className="w-full sm:w-96 object-cover rounded-lg h-40 sm:h-48"
                                    />
                                    <div className="flex justify-between space-x-4 items-center py-2">
                                    <Link href={`/establecimiento/${params.uuid}/instalaciones?id=${instalacion.uuid}`}
                                    className="underline font-semibold cursor-pointer text-sm
                                 line-clamp-1">{instalacion.name}</Link>

                                    <div className="flex w-40 space-x-2 items-center border-[1px] p-1 rounded-lg cursor-default">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" 
                                    className="w-3 h-3">
       <path fillRule="evenodd" d="M5.25 2.25a3 3 0 00-3 3v4.318a3 3 0 00.879 2.121l9.58 9.581c.92.92 2.39 1.186 3.548.428a18.849 18.849 0 005.441-5.44c.758-1.16.492-2.629-.428-3.548l-9.58-9.581a3 3 0 00-2.122-.879H5.25zM6.375 7.5a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-xs font-medium">{instalacion.category_name}</span>
                                    </div>

                                    </div>
                                </div>
                                }
                                </div>

                                
                                {/* Fecha en la que  */}
                                
                                <div className=" my-5 ">
                                <div className=" flex justify-between items-center space-x-10 border-b-[1px] py-2">
                                        <span className="label">Fecha y hora en la que se jugará</span>
                                        <span className="text-xs font-semibold sm:whitespace-nowrap">{moment(currentSala.horas[0]).format("ll")} de {' '}
                                {moment(currentSala.horas[0]).format("LT")} a {' '}
                                {moment(currentSala.horas[currentSala.horas.length -1]).add(30,'minutes').format("LT")} </span>
                                    </div>

                                    <div className=" flex justify-between items-center space-x-10 border-b-[1px] py-2">
                                        <span className="label">Precio de la Sala</span>
                                        <span className="text-xs font-semibold">{currentSala.precio}</span>
                                    </div>

                                    <div className=" flex justify-between items-center space-x-10 border-b-[1px] py-2">
                                        <span className="label">Cantidad pagada</span>
                                        <span className="text-xs font-semibold">{currentSala.paid}</span>
                                    </div>

                                    <div className=" flex justify-between items-center space-x-10 border-b-[1px] py-2">
                                        <span className="label">Cantidad de cupos</span>
                                        <span className="text-xs font-semibold">{currentSala.cupos}</span>
                                    </div>

                                    <div className=" flex justify-between items-center space-x-10 border-b-[1px] py-2">
                                        <span className="label">Usuarios</span>
                                        <span className="text-xs font-semibold">{currentSala.users}</span>
                                    </div>
                                </div>
                                {/* <span className="text-xs font-semibold">{currentSala.precio}/{currentSala.paid}</span> */}
                            </div>
                    }
                    {/* {currentUser != null &&
                    <div className="grid w-full">
                        <span className="font-medium text-lg w-10/12 truncate">{currentUser.username}</span>
                        <span className="text-xs">{currentUser.email}</span>
                    </div>
                } */}

            
                </div>

            </div>
        </div>
        </div>
    )
}