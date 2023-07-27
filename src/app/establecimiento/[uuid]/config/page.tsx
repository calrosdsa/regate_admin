"use client"
import Script from 'next/script'
import { useEffect, useState } from 'react';
import '../../../../style/mapbox.css'
import { MapComponent } from '@/components/register/MapComponent';
import { useAppDispatch, useAppSelector } from '@/context/reduxHooks';
import { uiActions } from '@/context/slices/uiSlice';
import { getEstablecimiento } from '@/core/repository/establecimiento';
import EditComponent from '@/components/util/input/EditComponent';
import EditComponentImage from '@/components/util/input/EditComponentImage';
import { PaidType } from '@/core/type/enums';
import { getIntervaloString, getPaymentMethod } from '@/core/util/converter';
import AddHorarioIntervalDialog from '@/components/establecimiento/setting/AddHorarioIntervalDialog';
import DeleteHorarioIntervalDialog from '@/components/establecimiento/setting/DeleteHorarioIntervalDialog';

const Page = ({ params }: { params: { uuid: string } }) =>{
    const [openMap,setOpenMap] = useState(false)
    const [data,setData] = useState<EstablecimientoDetail | null>(null)
    const [openAddIntervalDialog,setOpenAddIntervalDialog] = useState(false)
    const [openDeleteIntervalDialog,setOpenDeleteIntervalDialog] = useState(false)

    // const {establecimiento,setting_establecimiento} = data as EstablecimientoDetail
    const dispatch = useAppDispatch()
    const loaded = useAppSelector(state=>state.ui.loaded)
    
    const getEstablecimientoDetail = async() =>{
        const res =await getEstablecimiento(params.uuid)
        setData(res)
        // console.log(data)
    }

    useEffect(()=>{
        getEstablecimientoDetail()
    },[])
    return(
       <>
       <div className='grid xl:grid-cols-2 gap-2'>
        {/* <button onClick={()=>setOpenMap(true)}>Open Map</button> */}
        {data?.establecimiento != null &&
        <div className='p-4 grid gap-y-4'>
            <span className="text-xl py-2 font-medium">Establecimiento Info</span>
            <EditComponent
            label='Nombre'
            content={data?.establecimiento.name}
            />
            <EditComponent
            label='Número de Telefono'
            content={data?.establecimiento.phone_number}
            />
            <EditComponent
            label='Email'
            content={data?.establecimiento.email}
            />

            <div className=" flex justify-between items-center space-x-5">
                <div className="grid">
                    <span className="label">Ubicación</span>
                    <span className="text-sm">{data?.establecimiento.address}</span>
                </div>
                <span onClick={()=>setOpenMap(true)} className=" underline font-medium cursor-pointer">Edit</span>
            </div>


            <EditComponentImage
            label="Portada"
            src={data?.establecimiento.portada}
            />
            <EditComponentImage
            label="Portada"
            src={data?.establecimiento.photo}
            />
            {openMap&&
                <MapComponent 
                loaded={loaded} setLoaded={(b:boolean)=>dispatch(uiActions.setLoaded(b))}
                open={openMap} close={()=>setOpenMap(false)}
                lng={Number(data?.establecimiento.longitud)}
                lat={Number(data?.establecimiento.latitud)}
                address={data?.establecimiento.address}
                setAddress={(e)=>{}}
                />
            }
        </div>
        }

        {data?.setting_establecimiento != undefined &&
            <div className='p-4 flex flex-col gap-y-4'>
            <span className="text-xl py-2 font-medium">Establecimiento Ajustes</span>
            <span className='label'>Metodo de pago</span>
            <div className='flex flex-wrap gap-3'>
            {data?.setting_establecimiento.paid_type.map((item)=>{
                return(
                    <span className='card w-min whitespace-nowrap'>{getPaymentMethod(item)}</span>
                )
            })}
             <div  onClick={()=> setOpenAddIntervalDialog(true)} className='card flex space-x-1 items-center bg-primary text-white'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
  <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
            <span className='label'>Añadir</span>
            </div>
            </div>

            {data?.setting_establecimiento.paid_type.includes(PaidType.DEFERRED_PAYMENT) &&
                <EditComponent
                label='Porcentaje para recervar una cancha'
                content={`${data?.setting_establecimiento.payment_for_reservation}%`}
                />
            }

            <span className='label'>Intervalos de Tiempo para Reservar</span>
            <div className='flex flex-wrap gap-3'>
            {data?.setting_establecimiento.horario_interval.sort((a,b)=>a.minutes-b.minutes).map((item)=>{
                return(
                    <div key={item.minutes} className='card'>
                        <span className='label'>{getIntervaloString(item.minutes)}</span>
                    </div>
                )
            })}
            <div  onClick={()=> setOpenAddIntervalDialog(true)} className='card flex space-x-1 items-center bg-primary text-white'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
  <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
            <span className='label'>Añadir</span>
            </div>

            <div  onClick={()=> setOpenDeleteIntervalDialog(true)} className='card flex space-x-1 items-center bg-primary text-white'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
  <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
            </svg>
            <span className='label'>Delete</span>
            </div>
            </div>
            </div>
        }
       </div>   
       {(openAddIntervalDialog && data?.setting_establecimiento != undefined) &&
       <AddHorarioIntervalDialog
       open={openAddIntervalDialog}
       close={()=>setOpenAddIntervalDialog(false)}
       intervalHorario={data?.setting_establecimiento.horario_interval}
       setting_id={data.setting_establecimiento.uuid}
       appendIntervals={(d)=>setData({
        ...data,
        setting_establecimiento:{
            ...data?.setting_establecimiento,
            horario_interval:[...data?.setting_establecimiento.horario_interval,...d]
        }})}
        />
    }
       {(openDeleteIntervalDialog && data?.setting_establecimiento != undefined) &&
        <DeleteHorarioIntervalDialog
        open={openDeleteIntervalDialog}
        close={()=>setOpenDeleteIntervalDialog(false)}
        intervalHorario={data?.setting_establecimiento.horario_interval}
        appendIntervals={(d)=>setData({
         ...data,
         setting_establecimiento:{
             ...data?.setting_establecimiento,
             horario_interval:d
        }})}
        />
    }
       </>
    )
}

export default Page;