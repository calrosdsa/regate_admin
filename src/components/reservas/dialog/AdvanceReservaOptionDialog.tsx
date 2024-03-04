import ButtonSubmit from "@/components/util/button/ButtonSubmit";
import ButtonWithLoader from "@/components/util/button/ButtonWithLoader";
import DialogLayout from "@/components/util/dialog/DialogLayout";
import TimeSelect from "@/components/util/input/TimeSelect";
import Loading from "@/components/util/loaders/Loading";
import Spinner from "@/components/util/loaders/Spinner";
import { days } from "@/context/actions/chart-actions";
import { successfulMessage, unexpectedError } from "@/context/config";
import { GetInstalaciones } from "@/core/repository/instalacion";
import { CheckRervasCuposAvailables, CreateReservaCupos, DeleteReservaCupos, GenerateReservaCupos } from "@/core/repository/reservas";
import { EndOptions, Http, MonthDaySelectOption, Repeat, ReservaType } from "@/core/type/enums";
import { ReservaFromEventoRequest } from "@/core/type/evento";
import { repeatOptions } from "@/core/util/data";
import moment from "moment";
import Image from "next/image";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";


const AdvanceReservaOptionDialog = ({
    close,open,startDate,startTime,uuid,instalacionId,generateCupos
}:{
        close:(closeParentDialog:boolean)=>void
        open:boolean
        uuid:string
        startDate?:string
        startTime?:moment.Moment
        instalacionId:number
        generateCupos:(e:CupoReserva[])=>void
}) => {

    const [repeatOption,setRepeatOption] = useState(Repeat.NEVER)
    const [untilOption,setUntilOption] = useState(EndOptions.DATE)
    const [selectedDaysWeeks,setSelectedDaysWeeks] = useState<number[]>([])
    const [instalaciones,setInstalaciones] = useState<InstalacionWithReservaCupos[]>([])
    const [loadingInstalaciones,setLoadingInstalaciones] = useState<number[]>([])
    const [selectedInstalaciones,setSelectedInstalaciones] = useState<number[]>([])
    const [loadingSaveButton,setLoadingSaveButton] = useState(false)
    const [start,setStart] = useState(startTime?.format("HH:mm"))
    const [times,setTimes] = useState<string[]>([])
    const [end,setEnd] = useState(startTime?.add(30,"minutes").format("HH:mm"))
    const [filterData,setFilterData] = useState({
        repeat_every:"1",
        until_date:startDate,
        until_count:"1",
        day_month:"1",
        day_month_position:"",
        day_week:"",
        month_day_select:MonthDaySelectOption.BY_DAY_OF_MONTH
    })
    const {repeat_every,until_count,until_date,day_month} = filterData

    const getCurrentRepatName = () =>{
        switch(repeatOption){
            case Repeat.DAYLY:
                return "Día"
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

  

    const validateToContinue = async() =>{
        const startM = moment(startDate + " " + start)
        const endM = moment(startDate + " " + end)
        const minutesDifference = ((endM.hour()*60) + endM.minute()) - ((startM.hour()*60) + startM.minute()) 
        const dayDiff = moment(until_date + " " + start).diff(startM,"days") +1
        let count:number;
                if(untilOption == EndOptions.DATE){
                    count = dayDiff
                }else {
                    count = Number(until_count)
                }
        switch(repeatOption){
            case Repeat.NEVER:
                for(let t =0;t < (minutesDifference/30);t++){
                    // const cupo:CupoR = {
                    //     start_date:moment(startM).add(30*t,"minutes").format(),
                    //     precio:100,
                    // }
                    setTimes(e=>[...e,moment(startM).add(30*t,"minutes").format()])
                }
                break;
            case Repeat.DAYLY:
                for(let i=0;i<count;i=Number(repeat_every)+i){
                    for(let t =0;t < (minutesDifference/30);t++){
                        // const cupo:CupoR = {
                        //     start_date:moment(startM).add(i,'days').add(30*t,"minutes").format(),
                        //     precio:100,
                        // }
                        setTimes(e=>[...e,moment(startM).add(i,'days').add(30*t,"minutes").format()])
                    }
                  }  
                break;
            case Repeat.WEEKLY:
                for(let i=0;i<count;i=Number(repeat_every)+i){
                    for(let t =0;t < (minutesDifference/30);t++){
                        const today = moment(startM).add(i,'days').add(30*t,"minutes")
                        if(selectedDaysWeeks.includes(today.day())){
                            // const cupo:CupoR = {
                            //     start_date:today.format(),
                            //     precio:100,
                            // }
                            setTimes(e=>[...e,moment(startM).add(i,'days').add(30*t,"minutes").format()])
                        }
                    }
                }
                break;
            case Repeat.MOTHTLY:
                for(let i=0;i<count;i=Number(repeat_every)+i){
                    for(let t =0;t < (minutesDifference/30);t++){
                        const today = moment(startM).add(i,'days').add(30*t,"minutes") 
                        if(today.date() == Number(day_month)){
                            // const cupo:CupoR = {
                            //     start_date:today.format(),
                            //     precio:100,
                            // }
                            setTimes(e=>[...e,moment(startM).add(i,'days').add(30*t,"minutes").format()])
                        }
                        // if(today)
                    }
                } 
                break;
            }
            
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


    const checkReservaCupoAvailables = async(instalacionId:number,establecimientoId:number) => {
        try{
          
            addInstalacionLoader(instalacionId)
            if(selectedInstalaciones.includes(instalacionId)){
            removeInstalacion(instalacionId)
            removeInstalacionLoader(instalacionId)
            return
            }
            const request:ReservaFromEventoRequest = {
                times:times,
                establecimiento_id:establecimientoId,
                instalaciones:[instalacionId]
            } 
            const res:ReservaCupo[] = await CheckRervasCuposAvailables(request)
            if(res.length == 0){
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
        }
    }

    const generateReservaCupos = async() =>{
        try{
            if(times.length ==0) return
            setLoadingSaveButton(true)
            const r:GenerateReservaCupoRequest = {
                times:times,
                instalacion_id:instalacionId,
                establecimiento_uuid:uuid
            } 
            const res:GenerateReservaCupoResponse = await GenerateReservaCupos(r)
            console.log("RESPONSE",res)
            generateCupos(res.reserva_cupos)
            setLoadingSaveButton(false)
            close(false)
        }catch(e){
            toast.error(unexpectedError)
            setLoadingSaveButton(false)
        }
    }

    const onSubmit = async(e:FormEvent<HTMLFormElement>) =>{
        try{
            e.preventDefault()
            await validateToContinue()
        }catch(error){

        }
    }
    useEffect(()=>{
        generateReservaCupos()
    },[times])


    return (
        <>
        <DialogLayout
        open={open}
        allowFullScreen={true}
        close={()=>close(true)}
        className="max-w-lg"
        >
        <form onSubmit={onSubmit}>
            <div className="grid sm:grid-cols-2 gap-x-4 gap-y-4 ">

            <TimeSelect
            time={start}
            setTime={(e)=>{
                setStart(e)
                console.log(end)
                if(end == undefined){
                    // setEnd(e)
                }
            }}
            label="Inicio"
            />
             <TimeSelect
            time={end}
            setTime={(e)=>{setEnd(e)}}
            label="Fin"
            />
       

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
                            if(selectedDaysWeeks.includes(item.value)){
                                const news = selectedDaysWeeks.filter(t=>t != item.value)
                                setSelectedDaysWeeks(news)
                            }else{
                                setSelectedDaysWeeks([...selectedDaysWeeks,item.value])
                            }
                        }}
                        className={`icon-button flex justify-center items-center noSelect
                        ${selectedDaysWeeks.includes(item.value) ? "text-primary bg-primary bg-opacity-10"
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
                    <span className="text-sm">Día</span>
                    <input onChange={onChange} value={day_month}
                    name="day_month" type="number" className="input h-8 w-20" min={1} 
                    /> 
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
            value={moment(until_date).format("DD/MM/YY")}
            onChange={()=>{}}
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


        <div className=" mt-4 flex w-full justify-end space-x-2">
            <ButtonSubmit
            loading={loadingSaveButton}
            className="w-24"
            // disabled={loadingSaveButton}
            title={"Continuar"}
            />
          
        </div>

        </form>
      

        


        </DialogLayout>
        </>
    )
}

export default AdvanceReservaOptionDialog;