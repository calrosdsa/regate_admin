import InstalacionCard from "@/components/establecimiento/instalacion/InstalacionCard"
import DialogLayout from "@/components/util/dialog/DialogLayout"
import InputDateTime from "@/components/util/input/InputDateTime"
import SelectTime from "@/components/util/select/SelectTime"
import { days } from "@/context/actions/chart-actions"
import { GetInstalaciones } from "@/core/repository/instalacion"
import { Repeat, EndOptions, ReservaType } from "@/core/type/enums"
import { dayMonth } from "@/core/util/data"
import moment from "moment"
import { ChangeEvent, useState } from "react"
import Image from "next/image"
import { CheckRervasCuposAvailables, CreateReservaCupos } from "@/core/repository/reservas"
import { ReservaFromEventoRequest } from "@/core/type/evento"
import Loader from "@/components/util/loaders/Loader"
import Spinner from "@/components/util/loaders/Spinner"
import { toast } from "react-toastify"
import { successfulMessage, unexpectedError } from "@/context/config"
import ButtonWithLoader from "@/components/util/button/ButtonWithLoader"
import Loading from "@/components/util/loaders/Loading"

const repeatOptions = [
    {
        label:"Nunca",
        repeat:Repeat.NEVER
    },
    {
        label:"Diariamente",
        repeat:Repeat.DAYLY
    },
    {
        label:"Semanalmente",
        repeat:Repeat.WEEKLY
    },
    {
        label:"Mensualmente",
        repeat:Repeat.MOTHTLY
    },
]
type InstalacionWithReservaCupos = {
    instalacion:Instalacion
    cupos:ReservaCupo[]
}
const CalendarDialogReserva = ({close,open,startDate,startTime,uuid,reserva_type,uuidEvent}:{
    close:()=>void
    open:boolean
    startDate?:string
    startTime?:moment.Moment
    uuid:string
    reserva_type:ReservaType
    uuidEvent:string
}) =>{
    const [repeatOption,setRepeatOption] = useState(Repeat.NEVER)
    const [untilOption,setUntilOption] = useState(EndOptions.DATE)
    const [selectedWeeks,setSelectedWeeks] = useState<number[]>([])
    const [tab,setTab] = useState(0)
    const [instalaciones,setInstalaciones] = useState<InstalacionWithReservaCupos[]>([])
    const [loadingInstalaciones,setLoadingInstalaciones] = useState<number[]>([])
    const [selectedInstalaciones,setSelectedInstalaciones] = useState<number[]>([])
    const [loadingSaveButton,setLoadingSaveButton] = useState(false)
    const [loading,setLoading] = useState(false)
    const [start,setStart] = useState({
        date:startDate,
        time:startTime?.format("HH:mm")
    })
    const [cupos,setCupos] = useState<CupoR[]>([])
    const [end,setEnd] = useState({
        date:startDate,
        time:startTime?.add(30,"minutes").format("HH:mm")
    })
    const [filterData,setFilterData] = useState({
        repeat_every:"1",
        until_date:startDate,
        until_count:"1",
        day_month:"1",
        day_month_position:"",
        day_week:"",
        month_day_select:"0"
    })
    const {repeat_every,until_count,until_date,day_week,day_month,day_month_position,month_day_select} = filterData

    const getCurrentRepatName = () =>{
        switch(repeatOption){
            case Repeat.DAYLY:
                return "Day"
            case Repeat.WEEKLY:
                return "Semana"
            case Repeat.MOTHTLY:
                return "Mes"
            default:
                return ""
        }
    }

    const onChange = (e:ChangeEvent<HTMLInputElement>)=>{
        setFilterData({
            ...filterData,
            [e.target.name]:e.target.value
        })
    }
    const onChangeSelect = (e:ChangeEvent<HTMLSelectElement>)=>{
        setFilterData({
            ...filterData,
            [e.target.name]:e.target.value
        })
    }

    const getInstalaciones = async () =>{
        try{
            setLoading(true)
            setInstalaciones([])
            const res:Instalacion[] = await GetInstalaciones(uuid)
            const instalacionWithReservaCupos = res.map((item):InstalacionWithReservaCupos=>{
                return {instalacion:item,cupos:[]}
            })
            setLoading(false)
            setInstalaciones(instalacionWithReservaCupos)
        }catch(e){
            setLoading(false)
            console.log(e)
        }
    }

    const validateToContinue = () =>{
        const startM = moment(start.date + " " + start.time)
        const endM = moment(end.date + " " + end.time)
        const diff = ((endM.hour()*60) + endM.minute()) - ((startM.hour()*60) + startM.minute()) 
        const dayDiff = moment(until_date + " " + start.time).diff(startM,"days") +1
        switch(repeatOption){
            case Repeat.NEVER:
                for(let t =0;t < (diff/30);t++){
                    const cupo:CupoR = {
                        start_date:moment(startM).add(30*t,"minutes").format(),
                        precio:100,
                    }
                    setCupos(e=>[...e,cupo])
                }
                break;
            case Repeat.DAYLY:
                let count:number;
                if(untilOption == EndOptions.DATE){
                    count = dayDiff
                }else {
                    count = Number(until_count)
                }
                for(let i=0;i<count;i=Number(repeat_every)+i){
                    for(let t =0;t < (diff/30);t++){
                        const cupo:CupoR = {
                            start_date:moment(startM).add(i,'days').add(30*t,"minutes").format(),
                            precio:100,
                        }
                        setCupos(e=>[...e,cupo])
                    }
                  }  
                  console.log("dasmdoas")
                break;
                
            }
            
            console.log(cupos)
                setTab(1)
        getInstalaciones()
    }

    const addInstalacionLoader = (instalacionId:number) =>{ setLoadingInstalaciones([...loadingInstalaciones,instalacionId]) }
    const removeInstalacionLoader = (instacionId:number) => {
        const filterList = loadingInstalaciones.filter(item=>item != instacionId)
        setLoadingInstalaciones(filterList)
    }
    const addInstalacion = (instalacionId:number) =>{ setSelectedInstalaciones([...selectedInstalaciones,instalacionId]) }
    const removeInstalacion = (instacionId:number) => {
        const filterList = selectedInstalaciones.filter(item=>item != instacionId)
        setSelectedInstalaciones(filterList)
    }
    // const addOrRemoveInstalacion = (instalacionId:number) =>{
    //     if(selectedInstalaciones.includes(instalacionId)){
    //         const filterList = selectedInstalaciones.filter(item=>item != instalacionId)
    //         setSelectedInstalaciones(filterList)
    //     }else{
    //         setSelectedInstalaciones([...selectedInstalaciones,instalacionId])
    //     }
    // }

    const checkReservaCupoAvailables = async(instalacionId:number,establecimientoId:number) => {
        try{
            console.log(cupos)
            addInstalacionLoader(instalacionId)
            if(selectedInstalaciones.includes(instalacionId)){
                removeInstalacion(instalacionId)
                removeInstalacionLoader(instalacionId)
                return
            }
            const request:ReservaFromEventoRequest = {
                cupos:cupos,
                establecimiento_id:establecimientoId,
                instalaciones:[instalacionId]
            } 
            const res:ReservaCupo[] = await CheckRervasCuposAvailables(request)
            if(res.length == 0){
                console.log("CHECK",res)
                addInstalacion(instalacionId)
            }else{
                const updateInstalacionList = instalaciones.map(item=>{
                    if(item.instalacion.id == instalacionId){
                        item.cupos = res
                    }
                    return item
                })
                setInstalaciones(updateInstalacionList)
            }
            removeInstalacionLoader(instalacionId)
        }catch(err){
            removeInstalacionLoader(instalacionId)
            console.log(err)
        }
    }

    const createReservaCupos = async() =>{
        try{
            setLoadingSaveButton(true)
            const request:ReservaFromEventoRequest = {
                cupos:cupos,
                evento_uuid:uuidEvent,
                reserva_type:reserva_type,
                instalaciones:selectedInstalaciones,
                establecimiento_id:instalaciones[0].instalacion.establecimiento_id | 0
            }
            const res = await CreateReservaCupos(request)
            console.log(res)
            toast.success(successfulMessage)
            setLoadingSaveButton(false)
        }catch(e){
            toast.error(unexpectedError)
            setLoadingSaveButton(false)
            console.log(e)
        }
    }


    return(
        <DialogLayout
        close={close}
        open={open}
        className=" max-w-md "
        title="Reservar"
        >
            {tab == 0 &&
        <div className="grid sm:grid-cols-2 gap-x-4 gap-y-4">
            <InputDateTime
            label="Inicio"
            datetime={start}
            setTime={(e)=>{
                setStart({...start,time:e})
            }}
            setDate={(e)=>{
                setStart({...start,date:e})
            }}
            />
            <InputDateTime
            label="Fin"
            datetime={end}
            setTime={(e)=>{
                setEnd({...end,time:e})
            }}
            setDate={(e)=>{
                setEnd({...end,date:e})
            }}
            />

            {/* <div className="flex space-x-2 items-center col-span-full">
                <input id="all-day" type="checkbox" />
                <label htmlFor="all-day" className="text-sm">Todo el dia</label>
            </div> */}

            <div className=" grid">
                <span className="label">Repetir</span>
                <select name="repeat" id="repeat" className=" select h-8 text-sm mt-2"
                onChange={(e)=>setRepeatOption(Number(e.target.value))}>
                    {repeatOptions.map((item,idx)=>{
                        return(
                            <option className="text-sm"
                             key={idx} value={item.repeat}>{item.label}</option>
                        )
                    })}
                </select> 
            </div>

            {repeatOption != Repeat.NEVER &&
            <div className=" grid">
                <span className="label">Repetir cada</span>
                <div className="flex space-x-2 items-center">
                <input type="number" name="repeat_every" className="input h-8 w-20" min={1} 
                value={repeat_every} onChange={onChange} />
                <span className="text-sm">
                    {getCurrentRepatName()}(s)
                    </span>
                </div>
            </div>
            }


           {(repeatOption != Repeat.NEVER && repeatOption != Repeat.DAYLY) &&
            
               <div className="grid">
                <span className="label">Repetir en</span>
                {repeatOption == Repeat.WEEKLY && 
                <div className="flex flex-wrap gap-2 p-2" >
                {days.map((item,index) =>{
                    return (
                        <div key={index} 
                        onClick={()=>{
                            if(selectedWeeks.includes(item.value)){
                                const news = selectedWeeks.filter(t=>t != item.value)
                                setSelectedWeeks(news)
                            }else{
                                setSelectedWeeks([...selectedWeeks,item.value])
                            }
                        }}
                        className={`icon-button flex justify-center items-center noSelect
                        ${selectedWeeks.includes(item.value) ? "text-primary bg-primary bg-opacity-10"
                        :"border-[1px] border-gray-300"}
                        `}>
                            {item.day.slice(0,1)}
                        </div>
                        )
                    })}
                </div>
                }
                {repeatOption == Repeat.MOTHTLY && 
                <>
                <div className="flex items-center space-x-3 p-2">
                    <div className="flex space-x-2">
                    <input type="radio" name="month_day_select" id="month_day_select"
                    value={month_day_select} onChange={onChange} checked />
                    </div>
                    <label className="text-sm" htmlFor="month_day_select">Dia</label>
                    <input onChange={onChange} value={day_month}
                    name="day_month" type="number" className="input h-8 w-20" min={1} 
                    /> 
                </div>

                <div className="flex space-x-3 p-2">
                    <input type="radio" name="month_day_select" 
                    value={month_day_select} onChange={onChange}/>
                    <div className="grid gap-y-2">
                    <select name="day_month_position" value={day_month_position} id="" className="select h-8 text-sm"
                    onChange={onChangeSelect}>
                        {dayMonth.map((item,idx)=>{
                            return(
                                <option key={idx} value={item.value}>{item.name}</option>
                                )
                            })}
                    </select>

                    <select name="day_week" id="" className="select h-8 text-sm" value={day_week}
                    onChange={onChangeSelect}>
                        {days.map((item,idx)=>{
                            return(
                                <option key={idx} value={item.value}>{item.day}</option>
                                )
                            })}
                    </select>
                    </div>
                </div>
                </>
                }

            </div>
            }



            {repeatOption != Repeat.NEVER &&
            <div className="grid">
                <span className="label">Termina</span>

                <div className="flex space-x-2 r mt-2">
                <select name="repeat" id="repeat" className=" select h-8 text-sm"
                onChange={(e)=>setUntilOption(Number(e.target.value))}
                >
                            <option className="text-sm"
                             value={EndOptions.DATE}>Hasta</option>
                             <option className="text-sm"
                             value={EndOptions.COUNT}>Por conteo</option>
                </select> 
                {untilOption == EndOptions.COUNT &&
                <input type="number" className="input h-8 w-full" min={1} 
                name="until_count" value={until_count} onChange={onChange}/>
                }
                 {untilOption == EndOptions.DATE &&
                 <>
        <label className="relative flex items-center input h-8 p-0 w-full ">
            <input
            type="text"
            value={moment(until_date).format("MM/DD/YY")}
            className=" outline-none px-2 w-full text-xs"/>
            <label htmlFor={"until-date"} className="h-8 border-l  border-gray-400 px-1
             grid place-content-center hover:bg-gray-200 w-10 ">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd" />
            </svg>
            </label>
            <input
            type="date"
            className="w-0 "
            name="until_date"
            value={until_date}
            onChange={onChange}
            min={new Date().toISOString().split('T')[0]}
            id={"until-date"}
            />
           
                </label>
                 </>
                }
                </div>
            </div>
        }


        </div>
        }
        {tab == 1 &&
        <div>
            {loading && 
            <Loading
            className="flex w-full justify-center py-20"
            loading={loading}
            />
            }
            {instalaciones.map((item,index)=>{
                return(
                    <div>
                            <div key={index} 
                            onClick={()=>checkReservaCupoAvailables(item.instalacion.id,item.instalacion.establecimiento_id)}
                            className="flex space-x-3 p-2 items-center cursor-pointer border-b relative
                            hover:bg-gray-100 justify-between">
                                <div className="flex items-center w-full">

                                <div className="w-12">
                                    {/* <CommonImage
                                    src={item.instalacion.portada}
                                    h={100} w={120} className={"h-20 w-36 object-cover rounded-lg"}/> */}
                                {(item.instalacion.portada == null || item.instalacion.portada == "") ?
                                <Image
                                src="/images/img-default.png"
                                height={100}
                                width={150}
                                alt={item.instalacion.name} 
                                className=" rounded-full h-12 w-12   object-contain bg-gray-200 p-2"
                                />
                                :
                                <Image
                                src={item.instalacion.portada as string}
                                height={100}
                                width={150}
                                alt={item.instalacion.name} 
                                className=" rounded-full h-12 w-12  object-cover"
                                />
                            }
                            </div>
                        <span className="font-medium text-sm  line-clamp-2 w-1/2
                        p-1 z-10 rounded-br-lg">{item.instalacion.name}</span>
                        </div>
                        {loadingInstalaciones.includes(item.instalacion.id)&&
                        <Spinner/>
                        }
                        {selectedInstalaciones.includes(item.instalacion.id)&&
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                      </svg>
                      
                        }
                    </div>

                    {item.cupos.length > 0 &&
                    <div className="flex flex-col">
                        <span className="subtitle">No se pudo reservar porque hace conflicto con las siguientes horas:</span>

                        {item.cupos.map((item,idx)=>{
                            return (
                                <div className="" key={idx}>
                                    <span className="text-sm">{idx+1}.- {moment(item.start_date).utc().format("yyyy-MM-DD HH:mm")}</span>
                                </div>
                            )
                        })}

                    </div>
                    }

                    </div>
                )
            })}
        </div>
        }

        
        <div className=" mt-4 flex w-full justify-end space-x-2">
            {tab == 1 && 
            <button className="button2 "
            onClick={()=>{
                setSelectedInstalaciones([])
                
                setTab(0)
            }}
            >
                Volver
            </button>
            }
            <ButtonWithLoader
            loading={loadingSaveButton}
            disabled={loadingSaveButton}
            title={tab == 0 ?"Continuar":"Guardar"}
            onClick={()=>{
                if(tab == 0){
                    validateToContinue()
                }else{
                    createReservaCupos()
                }
            }}
            />
            {/* <button disabled={loadingSaveButton}
             onClick={()=>validateToContinue()}
             className={`button`}>
                {tab == 0 && "Continuar"}
                {tab == 1 && "Guardar"}
             </button> */}
        </div>

        </DialogLayout>
        )
}

export default CalendarDialogReserva;