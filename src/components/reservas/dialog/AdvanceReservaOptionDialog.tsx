import ButtonSubmit from "@/components/util/button/ButtonSubmit";
import ButtonWithLoader from "@/components/util/button/ButtonWithLoader";
import DialogLayout from "@/components/util/dialog/DialogLayout";
import InputDate from "@/components/util/input/InputDate";
import TimeSelect from "@/components/util/input/TimeSelect";
import Loading from "@/components/util/loaders/Loading";
import Spinner from "@/components/util/loaders/Spinner";
import { days } from "@/context/actions/chart-actions";
import { successfulMessage, unexpectedError } from "@/context/config";
import { GetInstalaciones } from "@/core/repository/instalacion";
import { CheckRervasCuposAvailables, CreateReservaCupos, DeleteReservaCupos, GenerateReservaCupos } from "@/core/repository/reservas";
import { EndOptions, Http, MonthDaySelectOption, Repeat, ReservaType } from "@/core/type/enums";
import { repeatOptions } from "@/core/util/data";
import { MenuItem, Select, TextField, Typography } from "@mui/material";
import moment from "moment";
import Image from "next/image";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";


const AdvanceReservaOptionDialog = ({
    close,open,startTime,uuid,instalacionId,generateCupos
}:{
        close:(closeParentDialog:boolean)=>void
        open:boolean
        uuid:string
        startTime:moment.Moment
        instalacionId:number
        generateCupos:(e:CupoReserva[])=>void
}) => {
    const startDate = startTime.format("YYYY-MM-DD")
    const [repeatOption,setRepeatOption] = useState(Repeat.NEVER)
    const [date,setDate] = useState<moment.Moment>(startTime || moment())
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
        until_date:startTime,
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

    const onChange = (e:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)=>{
        setFilterData({
            ...filterData,
            [e.target.name]:e.target.value
        })
    }

  

    const validateToContinue = async() =>{
        const startM = moment(startDate + " " + start)
        const endM = moment(startDate + " " + end)
        const minutesDifference = ((endM.hour()*60) + endM.minute()) - ((startM.hour()*60) + startM.minute()) 
        const dayDiff = moment(until_date.format("YYYY-MM-DD") + " " + start).diff(startM,"days") +1
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
        title={"Reserva Customizada"}
        className="max-w-lg"
        >
        <form onSubmit={onSubmit} className="mt-4">
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
            size="medium"
            />
             <TimeSelect
            time={end}
            setTime={(e)=>{setEnd(e)}}
            label="Fin"
            size="medium"
            />

            <div>
            <Typography variant="body2">Fecha</Typography>
            <InputDate
            value={date}
            onChange={(e)=>setDate(e)}
            minDate={moment()}
            />
            </div>


            <div className=" grid">
                <Typography variant="body2">Repetir</Typography>
                <TextField
                name="repeat"
                id="repeat" 
                size="medium"
                sx={{mt:1}}
                variant="outlined"
                select
                onChange={(e)=>setRepeatOption(Number(e.target.value))}
                >
                {repeatOptions.map((item,idx)=>{
                        return(
                            <MenuItem 
                             key={idx} value={item.repeat}>{item.label}</MenuItem>
                        )
                    })}
                </TextField>
                {/* <select name="repeat" id="repeat" className=" select h-8 text-sm mt-2"
                onChange={(e)=>setRepeatOption(Number(e.target.value))}>
                    {repeatOptions.map((item,idx)=>{
                        return(
                            <option className="text-sm"
                             key={idx} value={item.repeat}>{item.label}</option>
                        )
                    })}
                </select>  */}
            </div>

            {repeatOption != Repeat.NEVER &&
            <div className=" grid">
                <Typography variant="body2">Repetir Cada</Typography>

                <div className="flex space-x-2 items-center">
                <TextField type="number" name="repeat_every" 
                sx={{maxWidth:100,mt:1}} 
                InputProps={{ inputProps: { min: 0 } }}
                value={repeat_every} onChange={(e)=>{                    
                            onChange(e)
                    }} />
                <span className="text-sm">
                    {getCurrentRepatName()}(s)
                    </span>
                </div>
            </div>
            }


           {(repeatOption != Repeat.NEVER && repeatOption != Repeat.DAYLY) &&
            
               <div className="grid">
                <Typography variant="body2">Repetir en</Typography>

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
                <Typography variant="body2">Día</Typography>
                    <TextField onChange={onChange} value={day_month}
                     sx={{maxWidth:100,mt:1}} 
                     InputProps={{ inputProps: { min: 0 } }}
                    name="day_month" type="number" 
                    /> 
                </div>

                </>
                }

            </div>
            }



            {repeatOption != Repeat.NEVER &&
            <div className="grid col-span-2">
                <Typography variant="body2">Termina</Typography>

                <div className="flex space-x-2">
                <TextField name="repeat" id="repeat" size="medium"  defaultValue={EndOptions.DATE}
                select sx={{mt:1}}
                onChange={(e)=>setUntilOption(Number(e.target.value))}
                >
                            <MenuItem
                             value={EndOptions.DATE}>Hasta</MenuItem>
                             <MenuItem
                             value={EndOptions.COUNT}>Por conteo</MenuItem>
                </TextField> 
                {untilOption == EndOptions.COUNT &&
                <TextField type="number" 
                sx={{maxWidth:100,mt:1}} 
                InputProps={{ inputProps: { min: 0 } }}
                name="until_count" value={until_count} onChange={onChange}/>
                }
                 {untilOption == EndOptions.DATE &&
                 <>
                 <InputDate
                 value={until_date}
                 onChange={(e)=>{setFilterData({
                    ...filterData,
                    until_date:e
                 })}}
                 minDate={date}
                 />
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