"use client"

import { MapComponent } from "@/presentation/register/MapComponent";
import EditComponent from "@/presentation/util/input/EditComponent";
import { unexpectedError } from "@/context/config";
import { useAppDispatch, useAppSelector } from "@/context/reduxHooks";
import { uiActions } from "@/context/slices/uiSlice";
import { GetEmpresaDetail, UpdateEmpresaAddress, UpdateEmpresaDetail } from "@/core/repository/empresa";
import { Button, Typography } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Entidad = () =>{
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    const router = useRouter()
    const dispatch = useAppDispatch()
    const [empresaDetail,setEmpresaDetail] = useState<EmpresaDetail | null>()
    const [openMap,setOpenMap] = useState(false)
    const loaded = useAppSelector(state=>state.ui.loaded)
    const [loadingEmpresa,setLoadingEmpresa] = useState(false)

    const appendSerachParams = (key:string,value:string)=>{
        current.set(key,value);
        const search = current.toString();
        const query = search ? `?${search}` : "";
        router.push(`${pathname}${query}`);
    }

    const getEmpresaDetail = async() =>{
        try{
            setLoadingEmpresa(true)
            const res:EmpresaDetail = await GetEmpresaDetail()
            setEmpresaDetail(res)
            setLoadingEmpresa(false)
        }catch(err){
            setLoadingEmpresa(false)
            console.log(err)
        }
    }

    const updateEmpresa = async(name:string,value:string,addLoader:()=>void,removeLoader:()=>void) =>{
        if(empresaDetail != null){   
            try{
                addLoader()
                const req = JSON.stringify({[name]:value})
                // console.log(JSON.stringify(req))
                const res = await UpdateEmpresaDetail(req)
                setEmpresaDetail({
                    ...empresaDetail,
                    empresa:{
                        ...empresaDetail.empresa,
                        [name]:value
                    }
                })
                removeLoader()
                toast.success("¡Los cambios realizados han sido guardados exitosamente!")
            }catch(err){
                removeLoader()
                toast.error(unexpectedError)
            }
        }
    }

    const updateAddress = async(lng:string,lat:string,address:string,setLoading:(bool:boolean)=>void) =>{
        if(empresaDetail != null){
            try{
                setLoading(true)
                const req = JSON.stringify({ 
                    longitud:lng.toString(),
                    latitud:lat.toString(),
                    address:address,
                 })
                const res = await UpdateEmpresaAddress(req)
                setEmpresaDetail({
                    ...empresaDetail,
                    empresa:{
                        ...empresaDetail.empresa,
                        address:address,
                        longitud:lng,
                        latitud:lat
                    }
                })
                setOpenMap(false)
                setLoading(false)
                toast.success("¡Los cambios realizados han sido guardados exitosamente!")
        }catch(err){
            setLoading(false)
            toast.error("¡Los cambios realizados han sido guardados exitosamente!")
        }
    }
    }

    useEffect(()=>{
        getEmpresaDetail()
    },[])

    return(
        <>
            <div className='grid xl:grid-cols-2 gap-2 h-screen'>
            {empresaDetail != null &&
            <div className='p-4 flex flex-col space-y-6 xl:overflow-auto'>
            <span className="text-xl py-2 font-medium">Entidad Info</span>
            <EditComponent
            label='Nombre'
            content={empresaDetail.empresa.name}
            edit={(addLoader,removeLoader,e)=>updateEmpresa("name",e,addLoader,removeLoader)}
            />
            <EditComponent
            label='Número de Telefono'
            content={empresaDetail.empresa.phone_number || ""}
            type='tel'
            edit={(addLoader,removeLoader,e)=>updateEmpresa("phone_number",e,addLoader,removeLoader)}
            />

            <EditComponent
            label='Email'
            type='email'
            content={empresaDetail.empresa.email || ""}
            edit={(addLoader,removeLoader,e)=>updateEmpresa("email",e,addLoader,removeLoader)}
            />


        <div className=" flex justify-between items-center space-x-5">
            <div className="grid">
            <Typography fontWeight={500} fontSize={16.5}>Ubicación</Typography>
            <Typography variant="subtitle1" >{empresaDetail.empresa.address}</Typography>
              
            </div>
            <Button onClick={()=>{
                 setOpenMap(true)
                 appendSerachParams("map","1")
            }} color="inherit">
                        Editar
                    </Button>
           
        </div>
      

            </div>            
            }
            </div>

            
            {(openMap&& empresaDetail != null)&&
                <MapComponent
                loaded={loaded} 
                setLoaded={(b:boolean)=>dispatch(uiActions.setLoaded(b))}
                open={openMap}
                close={()=>setOpenMap(false)}
                lng={empresaDetail.empresa.longitud != undefined ? Number(empresaDetail.empresa.longitud) : -63.17996724474814 }
                lat={empresaDetail?.empresa.latitud != undefined ? Number(empresaDetail.empresa.latitud) : -17.782670771152922}
                address={empresaDetail.empresa.address || ""}
                setAddress={(e)=>{
                    setEmpresaDetail({
                        ...empresaDetail,
                        empresa:{
                            ...empresaDetail.empresa,
                            address:e
                        }
                    })
                }}
                update={(lng,lat,address,setLoading)=>updateAddress(lng,lat,address,setLoading)}
                />
            }
        </>
    )
}

export default Entidad;