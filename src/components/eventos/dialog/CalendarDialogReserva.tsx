import InstalacionCard from "@/components/establecimiento/instalacion/InstalacionCard"
import DialogLayout from "@/components/util/dialog/DialogLayout"
import InputDateTime from "@/components/util/input/InputDateTime"
import SelectTime from "@/components/util/select/SelectTime"
import { days } from "@/context/actions/chart-actions"
import { GetInstalaciones } from "@/core/repository/instalacion"
import { Repeat, EndOptions } from "@/core/type/enums"
import { dayMonth } from "@/core/util/data"
import moment from "moment"
import { useState } from "react"
import Image from "next/image"

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
const CalendarDialogReserva = ({close,open,startDate,startTime,uuid}:{
    close:()=>void
    open:boolean
    startDate?:string
    startTime?:moment.Moment
    uuid:string
}) =>{
    const [repeatOption,setRepeatOption] = useState(Repeat.NEVER)
    const [untilOption,setUntilOption] = useState(EndOptions.DATE)
    const [untilDate,setUntilDate] = useState(startDate || "")
    const [selectedWeeks,setSelectedWeeks] = useState<number[]>([])
    const [tab,setTab] = useState(0)
    const [instalaciones,setInstalaciones] = useState<Instalacion[]>([])
    const [start,setStart] = useState({
        date:startDate,
        time:startTime?.format("HH:mm")
    })
    const [end,setEnd] = useState({
        date:startDate,
        time:startTime?.add(30,"minutes").format("HH:mm")
    })

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

    const getInstalaciones = async () =>{
        try{
            setInstalaciones([])
            const res = await GetInstalaciones(uuid)
            setInstalaciones(res)
        }catch(e){
            console.log(e)
        }
    }

    const validateToContinue = () =>{
        setTab(1)
        getInstalaciones()
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
                <input type="number" className="input h-8 w-20" min={1} />
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
                    <input type="radio" name="moth-day-select" id="moth-day-select"/>
                    </div>
                    <label className="text-sm" htmlFor="moth-day-select">Dia</label>
                    <input type="number" className="input h-8 w-20" min={1} /> 
                </div>

                <div className="flex space-x-3 p-2">
                    <input type="radio" name="moth-day-select" id=""/>
                    <div className="grid gap-y-2">
                    <select name="" id="" className="select h-8 text-sm">
                        {dayMonth.map((item,idx)=>{
                            return(
                                <option key={idx} value={item.value}>{item.name}</option>
                                )
                            })}
                    </select>

                    <select name="" id="" className="select h-8 text-sm">
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
                <input type="number" className="input h-8 w-full" min={1} />
                }
                 {untilOption == EndOptions.DATE &&
                 <>
        <label className="relative flex items-center input h-8 p-0 w-full ">
            <input
            type="text"
            value={moment(untilDate).format("MM/DD/YY")}
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
            onChange={(e)=>{
                setUntilDate(e.target.value)
            }}
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
            {instalaciones.map((item,index)=>{
                return(
                            <div key={index} className="flex space-x-3 p-2  cursor-pointer border-[1px] relative rounded-lg
                            hover:bg-gray-100">
                                <div className="w-36">
                                    {/* <CommonImage
                                    src={item.portada}
                                    h={100} w={120} className={"h-20 w-36 object-cover rounded-lg"}/> */}
                                {(item.portada == null || item.portada == "") ?
                                <Image
                                src="/images/img-default.png"
                                height={100}
                                width={150}
                                alt={item.name} 
                                className=" rounded-lg h-16 w-36   object-contain bg-gray-200 p-2"
                                />
                                :
                                <Image
                                src={item.portada as string}
                                height={100}
                                width={150}
                                alt={item.name} 
                                className=" rounded-lg h-16 w-36  object-cover"
                                />
                            }
                            </div>
                        <span className="font-medium text-sm  line-clamp-2 w-1/2
                        p-1 z-10 rounded-br-lg">{item.name}</span>
                    </div>
                )
            })}
        </div>
        }

        
        <div className=" mt-4 flex w-full justify-end">
            <button onClick={()=>validateToContinue()}
             className="button">Continuar</button>
        </div>

        </DialogLayout>
        )
}

export default CalendarDialogReserva;