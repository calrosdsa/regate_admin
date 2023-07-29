"use client"
import Script from 'next/script'
import { useEffect, useState } from 'react';
import '../../../../style/mapbox.css'
import { MapComponent } from '@/components/register/MapComponent';
import { useAppDispatch, useAppSelector } from '@/context/reduxHooks';
import { uiActions } from '@/context/slices/uiSlice';
import { UpdateEstablecimiento, UpdateEstablecimientoAddress, UpdateEstablecimientoPhoto, getEstablecimiento } from '@/core/repository/establecimiento';
import EditComponent from '@/components/util/input/EditComponent';
import EditComponentImage from '@/components/util/input/EditComponentImage';
import { PaidType } from '@/core/type/enums';
import { getIntervaloString, getPaymentMethod } from '@/core/util/converter';
import AddHorarioIntervalDialog from '@/components/establecimiento/setting/AddHorarioIntervalDialog';
import DeleteHorarioIntervalDialog from '@/components/establecimiento/setting/DeleteHorarioIntervalDialog';
import { GetAmenities, GetAmenitiesEstablecimiento, GetRules, GetRulesEstablecimiento } from '@/core/repository/labels';
import Image from 'next/image';
import AddAndDeleteButtons from '@/components/util/button/AddAndDeleteButtons';
import AddAmenityDialog from '@/components/labels/amenities/AddAmenityDialog';
import Amenity from '@/components/labels/amenities/Amenity';
import DeleteAmenityDialog from '@/components/labels/amenities/DeleteAmenityDialog';
import AddRuleDialog from '@/components/labels/rules/AddRuleDialog';
import DeleteRuleDialog from '@/components/labels/rules/DeleteRuleDialog';
import { toast } from 'react-toastify';
import UploadImage from '@/components/util/input/UploadImage';

const Page = ({ params }: { params: { uuid: string } }) =>{
    const [openMap,setOpenMap] = useState(false)
    const [data,setData] = useState<EstablecimientoDetail | null>(null)
    const [openAddIntervalDialog,setOpenAddIntervalDialog] = useState(false)
    const [openDeleteIntervalDialog,setOpenDeleteIntervalDialog] = useState(false)
    const [amenitiesEstablecimiento,setAmenitiesEstablecimiento ] = useState<Label[]>([])
    const [rulesEstablecimiento,setRulesEstablecimiento] = useState<Label[]>([])
    const [amenities,setAmenities] = useState<Label[]>([])
    const [rules,setRules] = useState<Label[]>([])
    const [openAddAmenityDialog,setOpenAddAmenityDialog] = useState(false)
    const [openDeleteAmenityDialog,setOpenDeleteAmenityDialog] = useState(false)
    const [openAddRuleDialog,setOpenAddRuleDialog] = useState(false)
    const [openDeleteRuleDialog,setOpenDeleteRuleDialog] = useState(false)
    const [photo,setPhoto] = useState<File | undefined>(undefined)
    
    // const {establecimiento,setting_establecimiento} = data as EstablecimientoDetail
    const dispatch = useAppDispatch()
    const loaded = useAppSelector(state=>state.ui.loaded)

    const openAmenityDialog=async()=>{
        try{
            dispatch(uiActions.setLoaderDialog(true))
            const res:Label[] = await GetAmenities()
            const newAmenities = res.filter(item=>!amenitiesEstablecimiento.map(it=>it.id).includes(item.id))
            setAmenities(newAmenities)
            setOpenAddAmenityDialog(true)
            dispatch(uiActions.setLoaderDialog(false))
        }catch(err){
            dispatch(uiActions.setLoaderDialog(false))
        }
    }
    const openRuleDialog = async() => {
        try{
            dispatch(uiActions.setLoaderDialog(true))
            const res:Label[] = await GetRules()
            const newRules = res.filter(item=>!rulesEstablecimiento.map(it=>it.id).includes(item.id))
            setRules(newRules)
            setOpenAddRuleDialog(true)
            dispatch(uiActions.setLoaderDialog(false))
        }catch(err){
            dispatch(uiActions.setLoaderDialog(false))
        }
    }

    const getEstablecimientoAmenities = async(id:number) =>{
        const res:Label[] = await GetAmenitiesEstablecimiento(id)
        setAmenitiesEstablecimiento(res)
    }
    const getEstablecimientoRules = async(id:number) =>{
        const res:Label[] = await GetRulesEstablecimiento(id)
        setRulesEstablecimiento(res)
    }

    
    const getEstablecimientoDetail = async() =>{
        try{
            const res:EstablecimientoDetail =await getEstablecimiento(params.uuid)
            console.log(res)
            getEstablecimientoAmenities(res.establecimiento.id)
            getEstablecimientoRules(res.establecimiento.id)
            setData(res)

        }catch(err){
            console.log(err)
        }
        // console.log(data)
    }
    const updateEstablecimiento = async(name:string,value:string,addLoader:()=>void,removeLoader:()=>void) =>{
        if(data?.establecimiento.id != null){   
            try{
                addLoader()
                const req = JSON.stringify({[name]:value})
                console.log(JSON.stringify(req))
                const res = await UpdateEstablecimiento(req,data?.establecimiento.id)
                console.log(res)
                setData({
                    ...data,
                    establecimiento:{
                        ...data.establecimiento,
                        [name]:value
                    }
                })
                removeLoader()
                toast.success("¡Los cambios realizados han sido guardados exitosamente!")
            }catch(err){
                removeLoader()
                toast.error("¡Los cambios realizados han sido guardados exitosamente!")
            }
        }
    }

    const uploadImage = async(setLoading:(e:boolean)=>void) =>{
        if(photo != undefined && data?.establecimiento != undefined){
            try{
                setLoading(true)
                const formData = new FormData()
                formData.append("photo",photo)
                formData.append("uuid",data?.establecimiento.uuid)
                formData.append("id",data?.establecimiento.id.toString())
                const res:string = await UpdateEstablecimientoPhoto(formData)
                setData({
                    ...data,
                    establecimiento:{
                        ...data.establecimiento,
                        photo:res
                    }
                })
                setLoading(false)
                setOpenMap(false)
                toast.success("¡Los cambios realizados han sido guardados exitosamente!")
            }catch(err){
                setLoading(false)
                console.log(err)
                toast.error("¡Los cambios realizados han sido guardados exitosamente!")
            }
        }
    }
    const updateAddress = async(lng:string,lat:string,address:string,setLoading:(bool:boolean)=>void) =>{
        if(data?.establecimiento != undefined){
            try{
                setLoading(true)
                const req = JSON.stringify({ 
                    longitud:lng.toString(),
                    latitud:lat.toString(),
                    address,
                    id:data.establecimiento.id
                 })
                console.log("PAYLOAD",req)
                const res = await UpdateEstablecimientoAddress(req)
                console.log(res)
                setData({
                    ...data,
                    establecimiento:{
                        ...data.establecimiento,
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
            console.log(err)
            toast.error("¡Los cambios realizados han sido guardados exitosamente!")
        }
    }
    }

    useEffect(()=>{
        getEstablecimientoDetail()
    },[])
    return(
       <>
       <div className='grid xl:grid-cols-2 gap-2 h-screen'>
        {/* <button onClick={()=>setOpenMap(true)}>Open Map</button> */}
        {data?.establecimiento != null &&
        <div className='p-4 flex flex-col space-y-6'>
            <span className="text-xl py-2 font-medium">Establecimiento Info</span>
            <EditComponent
            label='Nombre'
            content={data?.establecimiento.name}
            edit={(addLoader,removeLoader,e)=>updateEstablecimiento("name",e,addLoader,removeLoader)}
            />
            <EditComponent
            label='Número de Telefono'
            content={data?.establecimiento.phone_number}
            edit={(addLoader,removeLoader,e)=>updateEstablecimiento("phone_number",e,addLoader,removeLoader)}
            />

            <EditComponent
            label='Email'
            content={data?.establecimiento.email}
            edit={(addLoader,removeLoader,e)=>updateEstablecimiento("email",e,addLoader,removeLoader)}
            />

            <div className=" flex justify-between items-center space-x-5">
                <div className="grid">
                    <span className="label">Ubicación</span>
                    <span className="text-sm">{data?.establecimiento.address}</span>
                </div>
                <span onClick={()=>setOpenMap(true)} className=" underline font-medium cursor-pointer">Edit</span>
            </div>

            <UploadImage
            setFile={(e)=>setPhoto(e)}
            src={data?.establecimiento.photo}
            save={(setLoading)=>uploadImage(setLoading)}
            />
       
            {openMap&&
                <MapComponent 
                loaded={loaded} 
                setLoaded={(b:boolean)=>dispatch(uiActions.setLoaded(b))}
                open={openMap}
                close={()=>setOpenMap(false)}
                lng={Number(data?.establecimiento.longitud)}
                lat={Number(data?.establecimiento.latitud)}
                address={data?.establecimiento.address}
                setAddress={(e)=>{
                    console.log("ADDRESS ----",e)
                    setData({...data,establecimiento:{
                        ...data.establecimiento,
                        address:e
                    }})
                }}
                update={(lng,lat,address,setLoading)=>updateAddress(lng,lat,address,setLoading)}
                />
            }
        </div>
        }

        {data?.setting_establecimiento != undefined &&
            <div className='p-4 flex flex-col gap-y-4 overflow-auto'>
            <span className="text-xl py-2 font-medium">Establecimiento Ajustes</span>
            <span className='label'>Metodo de pago</span>
            <div className='flex flex-wrap gap-3'>   
            {data?.setting_establecimiento.paid_type != null &&
            data?.setting_establecimiento.paid_type.map((item)=>{
                return(
                    <span key={item} className='card w-min whitespace-nowrap'>{getPaymentMethod(item)}</span>
                )
            })}
             <div  onClick={()=> setOpenAddIntervalDialog(true)} className='card flex space-x-1 items-center bg-primary text-white'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
  <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
            <span className='label'>Añadir</span>
            </div>
            </div>

            {data?.setting_establecimiento.paid_type != null &&
            data?.setting_establecimiento.paid_type.includes(PaidType.DEFERRED_PAYMENT) &&
                <EditComponent
                label='Porcentaje para recervar una cancha'
                content={`${data?.setting_establecimiento.payment_for_reservation}%`}
                edit={(e)=>{}}
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
            <AddAndDeleteButtons
            onAddButtonClick={()=> setOpenAddIntervalDialog(true)}
            onDeleteButtonClick={()=>setOpenDeleteIntervalDialog(true)}
            />
            </div>


            <div className='grid gap-y-3'>
            <span className="text-xl py-2 font-medium">Comodidades y Reglas del Establecimiento</span>
            <span className='label'>Comodidades</span>
           <div className='flex flex-wrap gap-3'>
            {amenitiesEstablecimiento.map((item)=>{ return <Amenity key={item.id} item={item}/>})}
            <AddAndDeleteButtons
            onAddButtonClick={()=> openAmenityDialog()}
            onDeleteButtonClick={()=>setOpenDeleteAmenityDialog(true)}
            />
            </div>
            <span className='label'>Reglas</span>

            <div>
            {rulesEstablecimiento.map((item)=>{
                return(
                    <li key={item.id} className=' py-1'>{item.name}</li>
                    )
                })}
             <div className='flex space-x-2'>
            <AddAndDeleteButtons
            onAddButtonClick={()=> openRuleDialog()}
            onDeleteButtonClick={()=>setOpenDeleteRuleDialog(true)}
            />
            </div>   
            </div>

            </div>

            </div>
        }


       </div>   
       {(openDeleteRuleDialog && rulesEstablecimiento.length != 0 && data?.establecimiento != undefined) &&
       <DeleteRuleDialog
       rules={rulesEstablecimiento}
       open={openDeleteRuleDialog}
       close={()=>setOpenDeleteRuleDialog(false)}
       establecimientoId={data?.establecimiento.id}
       setNewRulesEstablecimiento={(e)=>setRulesEstablecimiento(e)}
       />
       }
       {(openAddRuleDialog && rulesEstablecimiento.length != 0 && data?.establecimiento != undefined) &&
       <AddRuleDialog
       rules={rules}
       open={openAddRuleDialog}
       close={()=>setOpenAddRuleDialog(false)}
       establecimientoId={data?.establecimiento.id}
       setNewRulesEstablecimiento={(e)=>setRulesEstablecimiento(e)}
       />
       }
       {(openDeleteAmenityDialog && amenitiesEstablecimiento.length != 0 && data?.establecimiento != undefined) &&
       <DeleteAmenityDialog
       amenities={amenitiesEstablecimiento}
       open={openDeleteAmenityDialog}
       close={()=>setOpenDeleteAmenityDialog(false)}
       establecimientoId={data?.establecimiento.id}
       setNewAmenitiesEstablecimiento={(e)=>setAmenitiesEstablecimiento(e)}
       />
       }
       {(openAddAmenityDialog && amenities.length != 0 && data?.establecimiento != undefined) &&
       <AddAmenityDialog
       amenities={amenities}
       open={openAddAmenityDialog}
       close={()=>setOpenAddAmenityDialog(false)}
       establecimientoId={data?.establecimiento.id}
       setNewAmenitiesEstablecimiento={(e)=>setAmenitiesEstablecimiento(e)}
       />
       }
       
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