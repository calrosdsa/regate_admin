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
import { Box, MenuItem, Select, TextField, Typography, useTheme } from "@mui/material";
import moment from "moment";
import { Truculenta } from "next/font/google";
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
    const theme = useTheme()
    const startDate = startTime.format("YYYY-MM-DD")
    const [repeatOption,setRepeatOption] = useState(Repeat.NEVER)
    const [date,setDate] = useState<moment.Moment>(startTime || moment())
    const [untilOption,setUntilOption] = useState(EndOptions.DATE)
    const [selectedDaysWeeks,setSelectedDaysWeeks] = useState<number[]>([])
    const [instalaciones,setInstalaciones] = useState<InstalacionWithReservaCupos[]>([])
    const [loadingInstalaciones,setLoadingInstalaciones] = useState<number[]>([])
    const [selectedInstalaciones,setSelectedInstalaciones] = useState<number[]>([])
    const [loadingSaveButton,setLoadingSaveButton] = useState(false)
    // const [start,setStart] = useState(startTime?.format("HH:mm"))
    const [start,setStart] = useState(startTime)
    const [timeSelectError,setTimeSelectError] = useState(false)
    const [times,setTimes] = useState<string[]>([])
    const [end,setEnd] = useState(startTime.clone().add(30,"minutes"))
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
        const startM = moment(date.format("YYYY-MM-DD") + " " + start.format("HH:mm"))
        // const startM = start
        const endM = moment(date.format("YYYY-MM-DD") + " " + end.format("HH:mm"))
        // const endM = end
        let endHours =0
        if(endM.isBefore(startM)){
            setTimeSelectError(true)
            console.log("display error")
        }
        if(startM.date() != endM.date()){
            endHours = 24 * 60
        }else{
            endHours = endM.hour() * 60
        }
        const minutesDifference = (endHours + endM.minute()) - ((startM.hour()*60) + startM.minute()) 
        const dayDiff = moment(until_date.format("YYYY-MM-DD") + " " + start.format("HH:mm")).diff(startM,"days") +1
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
        console.log(times)
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
            testId={`inicio-0`}
            isError={timeSelectError}
            setTime={(e)=>{
                setStart(e)
                console.log(e.format())
                if(end == undefined){
                    // setEnd(e)
                }
            }}
            date={startTime.format("YYYY-MM-DD")}
            label="Inicio"
            size="medium"
            />
             <TimeSelect
            time={end}
            testId={`fin-0`}
            isError={timeSelectError}
            setTime={(e)=>{
                console.log(e.format())
                // const t = moment(date.format("YYYY-MM-DD" + " " + e.format("HH:mm")))
                setEnd(e)
            }}
            date={startTime.format("YYYY-MM-DD")}
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
                data-testid="repeat"
                size="medium"
                sx={{mt:1}}
                variant="outlined"
                select
                onChange={(e)=>setRepeatOption(Number(e.target.value))}
                >
                {repeatOptions.map((item,idx)=>{
                        return(
                            <MenuItem 
                            data-testid={`repeat-option-${idx}`}
                             key={idx} value={item.repeat}>{item.label}</MenuItem>
                        )
                    })}
                </TextField>
              
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
                        <Box
                        data-testid={`day-${item.value}`}
                        sx={{
                            backgroundColor: selectedDaysWeeks.includes(item.value)
                            ? (
                                theme.palette.mode == "dark" ?
                                theme.palette.primary.dark :
                                theme.palette.primary.light
                            )
                            : theme.palette.background.default
                        }}
                        key={index} 
                        onClick={()=>{
                            if(selectedDaysWeeks.includes(item.value)){
                                const news = selectedDaysWeeks.filter(t=>t != item.value)
                                setSelectedDaysWeeks(news)
                            }else{
                                setSelectedDaysWeeks([...selectedDaysWeeks,item.value])
                            }
                        }}
                        className={`rounded-full w-9 h-9 flex justify-center items-center noSelect border
                       }
                        `}>
                            {item.day.slice(0,1)}
                        </Box>
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
                 testId="until_date"
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
            testId="continuar-reserva-c"
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