import ButtonSubmit from "@/components/util/button/ButtonSubmit";
import DialogHeader from "@/components/util/dialog/DialogHeader";
import DialogLayout from "@/components/util/dialog/DialogLayout";
import CommonImage from "@/components/util/image/CommonImage";
import InputWithIcon from "@/components/util/input/InputWithIcon";
import { useAppDispatch, useAppSelector } from "@/context/reduxHooks";
import { CheckInstalacionIsAvailable, CreateReserva } from "@/core/repository/reservas";
import { getFullName } from "@/core/util";
import ReactCountryFlag from "react-country-flag"
import moment from "moment";
import Image from "next/image"
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import SearchInput from "@/components/util/input/SearchInput";
import SearchUserDialog from "./SearchUserDialog";
import { IsUserNameRepeat, SearchUsersEmpresa } from "@/core/repository/users";
import useDebounce from "@/core/util/hooks/useDebounce";
import Loading from "@/components/util/loaders/Loading";
import ConfirmationDialog from "@/components/util/dialog/ConfirmationDialog";
import { unexpectedError } from "@/context/config";
import AdvanceReservaOptionDialog from "./AdvanceReservaOptionDialog";
import SeeMore from "@/components/util/button/SeeMore";
import { Http, HttpStatusCode } from "@/core/type/enums";
import { Tab } from "@headlessui/react";
import { GetInstalaciones } from "@/core/repository/instalacion";
import { Button, IconButton, TextField, Typography } from "@mui/material";
import { fetchInstalaciones } from "@/context/actions/data-actions";
import { LoadingButton } from "@mui/lab";
import InstalacionesDialog from "@/components/establecimiento/instalacion/dialog/InstalacionesDialog";
import CloseIcon from '@mui/icons-material/Close';
import ListInstalaciones from "@/components/establecimiento/instalacion/ListInstalaciones";
import AutocompleteMui from "@/components/util/input/AutocompleteMui";

type CreateReservaRequest = {
    intervals:CupoInterval[]
    instalacion_id:number
    establecimiento_id:number
    establecimiento_uuid:string
    user_empresa:UserEmpresa
    evento_id:number | null
}
type UserNameIsRepeat = {
    is_user_exist:boolean
}

type ReservaInterval = {
    id?:number
    interval:CupoReserva[]
    paid?:string
}


// enum Tabs {
//     Instalaciones,
//     ReservaForm
// }

const CreateReservaDialog = ({open,close,cancha,cupos,onComplete,uuid,useAdvanceOptions,
    eventoId,startTime,usersEvento}:{
    open:boolean
    close:()=>void
    uuid:string
    cancha:Instalacion | null
    cupos:CupoReserva[]
    onComplete:()=>void
    useAdvanceOptions:boolean
    eventoId:number | null
    startTime?:moment.Moment
    usersEvento?:UserEmpresa[]
}) => {
    const dispatch = useAppDispatch()
    const instalaciones = useAppSelector(state=>state.data.instalaciones)
    const fetchLoading = useAppSelector(state=>state.ui.fetchLoading)
    // const [tab,setTab] = useState(isEvento ? Tabs.Instalaciones : Tabs.ReservaForm)
    const establecimientosUser = useAppSelector(state=>state.account.establecimientos)
    // const instalaciones = useAppSelector(state=>state.data.instalaciones)
    const [loading,setLoading] = useState(false)
    const [loadingUsers,setLoadingUsers] = useState(false)
    const [userEmpresa,setUserEmpresa] = useState<null | UserEmpresa>(null)
    const [error,setError] = useState("")
    const [users,setUsers] = useState<UserEmpresa[]>([])
    const [searchQuery,setSearchQuery] = useState("")
    const debouncedValue = useDebounce(searchQuery,500)
    const [confirmUserRepeat,setConfirmUserRepeat] = useState(false)
    const [reservaIntervals,setReservaIntervals] = useState<ReservaInterval[]>([])
    const [openAdvanceOptions,setOpenAdvanceOptions] = useState(useAdvanceOptions)
    const [reservaCupos,setReservaCupos] = useState<CupoReserva[]>(cupos)
    const [instalacion,setInstalacion] = useState<Instalacion | null>(cancha)
    const [openInstalacionesDialog,setOpenInstalacionesDialog] = useState(false)
    const [selectReservaInterval,setSelectecReservaInterval] = useState<ReservaInterval | null>(null)
    const [totalAmount,setTotalAmount] = useState(0)
    // const [currentInterval,setCurrentInterval] = useState<CupoReserva[]>([])


    // const [openSearchUserDialog,setOpenSearchUserDialog] = useState(false)
    // const [orderedCupo,setOrderedCupos] = useState<CupoReserva[]>([])
    const [formData,setFormData] = useState({
        paid:"",
        name:"",
        phone_number:"",
    })
    const {paid,name,phone_number} = formData
 

    const onSearch = async() =>{
        try{
            if(name == searchQuery) return
            if(searchQuery == "") {
                setUsers([])
                return
            }
            setUsers([])
            setLoadingUsers(true)
            const q = searchQuery.trim().replaceAll(/\s+/g,":* & ") + ":*"
            const res = await SearchUsersEmpresa(q)
            setFormData({...formData,name:searchQuery})
            setUsers(res)
            setLoadingUsers(false)
        }catch(err){
            setLoadingUsers(false)
        }
    }

    const getInstalacionName = (id:number)=> {
        let name = ""
        instalaciones.map(item=>{
            if(item.id == id){
                name = item.name
            }
        })
        return name
    }

    useEffect(() => {
        onSearch()
        // Do fetch here...
        // Triggers when "debouncedValue" changes
      }, [debouncedValue])
  
      
    const onChange = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({...formData,
            [e.target.name]:e.target.value
        })
    }

    const createReserva = async()=>{
        try{
            setLoading(true)
            if(instalacion == undefined) return
            let cupoIntervals:CupoInterval[] = []
            for(let i = 0;i < reservaIntervals.length;i++){
                const cupos:(CupoR | undefined)[] = reservaIntervals[i].interval.map(item=>{
                    // if(item.available){}
                    if(item.available && item.evento_id == null && item.reserva_id == null&& item.instalacion_id != null){
                        const c:CupoR = {
                            start_date:item.time,
                            instalacion_id:item.instalacion_id,
                            precio:item.precio
                        }
                        return  c
                    }else{
                        return undefined
                    }
                })
                if(cupos.includes(undefined)){
                    console.log("No available for reservations")
                    toast.error("La reserva no pudo ser completada.")
                    // return
                }else{
                    // const n = cupos.filter(item=>item != undefined)
                    const r:CupoInterval = {
                    interval:cupos as CupoR[],
                    paid:Number(reservaIntervals[i].paid),
                    total:reservaIntervals[i].interval.map(t=>t.precio).reduce((prev,curr)=>prev + curr)
                }
                console.log("Cupo Interval",r)
                cupoIntervals = cupoIntervals.concat(r)
                }
            }
            
            const requestData:CreateReservaRequest = {
                intervals:cupoIntervals,
                instalacion_id:instalacion.id,
                // total_price:totalPrice,
                // paid:Number(formData.paid),
                establecimiento_id:establecimientosUser.find(item=>item.uuid == uuid)?.id || 0,
                establecimiento_uuid:uuid,
                user_empresa:{
                    id:userEmpresa?.id || 0,
                    phone_number:phone_number,
                    name:name,
                    uuid:userEmpresa?.uuid
                },
                evento_id:eventoId
            }
            console.log("CREATE RESERVA BODY",requestData)
            const res = await CreateReserva(JSON.stringify(requestData))
            const data:ResponseMessage = await res.json()
            switch(res.status){
                case Http.StatusOk:
                    toast.success("Se ha creado exitosamente la reserva")
                    onComplete()
                    close()
                    setLoading(false)
                break;    
                case Http.StatusConflict:
                    toast.error("No es posible registrar usuarios con nombres duplicados. Intenta cambiar el nombre de usuario.")    
                    // setConfirmUserRepeat(false)
                    break;
                case HttpStatusCode.NotAcceptable:
                    toast.error(data.message);
                    break;
                default:
                    toast.error(unexpectedError)               
            }
            setLoading(false)
        }catch(err){
            toast.error(unexpectedError)
            setLoading(false)

        }
    }


    const onSubmit = async(e:React.FormEvent<HTMLFormElement>) => {
        try{
            e.preventDefault()
            setLoading(true)
            // if(Number(paid)> totalPrice){
            //     setError("El importe pagado no debe superar el total de la reserva.")
            //     setLoading(false)
            //     return
            // }
            console.log(userEmpresa)
            // if(userEmpresa?.id )

            if(userEmpresa == null){
                const q = searchQuery.trim()
                const res:UserNameIsRepeat = await IsUserNameRepeat(q)
                console.log("RESPONSE",res)
                if(res.is_user_exist){
                    setLoading(false)
                    setConfirmUserRepeat(true)
                    return
                }
            }
            createReserva()            
        }catch(err){
            setLoading(false)
        }
    }
   
    const groupByInterval = (newCupos:CupoReserva[]) =>{
        try{
            setReservaIntervals([])
            let interval:CupoReserva[] = []
            for(let i =0;i < newCupos.length;i++){
                const next = i +1
                if(next < newCupos.length){
                    if(moment(newCupos[i].time).format() == moment(newCupos[next].time).subtract(30,"minutes").format()){
                        interval = interval.concat(newCupos[i])
                    }else{
                        interval = interval.concat(newCupos[i])
                        const intervalR:ReservaInterval = {
                            interval:interval,
                            id:i
                        }
                        setReservaIntervals(e=>[...e,intervalR])
                        interval = []
                    }
                }else{
                    interval = interval.concat(newCupos[i])
                    const intervalR:ReservaInterval = {
                        interval:interval,
                        id:i
                    }
                    setReservaIntervals(e=>[...e,intervalR])
                }
            }
        }catch(err){
            console.log(err)
        }
    }

    const getMessageAvailable = (items:CupoReserva[]):string => {
        for(let i = 0;i<items.length;i++){
            if(!items[i].available){
                return "No podrás reservar en este horario porque no está configurado como parte del horario disponible para la cancha."
            }
            if(items[i].reserva_id != null || items[i].evento_id != undefined){
                return "No se puede reservar porque ya existe una reserva que hace conflicto en este rango de hora."
            }
        }
        return "Disponible"
    }
    const checkIsAvailable = (items:CupoReserva[]):boolean => {
        for(let i = 0;i<items.length;i++){
            if(!items[i].available){
                return false
            }
            if(items[i].reserva_id != null || items[i].evento_id != undefined){
                return false
            }
        }
        return true
    }

    const selectInstalacionFromDialog = (item:ReservaInterval) =>{
        setSelectecReservaInterval(item)
        setOpenInstalacionesDialog(true)
    }

    const checkInstalacionIsAvailable = async(instalacion:Instalacion,addLoader:(b:boolean)=>void)=>{
        try{
            addLoader(true)
            if(selectReservaInterval?.interval.length ==0) return
            const times = selectReservaInterval?.interval.map(item=>{
                return item.time.slice(11,16)
            })
            const timestamps = selectReservaInterval?.interval.map(item=>{
                return item.time
            })
            const dayWeek = moment(selectReservaInterval?.interval[0].time).day()
            if(times == undefined) return 
            if(timestamps == undefined) return 
            
            const body:CheckInstalacionIsAvailableRequest =  {
                times:times,
                instalacion_id:instalacion.id,
                timestamps:timestamps,
                day_week:dayWeek
            }
            console.log("BODY",body)
            const res = await CheckInstalacionIsAvailable(body)
            let data;
            switch(res.status){
                case HttpStatusCode.Ok:
                    data = await res.json() as CupoReserva[]
                    console.log("CUPOS DATA",data)
                //     const timesCupoReserva
                //    reservaCupos.map(item=>{
                //     if(.includes())
                //    }) 
                    const nSelectedReservaInterval:ReservaInterval = {
                        ...selectReservaInterval,
                        interval:data
                    }
                    const nReservaIntervals = reservaIntervals.map(item=>{
                        if(item.id == selectReservaInterval?.id){
                            item = nSelectedReservaInterval
                        }
                        return item
                    })
                    setReservaIntervals(nReservaIntervals)
                    break;
                case HttpStatusCode.NotAcceptable:
                    data =await res.json() as ResponseMessage
                    console.log("RESPONSE",data)
                    toast.error(data.message)
                    break;
                default:
                    toast.error(unexpectedError)        
            }
            addLoader(false)
            setOpenInstalacionesDialog(false)
        }catch(err){
            toast.error(unexpectedError)        
            addLoader(false)
            console.log(err)
        }
    }

    const removeReservaInterval = (id:number | undefined) =>{
        if(id == undefined) return
        const n = reservaIntervals.filter(item=>item.id!= id)
        setReservaIntervals(n)
    }


    useEffect(()=>{
       
        // if(orderedCupo.length == 0){
            try{
                const newCupos = reservaCupos.sort((left,right)=>{
                    return moment.utc(left.time).diff(moment.utc(right.time))
                })
                groupByInterval(newCupos)
            }catch(err){
                console.log(err)
            }
            // close()
        // }
    },[reservaCupos])

    useEffect(()=>{
        dispatch(fetchInstalaciones(uuid))    
    },[])
    return(
        <>
        {openInstalacionesDialog &&
        <InstalacionesDialog
        openModal={openInstalacionesDialog}
        closeModal={()=>setOpenInstalacionesDialog(false)}
        instalaciones={instalaciones}
        onAccept={checkInstalacionIsAvailable}
        />
        }
      {confirmUserRepeat &&
      <ConfirmationDialog
      open={confirmUserRepeat}
      close={()=>setConfirmUserRepeat(false)}
      performAction={()=>createReserva()}
      title={`Ya existe un usuario con el nombre ${searchQuery}`}
      description={`No es posible crear usuarios con el mismo nombre.`}
      />
      }
      <>
      {openAdvanceOptions ?
      <AdvanceReservaOptionDialog
      open={openAdvanceOptions}
      close={(closeParentDialog)=>{
        setOpenAdvanceOptions(false)
        if(closeParentDialog){
            if(reservaCupos.length == 0){
                close()
            }
        }
    }}
      startTime={startTime || moment()}
      uuid={uuid}
      instalacionId={instalacion?.id || 0}
      generateCupos={(e)=>{
        console.log(e)
        setReservaCupos(e)
    }}
      />
      :
     <DialogLayout
     allowFullScreen={true}
     className="max-w-xl"
      open={open} close={close} title="Crear reserva">
        <div className='rounded-lg bg-white overflow-auto max-w-xl'>
           
            <div className="">
                    
                    <Button size="small"
                    color="inherit" variant="outlined" onClick={()=>setOpenAdvanceOptions(!openAdvanceOptions)}>
                    Seleccionar hora
                    </Button>
                    
                    <Tab.Group>
                        <Tab.List className={"w-full z-10 flex overflow-auto"}>
                            {reservaIntervals.map((item,idx)=>{
                                return (
                                         <Tab key={idx} className={({ selected }) => `tab whitespace-nowrap ${selected && "tab-enabled"}`}
                                        onClick={()=>{
                                            console.log(item.interval)
                                            // setCurrentInterval(item.interval) 
                                        }}>
                                            <div className="flex space-x-1 items-center">
                                                {!checkIsAvailable(item.interval) &&
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" 
                                                className="w-3 h-3">
                                                <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14ZM8 4a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                                                </svg>
                                                }
                                                <span>Reserva {idx+1}</span>

                                                <IconButton sx={{height:30}} size="small"
                                                onClick={(e)=>{
                                                    e.stopPropagation()
                                                    removeReservaInterval(item.id)
                                                }}
                                                >
                                                    <CloseIcon/>
                                                </IconButton>

                                            </div>
                                            </Tab>
                                )
                            })}
                           
                        </Tab.List>


                        <Tab.Panels className={""}>
                        {reservaIntervals.map((item,idx)=>{
                            const totalPrice = item.interval.map(t=>t.precio).reduce((prev,curr)=>prev + curr)
                                return (
                                    <Tab.Panel key={idx} className={""}>
                                <div className="grid gap-y-1 mt-2 ">
                                {item.interval.length > 0 &&
                                <div className="grid sm:grid-cols-2 sm:items-center sm:space-x-10 border-b-[1px] pb-1">
                                    <span className="label">Cancha</span>
                                    <div className="flex space-x-2 items-center">
                                        <Button size="small" onClick={()=>selectInstalacionFromDialog(item)}>
                                            <Typography variant="caption">
                                        Seleccionar otra cancha
                                            </Typography>
                                        </Button>
                                    {item.interval[0].instalacion_id != null &&
                                        <Typography variant="caption">{getInstalacionName(item.interval[0].instalacion_id)}</Typography>
                                    }
                                    </div>
                                </div>
                                }
                                <div className="grid sm:grid-cols-2 sm:items-center sm:space-x-10 border-b-[1px] pb-1">
                                    <span className="label">Precio de la reserva</span>
                                    <span className="text-xs ">{totalPrice}</span>
                                </div>
                                <div className="grid sm:grid-cols-2 sm:items-center sm:space-x-10 border-b-[1px] pb-1">
                                    <span className="label">Disponibilidad</span>
                                    {/* <div className="text-xs ">
                                        <span className="">{getMessageAvailable(item.interval)}
                                    <span>Ver mas</span>
                                        </span>
                                    </div> */}
                                    <SeeMore
                                    text={getMessageAvailable(item.interval)}
                                    maxLength={62}
                                    className={`text-sm font-medium ${getMessageAvailable(item.interval) != "Disponible" && "text-red-500"}`}
                                    />
                                </div>
                                {item.interval.length > 0 &&
                                <div className="grid sm:grid-cols-2 sm:items-center sm:space-x-10 border-b-[1px] pb-1">
                                    <span className="label">Fecha y hora de la reserva</span>
                                    <div className="grid ">
                                        <span className="text-xs">
                                        {moment.utc(item.interval[0].time).format("ll")} de {' '}
                                        {moment.utc(item.interval[0].time).format("LT")} a {' '}
                                        {moment.utc(item.interval[item.interval.length -1].time).add(30,'minutes').format("LT")} 
                                        </span>
                                    </div>
                                </div>
                                }

                            <InputWithIcon
                            type="tel"
                            label="Monto pagado"
                            value={item.paid || ""}
                            name="paid"
                            error={error}
                            onBlur={()=>{
                                if(Number(item.paid) > totalPrice){
                                    alert("El monto pagado no debe exceder el precio de la reserva de la cancha.")
                                }
                            }}
                            className="mt-0"
                            onChange={(e)=>{
                                const f = reservaIntervals.filter(t=>t.id != item.id)
                                const n = [...f,{
                                    ...item,
                                    paid:e.target.value
                                }].sort((a,b)=>Number(a.id) - Number(b.id))
                                setReservaIntervals(n)
                            }}
                            /> 
                            </div>

                            </Tab.Panel>
                             )
                            })}
                        </Tab.Panels>
                    </Tab.Group>

            </div>
             
        <form onSubmit={onSubmit} className="mt-2">
         {reservaIntervals.length > 1 &&
         <>
             <span className="title text-[17px]">Informacion de las reservas</span>
        <div className="pt-2 w-full relative">
          <Typography fontWeight={500}>Precio total</Typography>
          <Typography>{reservaIntervals.map((item)=>{
              const totalPrice = item.interval.map(t=>t.precio).reduce((prev,curr)=>prev + curr)
              return totalPrice
            }).reduce((prev,curr)=>prev + curr)}</Typography>

          <Typography variant="body2">Total pagado</Typography>
          <TextField
          size="small"
          sx={{mt:1,width:"100%"}}
          type="number"
          onChange={(e)=>{
            const amountV = Number(e.target.value)
            if(amountV >0) {
                const n = reservaIntervals.map(item=>{
                    item.paid = Math.round(amountV / reservaIntervals.length).toString()
                    return item
                })
                setReservaIntervals(n)
            } 
          }}
          />

        </div>
            </>
        }   

            <span className="title text-[17px]">Usuario para quien se realizará la reserva</span>
        <div className="pt-2 w-full relative">

        <AutocompleteMui
        label="Nombre"
        options={usersEvento != undefined ? [...usersEvento,...users] : users} 
        loading={loadingUsers}
        setQuery={(e)=>{
            setSearchQuery(e)
            setUserEmpresa(null)
        }}
        query={searchQuery}
        onSelect={(e)=>{
            console.log(e)
            if(e == null) return
            setFormData({
                ...formData,
                name:e.name,
                phone_number:e.phone_number  
            })
            setSearchQuery(e.name)
            setUserEmpresa(e)
            setUsers([])
        }}
        value={userEmpresa}
        />


            </div>
           <InputWithIcon
            type="tel"
            label="Número de teléfono."
            value={formData.phone_number}
            name="phone_number"
            className="mb-5"
            error={error}
            onChange={onChange}
            />    
             
            <LoadingButton
            type="submit"
            variant="contained"
            sx={{width:"100%"}}
            loading={loading}>Crear Reserva</LoadingButton>
        </form>
        
         </div>   
     </DialogLayout>
      }
        </>

    </>
    )
}

export default CreateReservaDialog;
