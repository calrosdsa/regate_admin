import ButtonSubmit from "@/components/util/button/ButtonSubmit";
import DialogHeader from "@/components/util/dialog/DialogHeader";
import DialogLayout from "@/components/util/dialog/DialogLayout";
import CommonImage from "@/components/util/image/CommonImage";
import InputWithIcon from "@/components/util/input/InputWithIcon";
import { useAppSelector } from "@/context/reduxHooks";
import { CreateReserva } from "@/core/repository/reservas";
import { getFullName } from "@/core/util";
import ReactCountryFlag from "react-country-flag"
import moment from "moment";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import SearchInput from "@/components/util/input/SearchInput";
import SearchUserDialog from "./SearchUserDialog";
import { IsUserNameRepeat, SearchUsersEmpresa } from "@/core/repository/users";
import useDebounce from "@/core/util/hooks/useDebounce";
import Loading from "@/components/util/loaders/Loading";
import ConfirmationDialog from "@/components/util/dialog/ConfirmationDialog";
import { unexpectedError } from "@/context/config";
import { Tab } from "@headlessui/react";
import AdvanceReservaOptionDialog from "./AdvanceReservaOptionDialog";


type CreateReservaRequest = {
    intervals:CupoInterval[]
    instalacion_id:number
    establecimiento_id:number
    establecimiento_uuid:string
    user_empresa:UserEmpresa
}
type UserNameIsRepeat = {
    is_user_exist:boolean
}

type ReservaInterval = {
    id:number
    interval:CupoReserva[]
    paid?:string
}

type CupoInterval = {
    interval:CupoR[]
    paid:number
    total:number
}

const CreateReservaDialog = ({open,close,instalacion,cupos,refresh,uuid,useAdvanceOptions}:{
    open:boolean
    close:()=>void
    uuid:string
    instalacion:Instalacion
    cupos:CupoReserva[]
    refresh:()=>void
    useAdvanceOptions:boolean
}) => {
    const establecimientosUser = useAppSelector(state=>state.account.establecimientos)
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

    useEffect(() => {
        onSearch()
        // Do fetch here...
        // Triggers when "debouncedValue" changes
      }, [debouncedValue])
  
      
    const onChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData,
            [e.target.name]:e.target.value
        })
    }

    const createReserva = async()=>{
        try{
            setLoading(true)
            let cupoIntervals:CupoInterval[] = []
            console.log("Reserva Intervals",reservaIntervals)
            for(let i = 0;i < reservaIntervals.length;i++){
                const cupos:CupoR[] = reservaIntervals[i].interval.map(item=>{
                    return {
                        start_date:item.time,
                        instalacion_id:instalacion.id,
                        precio:item.precio
                    }
                })
                const r:CupoInterval = {
                    interval:cupos,
                    paid:Number(reservaIntervals[i].paid),
                    total:reservaIntervals[i].interval.map(t=>t.precio).reduce((prev,curr)=>prev + curr)
                }
                console.log("Cupo Interval",r)
                cupoIntervals = cupoIntervals.concat(r)
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
                    name:name
                }
            }
            console.log(requestData)
            await CreateReserva(JSON.stringify(requestData))
            toast.success("Se ha creado exitosamente la reserva")
            refresh()
            close()
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
                return "No se puede reservar porque ya existe una reserva que hace conflicto en este rango de hora"
            }
        }
        return "-"
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
    return(
        <>
      {confirmUserRepeat &&
      <ConfirmationDialog
      open={confirmUserRepeat}
      close={()=>setConfirmUserRepeat(false)}
      performAction={()=>createReserva()}
      title={`Ya existe un usuario con el nombre ${searchQuery}`}
      description={`Si continúa, se creará un usuario con el mismo nombre que ${searchQuery}.`}
      />
      }
      <>
      {openAdvanceOptions ?
      <AdvanceReservaOptionDialog
      open={openAdvanceOptions}
      close={()=>setOpenAdvanceOptions(false)}
      startTime={moment()}
      startDate={moment().format("yyyy-MM-DD")}
      uuid={uuid}
      instalacionId={instalacion.id}
      generateCupos={(e)=>setReservaCupos(e)}
      />
      :
     <DialogLayout
     allowFullScreen={true}
     className="max-w-lg"
      open={open} close={close} title="Crear reserva">
        <div className='rounded-lg bg-white overflow-auto max-w-xl'>
            <div className="py-2">
                    <div className="flex space-x-3 items-center">
                    <CommonImage
                        src={instalacion.portada}
                        h={140}
                        w={140}
                        className="rounded-full h-12 w-12 object-cover"
                        />
                        <span className="font-semibold">{instalacion.name}</span>
                    </div>

                    
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
                                                <span>Reserva {idx+1}</span>
                                                {!checkIsAvailable(item.interval) &&
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" 
                                                className="w-3 h-3">
                                                <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14ZM8 4a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                                                </svg>
                                                }

                                            </div>
                                            </Tab>
                                )
                            })}
                           
                        </Tab.List>


                        <Tab.Panels className={""}>
                        {reservaIntervals.map((item,idx)=>{
                                return (
                            <Tab.Panel className={""}>
                                <div className="grid ">
                                <div className="grid sm:flex sm:justify-between sm:items-center sm:space-x-10 border-b-[1px] py-2">
                                    <span className="label">Precio de la reserva</span>
                                    <span className="text-xs ">{item.interval.map(t=>t.precio).reduce((prev,curr)=>prev + curr)}</span>
                                </div>
                                <div className="grid sm:grid-cols-2 items-center sm:space-x-10 border-b-[1px] py-2">
                                    <span className="label">Disponibilidad</span>
                                    <span className="text-xs ">{getMessageAvailable(item.interval)}</span>
                                </div>
                                {item.interval.length > 0 &&
                                <div className="grid sm:flex sm:justify-between sm:items-center sm:space-x-10 border-b-[1px] py-2">
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
                            className="mt-0"
                            onChange={(e)=>{
                                const f = reservaIntervals.filter(t=>t.id != item.id)
                                const n = [...f,{
                                    ...item,
                                    paid:e.target.value
                                }].sort((a,b)=>a.id - b.id)
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

            <span className="title text-[17px]">Usuario para quien se realizará la reserva</span>
        <div className="pt-2 w-full relative">
    <span className="label">Nombre</span>
            <SearchInput
            value={searchQuery}
            onChange={(e)=>{
                setSearchQuery(e.target.value)
                setUserEmpresa(null)
            }}
            clear={()=>{
                setSearchQuery("")
                setUsers([])
            }}
            className="h-10 rounded-lg items-center"
            onEnter={()=>onSearch()}
            placeholder=""
            required={true}
            />
            {(loadingUsers || users.length > 0) &&
                <div className="mt-2 overflow-auto absolute bg-white z-10 w-full h-36 shadow-lg">
                <div className="flex justify-end px-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                className="w-7 h-7 icon-button noSelect p-1" onClick={()=>setUsers([])}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                </svg>
                </div>
                <Loading
                loading={loadingUsers}
                className="flex justify-center mt-2"
                />

                {users.map((item,idx)=>{
                    return(
                        <div key={idx} className="record"
                        onClick={()=>{
                            setFormData({
                                ...formData,
                                name:item.name,
                                phone_number:item.phone_number  
                            })
                            setSearchQuery(item.name)
                            setUserEmpresa(item)
                            setUsers([])
                        }}>
                            <span className="text-xs">{item.name}</span>
                        </div>
                    )
                })}
                </div>
            }

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
             
            <ButtonSubmit
            loading={loading}
            title="Crear Reserva"
            />
        </form>
         </div>   
     </DialogLayout>
      }
        </>

    </>
    )
}

export default CreateReservaDialog;