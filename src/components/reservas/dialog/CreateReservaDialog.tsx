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
import { Http } from "@/core/type/enums";
import { Tab } from "@headlessui/react";
import { GetInstalaciones } from "@/core/repository/instalacion";
import { Autocomplete, TextField } from "@mui/material";


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
    id:number
    interval:CupoReserva[]
    paid?:string
}

type CupoInterval = {
    interval:CupoR[]
    paid:number
    total:number
}

enum Tabs {
    Instalaciones,
    ReservaForm
}

const CreateReservaDialog = ({open,close,cancha,cupos,refresh,uuid,useAdvanceOptions,isEvento = false,eventoId,startTime}:{
    open:boolean
    close:()=>void
    uuid:string
    cancha?:Instalacion
    cupos:CupoReserva[]
    refresh:()=>void
    useAdvanceOptions:boolean
    isEvento?:boolean
    eventoId:number | null
    startTime?:moment.Moment
}) => {
    const [tab,setTab] = useState(isEvento ? Tabs.Instalaciones : Tabs.ReservaForm)
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
    const [instalacion,setInstalacion] = useState<Instalacion | undefined>(cancha)
    const [instalaciones,setInstalaciones] = useState<Instalacion[]>([])
    // const [currentInterval,setCurrentInterval] = useState<CupoReserva[]>([])


    // const [openSearchUserDialog,setOpenSearchUserDialog] = useState(false)
    // const [orderedCupo,setOrderedCupos] = useState<CupoReserva[]>([])
    const [formData,setFormData] = useState({
        paid:"",
        name:"",
        phone_number:"",
    })
    const {paid,name,phone_number} = formData

    const getInstalaciones = async () =>{
        try{
            setLoading(true)
            setInstalaciones([])
            const res:Instalacion[] = await GetInstalaciones(uuid)
            setLoading(false)
            setInstalaciones(res)
        }catch(e){
            setLoading(false)
        }
    }
 

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
            if(instalacion == undefined) return
            let cupoIntervals:CupoInterval[] = []
            console.log("Reserva Intervals",reservaIntervals)
            for(let i = 0;i < reservaIntervals.length;i++){
                const cupos:(CupoR | undefined)[] = reservaIntervals[i].interval.map(item=>{
                    // if(item.available){}
                    if(item.available &&     item.evento_id == undefined && item.reserva_id == null){
                        const c:CupoR = {
                            start_date:item.time,
                            instalacion_id:instalacion.id,
                            precio:item.precio
                        }
                        return  c
                    }else{
                        return undefined
                    }
                })
                console.log(cupos)
                if(cupos.includes(undefined)){
                    console.log("No available for reservations")
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
            console.log(requestData)
            const res = await CreateReserva(JSON.stringify(requestData))
            switch(res.status){
                case Http.StatusOk:
                    toast.success("Se ha creado exitosamente la reserva")
                    refresh()
                    close()
                    setLoading(false)
                break;    
                case Http.StatusConflict:
                    toast.error("No es posible registrar usuarios con nombres duplicados. Intenta cambiar el nombre de usuario.")    
                    // setConfirmUserRepeat(false)
                    break;
                default:
                    toast.error(unexpectedError)               
            }
            // toast.success("Se ha creado exitosamente la reserva")
            // refresh()
            // close()
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
        if(tab == Tabs.Instalaciones){
            getInstalaciones()
        }
    },[])
    return(
        <>
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
      startDate={moment().format("yyyy-MM-DD")}
      uuid={uuid}
      instalacionId={instalacion?.id || 0}
      generateCupos={(e)=>setReservaCupos(e)}
      />
      :
     <DialogLayout
     allowFullScreen={true}
     className="max-w-xl"
      open={open} close={close} title="Crear reserva">
        <div className='rounded-lg bg-white overflow-auto max-w-xl'>
            <>
            {tab == Tabs.Instalaciones &&
                        <div className="h-96">
                        {loading && 
                        <Loading
                        className="flex w-full justify-center h-full"
                        loading={loading}
                        />
                        }
                        {instalaciones.map((item,index)=>{
                            return(
                                <div key={index}>
                                        <div 
                                        onClick={()=>{
                                            setInstalacion(item)
                                            setOpenAdvanceOptions(true)
                                            setTab(Tabs.ReservaForm)
                                        }}
                                        className="flex space-x-3 p-2 items-center cursor-pointer border-b relative
                                        hover:bg-gray-100 justify-between">
                                            <div className="flex items-center w-full">

                                            <div className="w-12">
                                                {/* <CommonImage
                                                src={item.instalacion.portada}
                                                h={100} w={120} className={"h-20 w-36 object-cover rounded-lg"}/> */}
                                            {(item.portada == null || item.portada == "") ?
                                            <Image
                                            src="/images/img-default.png"
                                            height={100}
                                            width={150}
                                            alt={item.name} 
                                            className=" rounded-full h-12 w-12   object-contain bg-gray-200 p-2"
                                            />
                                            :
                                            <Image
                                            src={item.portada as string}
                                            height={100}
                                            width={150}
                                            alt={item.name} 
                                            className=" rounded-full h-12 w-12  object-cover"
                                            />
                                        }
                                        </div>
                                    <span className="font-medium text-sm  line-clamp-2 w-1/2
                                    p-1 z-10 rounded-br-lg">{item.name}</span>
                                    </div>
                                    
                                </div>

                                </div>
                            )
                        })}
                        </div>
            }
          
            {tab == Tabs.ReservaForm &&
            <>
            <div className="py-2">
                    <div className="flex space-x-3 items-center">
                    <CommonImage
                        src={instalacion?.portada}
                        h={140}
                        w={140}
                        className="rounded-full h-12 w-12 object-cover"
                        />
                        <span className="font-semibold">{instalacion?.name}</span>
                    </div>
                    <div className="h-2"/>
                    <div className=" smallButton w-min px-1 items-center noSelect">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                     className="w-[15px] h-[15px] ">
                    <path d="M10 3.75a2 2 0 1 0-4 0 2 2 0 0 0 4 0ZM17.25 4.5a.75.75 0 0 0 0-1.5h-5.5a.75.75 0 0 0 0 1.5h5.5ZM5 3.75a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 .75.75ZM4.25 17a.75.75 0 0 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5h1.5ZM17.25 17a.75.75 0 0 0 0-1.5h-5.5a.75.75 0 0 0 0 1.5h5.5ZM9 10a.75.75 0 0 1-.75.75h-5.5a.75.75 0 0 1 0-1.5h5.5A.75.75 0 0 1 9 10ZM17.25 10.75a.75.75 0 0 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5h1.5ZM14 10a2 2 0 1 0-4 0 2 2 0 0 0 4 0ZM10 16.25a2 2 0 1 0-4 0 2 2 0 0 0 4 0Z" />
                    </svg>
                    <span onClick={()=>setOpenAdvanceOptions(!openAdvanceOptions)} className="text-xs font-medium">Seleccionar hora</span>
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
                            const totalPrice = item.interval.map(t=>t.precio).reduce((prev,curr)=>prev + curr)
                                return (
                            <Tab.Panel key={idx} className={""}>
                                <div className="grid ">
                                <div className="grid sm:flex sm:justify-between sm:items-center sm:space-x-10 border-b-[1px] py-2">
                                    <span className="label">Precio de la reserva</span>
                                    <span className="text-xs ">{totalPrice}</span>
                                </div>
                                <div className="grid sm:grid-cols-2 items-center sm:space-x-10 border-b-[1px] py-2">
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

        {/* <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={top100Films}
        onChange={(e)=>console.log(e.target)}
        // getOptionLabel={(option) => console.log(option)}
        // sx={{ width: 300 }}
        renderInput={(params) => 
        <TextField
        onChange={(e)=>console.log(e.target.value)}
         {...params} label="Nombre" />
    }
        /> */}

    <span className="label">Nombre</span>
            <SearchInput
            value={searchQuery}
            onChange={(e)=>{
                setSearchQuery(e.target.value)
                setUserEmpresa(null)
            }}
            clear={()=>{
                // setSearchQuery("")
                setUsers([])
            }}
            className="h-10 rounded-lg items-center"
            onEnter={()=>onSearch()}
            placeholder=""
            required={true}
            />
            {(loadingUsers || users.length > 0) &&
                <div className="pt-2 overflow-auto absolute bg-white z-10 w-full  shadow-lg">
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
        </>
            }
            </>
         </div>   
     </DialogLayout>
      }
        </>

    </>
    )
}

export default CreateReservaDialog;


const top100Films = [
    { label: 'The Shawshank Redemption', year: 1994 },
    { label: 'The Godfather', year: 1972 },
    { label: 'The Godfather: Part II', year: 1974 },
    { label: 'The Dark Knight', year: 2008 },
    { label: '12 Angry Men', year: 1957 },
    { label: "Schindler's List", year: 1993 },
    { label: 'Pulp Fiction', year: 1994 },
    {
      label: 'The Lord of the Rings: The Return of the King',
      year: 2003,
    },
    { label: 'The Good, the Bad and the Ugly', year: 1966 },
    { label: 'Fight Club', year: 1999 },
    {
      label: 'The Lord of the Rings: The Fellowship of the Ring',
      year: 2001,
    },
    {
      label: 'Star Wars: Episode V - The Empire Strikes Back',
      year: 1980,
    },
    { label: 'Forrest Gump', year: 1994 },
    { label: 'Inception', year: 2010 },
    {
      label: 'The Lord of the Rings: The Two Towers',
      year: 2002,
    },
    { label: "One Flew Over the Cuckoo's Nest", year: 1975 },
    { label: 'Goodfellas', year: 1990 },
    { label: 'The Matrix', year: 1999 },
    { label: 'Seven Samurai', year: 1954 },
    {
      label: 'Star Wars: Episode IV - A New Hope',
      year: 1977,
    },
    { label: 'City of God', year: 2002 },
    { label: 'Se7en', year: 1995 },
    { label: 'The Silence of the Lambs', year: 1991 },
    { label: "It's a Wonderful Life", year: 1946 },
    { label: 'Life Is Beautiful', year: 1997 },
    { label: 'The Usual Suspects', year: 1995 },
    { label: 'Léon: The Professional', year: 1994 },
    { label: 'Spirited Away', year: 2001 },
    { label: 'Saving Private Ryan', year: 1998 },
    { label: 'Once Upon a Time in the West', year: 1968 },
    { label: 'American History X', year: 1998 },
    { label: 'Interstellar', year: 2014 },
    { label: 'Casablanca', year: 1942 },
    { label: 'City Lights', year: 1931 },
    { label: 'Psycho', year: 1960 },
    { label: 'The Green Mile', year: 1999 },
    { label: 'The Intouchables', year: 2011 },
    { label: 'Modern Times', year: 1936 },
    { label: 'Raiders of the Lost Ark', year: 1981 },
    { label: 'Rear Window', year: 1954 },
    { label: 'The Pianist', year: 2002 },
    { label: 'The Departed', year: 2006 },
    { label: 'Terminator 2: Judgment Day', year: 1991 },
    { label: 'Back to the Future', year: 1985 },
    { label: 'Whiplash', year: 2014 },
    { label: 'Gladiator', year: 2000 },
    { label: 'Memento', year: 2000 },
    { label: 'The Prestige', year: 2006 },
    { label: 'The Lion King', year: 1994 },
    { label: 'Apocalypse Now', year: 1979 },
    { label: 'Alien', year: 1979 },
    { label: 'Sunset Boulevard', year: 1950 },
    {
      label: 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb',
      year: 1964,
    },
    { label: 'The Great Dictator', year: 1940 },
    { label: 'Cinema Paradiso', year: 1988 },
    { label: 'The Lives of Others', year: 2006 },
    { label: 'Grave of the Fireflies', year: 1988 },
    { label: 'Paths of Glory', year: 1957 },
    { label: 'Django Unchained', year: 2012 },
    { label: 'The Shining', year: 1980 },
    { label: 'WALL·E', year: 2008 },
    { label: 'American Beauty', year: 1999 },
    { label: 'The Dark Knight Rises', year: 2012 },
    { label: 'Princess Mononoke', year: 1997 },
    { label: 'Aliens', year: 1986 },
    { label: 'Oldboy', year: 2003 },
    { label: 'Once Upon a Time in America', year: 1984 },
    { label: 'Witness for the Prosecution', year: 1957 },
    { label: 'Das Boot', year: 1981 },
    { label: 'Citizen Kane', year: 1941 },
    { label: 'North by Northwest', year: 1959 },
    { label: 'Vertigo', year: 1958 },
    {
      label: 'Star Wars: Episode VI - Return of the Jedi',
      year: 1983,
    },
    { label: 'Reservoir Dogs', year: 1992 },
    { label: 'Braveheart', year: 1995 },
    { label: 'M', year: 1931 },
    { label: 'Requiem for a Dream', year: 2000 },
    { label: 'Amélie', year: 2001 },
    { label: 'A Clockwork Orange', year: 1971 },
    { label: 'Like Stars on Earth', year: 2007 },
    { label: 'Taxi Driver', year: 1976 },
    { label: 'Lawrence of Arabia', year: 1962 },
    { label: 'Double Indemnity', year: 1944 },
    {
      label: 'Eternal Sunshine of the Spotless Mind',
      year: 2004,
    },
    { label: 'Amadeus', year: 1984 },
    { label: 'To Kill a Mockingbird', year: 1962 },
    { label: 'Toy Story 3', year: 2010 },
    { label: 'Logan', year: 2017 },
    { label: 'Full Metal Jacket', year: 1987 },
    { label: 'Dangal', year: 2016 },
    { label: 'The Sting', year: 1973 },
    { label: '2001: A Space Odyssey', year: 1968 },
    { label: "Singin' in the Rain", year: 1952 },
    { label: 'Toy Story', year: 1995 },
    { label: 'Bicycle Thieves', year: 1948 },
    { label: 'The Kid', year: 1921 },
    { label: 'Inglourious Basterds', year: 2009 },
    { label: 'Snatch', year: 2000 },
    { label: '3 Idiots', year: 2009 },
    { label: 'Monty Python and the Holy Grail', year: 1975 },
  ];