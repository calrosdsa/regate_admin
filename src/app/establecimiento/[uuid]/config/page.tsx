"use client"
import Script from 'next/script'
import { useEffect, useState } from 'react';
import '../../../../style/mapbox.css'
import { MapComponent } from '@/components/register/MapComponent';
import { useAppDispatch, useAppSelector } from '@/context/reduxHooks';
import { uiActions } from '@/context/slices/uiSlice';
import { AddEstablecimientoPhoto, DeleteEstablecimientoPhoto, UpdateEstablecimiento, UpdateEstablecimientoAddress, UpdateEstablecimientoPhoto, getEstablecimiento } from '@/core/repository/establecimiento';
import EditComponent from '@/components/util/input/EditComponent';
import EditComponentImage from '@/components/util/input/EditComponentImage';
import { DepositoEstado, EstablecimientoEstado, PaidType, TypeEntity } from '@/core/type/enums';
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
import { UpdateSettings } from '@/core/repository/setting';
import UpdatePayMethodDialog from '@/components/establecimiento/setting/UpdatePayMethodDialog';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { appendSerachParams } from '@/core/util/routes';
import { successfulMessage, unexpectedError } from '@/context/config';
import CommonImage from '@/components/util/image/CommonImage';
import EditComponentSelect from '@/components/util/input/EditComponentSelect';
import { systemActions } from '@/context/slices/systemSlice';
import { InfoTextId } from '@/core/repository/core/system';
import { getInfoText } from '@/context/actions/system-actions';
import Photos from '@/components/util/image/Photos';
import { days } from '@/context/actions/chart-actions';
import AttentionScheduleComponent from '@/components/establecimiento/setting/AttentionScheduleComponent';
import TitleWithInfo from '@/components/util/info-bar/SubtitleWithInfo';
import Loading from '@/components/util/loaders/Loading';
import { Box, Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Item from '@/components/util/item/Item';

const Page = ({ params }: { params: { uuid: string } }) =>{
    const establecimientoEstados = [{value:"true",name:"Visible"}
    ,{value:"false",name:"No visible"}]
    const [openMap,setOpenMap] = useState(false)
    const searchParams = useSearchParams();
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    const pathname = usePathname()
    const router = useRouter()
    // const map = searchParams.get("map")
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
    const [openUpdateMethodDialog,setOpenUpdateMethodDialog] = useState(false)
    const [establecimientoPhoto,setEstablecimientoPhoto] = useState<File | undefined>(undefined)
    const [photo,setPhoto] = useState<File | undefined>(undefined)
    const [loading,setLoading] = useState(false)
    // const {establecimiento,setting_establecimiento} = data as EstablecimientoDetail
    const dispatch = useAppDispatch()
    const loaded = useAppSelector(state=>state.ui.loaded)
    const openInfoBar = useAppSelector(state=>state.system.openInfoBar)

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
            setLoading(true)
            const res:EstablecimientoDetail =await getEstablecimiento(params.uuid)
            const week = days.map(day=>{
                const scheduleDay = res.attention_schedule_week.find(item=>item.day_week == day.value)
                const schedule:AttentionSchedule = {
                    day_name:day.day,
                    day_week:day.value,
                    establecimiento_id:res.establecimiento.id,
                    id:scheduleDay?.id || 0,
                    schedule_interval:scheduleDay?.schedule_interval || [],
                    open:scheduleDay?.open || false,
                    closed:scheduleDay?.closed || false
                }
                return schedule
            })
            console.log("HORARIO",res.attention_schedule_week)
            getEstablecimientoAmenities(res.establecimiento.id)
            getEstablecimientoRules(res.establecimiento.id)
            setData({
                ...res,
                attention_schedule_week:week
            })
            setLoading(false)
        }catch(err){
            setLoading(false)
        }
        // console.log(data)
    }
    const updateEstablecimiento = async(name:string,value:string,addLoader:()=>void,removeLoader:()=>void) =>{
        if(data?.establecimiento.id != null){   
            try{
                addLoader()
                const req = JSON.stringify({[name]:value})
                const res = await UpdateEstablecimiento(req,data?.establecimiento.id)
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
                toast.error(unexpectedError)
            }
        }
    }

    const updateSettings = async(name:string,value:string,addLoader:()=>void,removeLoader:()=>void) =>{
        if(data?.establecimiento.id != null){   
            try{
                addLoader()
                const req = JSON.stringify({[name]:value})
                const res = await UpdateSettings(req,data?.establecimiento.id)
                setData({
                    ...data,
                    setting_establecimiento:{
                        ...data.setting_establecimiento,
                        [name]:value
                    }
                })
                removeLoader()
                toast.success(successfulMessage)
            }catch(err){
                removeLoader()
                toast.error(unexpectedError)
            }
        }
    }

    const uploadImage = async(setLoading:(e:boolean)=>void) =>{
        if(establecimientoPhoto != undefined && data?.establecimiento != undefined){
            try{
                setLoading(true)
                const formData = new FormData()
                formData.append("photo",establecimientoPhoto)
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
                // setOpenMap(false)
                toast.success(successfulMessage)
                // toast.success("¡Los cambios realizados han sido guardados exitosamente!")
            }catch(err){
                setLoading(false)
                toast.error(unexpectedError)
            }
        }
    }
    const addEstablecimientoPhoto = async(setLoading:(e:boolean)=>void) => {
        if(photo != undefined && data?.establecimiento != undefined){
        try{
            setLoading(true)
            const formData = new FormData()
            formData.append("file",photo)
            formData.append("uuid",data?.establecimiento.uuid)
            formData.append("establecimiento_id",data?.establecimiento.id.toString())
            const res:Photo = await AddEstablecimientoPhoto(formData)
            res.type_entity = TypeEntity.ENTITY_PHOTO
            setData({
                ...data,
                establecimiento_photos:[...data.establecimiento_photos,res]
            })
            setLoading(false)
            // setOpenMap(false)
            toast.success(successfulMessage)
            // toast.success("¡Los cambios realizados han sido guardados exitosamente!")
        }catch(err){
            setLoading(false)
            toast.error(unexpectedError)
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
                    uuid:params.uuid,
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
                toast.success(successfulMessage)
        }catch(err){
            setLoading(false)
            console.log(err)
            toast.error(unexpectedError)
        }
    }
    }
    const deleteEstablecimientoPhoto = async(setLoading:(e:boolean)=>void,d:Photo) =>{
        try{
            if(data == null) return
            setLoading(true)
            await DeleteEstablecimientoPhoto(d)
            const updatePhotoList = data.establecimiento_photos.filter(item=>item.id != d.id)
            setData({
                ...data,
                establecimiento_photos:updatePhotoList
            })
            toast.success(successfulMessage)
            setLoading(false)
        }catch(err){
            toast.error(unexpectedError)
            setLoading(false)
        }
    }
   

    useEffect(()=>{
        getEstablecimientoDetail()
    },[])
    useEffect(()=>{
        window.addEventListener("popstate",()=>{
                    setOpenMap(false)
        });
    return () => {
        window.removeEventListener("popstate", (e)=>{
            console.log("Remove listener")
        });
    };
    },[])
    return(
       <Box>
       <div className='grid xl:grid-cols-2 gap-2 h-screen w-full'>
        {/* <button onClick={()=>setOpenMap(true)}>Open Map</button> */}
        <div className='p-4 flex flex-col space-y-6 xl:overflow-auto'>
            <Typography variant="h6">Sucursal Info</Typography>
            {data != null ?
            <div>
            <TitleWithInfo
            onClick={()=>{
                dispatch(systemActions.setOpenInfoBar(!openInfoBar))
                dispatch(getInfoText(InfoTextId.SUCURSAL_ESTADO_ID))
            }}
            title='Estado de la sucursal'
            />

            {data.establecimiento.estado == EstablecimientoEstado.ESTABLECIMIENTO_VERIFICADO &&
            <div className="flex space-x-2 text-green-600 items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <Typography className="text-lg">Verificado</Typography>
            </div>
            }
            {data.establecimiento.estado == EstablecimientoEstado.ESTABLECIMIENTO_PENDIENTE&&
            <div className="flex space-x-2 text-gray-600 items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
            className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-lg">Verificación pendiente</span>
            
            </div>
            }
             {data.establecimiento.estado == EstablecimientoEstado.ESTABLECIMIENTO_BLOQUEADO&&
            <div className="flex space-x-2 text-gray-600 items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
            className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-lg">Verificación pendiente</span>
            
            </div>
            }

            {data.establecimiento.estado == EstablecimientoEstado.ESTABLECIMIENTO_VERIFICADO &&
            <EditComponentSelect
            label='Visibilidad'
            items={establecimientoEstados}
            getItems={()=>{}}
            updateSelect={(value,addLoader,removeLoader)=>updateEstablecimiento("visibility",value,addLoader,removeLoader)}
            currentSelected={establecimientoEstados.find(item=>item.value == data.establecimiento.visibility.toString())}
            />
            }

            <EditComponent
            label='Nombre'
            content={data?.establecimiento.name}
            edit={(addLoader,removeLoader,e)=>updateEstablecimiento("name",e,addLoader,removeLoader)}
            />
            <EditComponent
            label='Número de Telefono'
            content={data?.establecimiento.phone_number}
            type='tel'
            edit={(addLoader,removeLoader,e)=>updateEstablecimiento("phone_number",e,addLoader,removeLoader)}
            />

            <EditComponent
            label='Email'
            type='email'
            content={data?.establecimiento.email}
            edit={(addLoader,removeLoader,e)=>updateEstablecimiento("email",e,addLoader,removeLoader)}
            />

            <div>

            <div className=" flex justify-between items-center space-x-5">
                <div className="grid">
                <Typography fontWeight={500} fontSize={16.5}>Ubicación</Typography>
                    <Typography variant="subtitle1" >{data?.establecimiento.address}</Typography>
                </div>
                <Button color="inherit" onClick={()=>{
                    setOpenMap(true)
                    appendSerachParams("map","1",router,current,pathname)
                }}>Editar</Button>
            </div>
                {(data?.establecimiento.address_photo != undefined && data?.establecimiento.address_photo != "")&&
            <div className=" mt-2 mb-2">
                    {/* {data?.establecimiento?.address_photo} */}
                    <CommonImage
                    src={data?.establecimiento?.address_photo + `?${Date.now()}`}
                    w={250}
                    h={200}
                    className={`rounded object-cover`}
                    // alt={""}
                    />
            </div>
                }
            </div>

            <div>
            <Typography fontWeight={500} fontSize={16.5}>Imagen de portada</Typography>
            <UploadImage
            setFile={(e)=>setEstablecimientoPhoto(e)}
            src={data?.establecimiento.photo}
            save={(setLoading)=>uploadImage(setLoading)}
            width="w-full"
            />
            </div>

            {/* <div>
            <span className="label pb-1">Imagenes</span>
            <div className='flex gap-3 w-full flex-wrap'>
            <Photos
            items={[]}
            uuid={params.uuid}
            deletePhoto={deleteEstablecimientoPhoto}
            />
            <UploadImage
            setFile={(e)=>setPhoto(e)}
            // src={data?.establecimiento.photo}
            save={(setLoading)=>addEstablecimientoPhoto(setLoading)}
            clearAfterUpload={true}
            width="w-40"
            height='h-40'
            id='photos'
            />
            </div>
            </div> */}
       
            {openMap&&
                <MapComponent 
                loaded={loaded} 
                setLoaded={(b:boolean)=>dispatch(uiActions.setLoaded(b))}
                open={openMap}
                close={()=>setOpenMap(false)}
                lng={Number(data?.establecimiento.longitud || -63.17857704132275)}
                lat={Number(data?.establecimiento.latitud || -17.782807679925792)}
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
            :
            <div>
                <Loading
                loading={loading}
                className='w-full flex justify-center'
                />
            </div>
            }

        </div>
        

            <div className='p-4 flex flex-col gap-y-4 xl:overflow-auto'>
            <Typography variant={"h6"}>Establecimiento Ajustes</Typography>

        {data?.setting_establecimiento != undefined ?
            <div className='grid gap-y-3'>

            {/* <span className='label'>Horario de atención</span>
            <AttentionScheduleComponent
            attention_schedue_week={data.attention_schedule_week}
            updateList={(e)=>{
                setData({
                    ...data,
                    attention_schedule_week:e
                })
            }}
            /> */}
                <Typography fontWeight={500} fontSize={16.5}>Metodo de pago</Typography>
            {/* <span className='label'>Metodo de pago</span> */}
            <div className='flex flex-wrap gap-3 '>   
            {data?.setting_establecimiento.paid_type != null &&
            data?.setting_establecimiento.paid_type.map((item)=>{
                return(
                    <Item
                    key={item}
                    text={getPaymentMethod(item)}
                    />
                    // <span key={item} className='card w-min whitespace-nowrap'>{getPaymentMethod(item)}</span>
                )
            })}
             <Button onClick={()=> setOpenUpdateMethodDialog(true)} 
             startIcon={<AddIcon/>} size='small'>
            Añadir
            </Button>
            </div>

            {data?.setting_establecimiento.paid_type != null &&
            data?.setting_establecimiento.paid_type.includes(PaidType.DEFERRED_PAYMENT) &&
                <EditComponent
                label='Monto inicial para recervar una cancha'
                content={`${data?.setting_establecimiento.payment_for_reservation}`}
                edit={(addLoader,removeLoader,e)=>updateSettings("payment_for_reservation",e,addLoader,removeLoader)}
                />
            }

            <TitleWithInfo
            onClick={()=>{
                dispatch(systemActions.setOpenInfoBar(!openInfoBar))
                dispatch(getInfoText(InfoTextId.RESERVA_INTERVAL_TIME))
            }}
            title='Intervalo de tiempo para reservar'
            />

            <div className='flex flex-wrap gap-3'>
            {(data?.setting_establecimiento.horario_interval != undefined &&  data.setting_establecimiento.horario_interval.length > 0)&& 
            data.setting_establecimiento.horario_interval.sort((a,b)=>a.minutes-b.minutes).map((item)=>{
                return(
                    <Item
                    key={item.minutes}
                    text={getIntervaloString(item.minutes)}
                    />
                    // <div key={item.minutes} className='card'>
                    //     <span className='label'>{getIntervaloString(item.minutes)}</span>
                    // </div>
                )
            })}
            <AddAndDeleteButtons
            onAddButtonClick={()=> setOpenAddIntervalDialog(true)}
            onDeleteButtonClick={()=>setOpenDeleteIntervalDialog(true)}
            />
            </div>


            <div className='grid gap-y-3'>
            <span className="text-xl py-2 font-medium">Comodidades y Reglas del Establecimiento</span>
            <Typography fontWeight={500} fontSize={16.5}>Comodidades</Typography>

           <div className='flex flex-wrap gap-3'>
            {amenitiesEstablecimiento.map((item)=>{ return <Amenity key={item.id} item={item}/>})}
            <AddAndDeleteButtons
            onAddButtonClick={()=> openAmenityDialog()}
            onDeleteButtonClick={()=>setOpenDeleteAmenityDialog(true)}
            />
            </div>
            <Typography fontWeight={500} fontSize={16.5}>Reglas</Typography>
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
            :
            <div>
                <Loading
                loading={loading}
                className='w-full flex justify-center'
                />
            </div>
            }


            </div>


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
       {(openAddRuleDialog && data?.establecimiento != undefined) &&
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

       {(openUpdateMethodDialog && data?.setting_establecimiento != undefined) &&
        <UpdatePayMethodDialog
        open={openUpdateMethodDialog}
        close={()=>setOpenUpdateMethodDialog(false)}
        establecimiento_id={data.establecimiento.id}
        currentMethods={data.setting_establecimiento.paid_type}
        // intervalHorario={data?.setting_establecimiento.horario_interval}
        update={(d)=>setData({
         ...data,
         setting_establecimiento:{
             ...data?.setting_establecimiento,
             paid_type:d
        }})}
        />
    }
       </Box>
    )
}

export default Page;