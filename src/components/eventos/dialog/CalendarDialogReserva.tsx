import DialogLayout from "@/components/util/dialog/DialogLayout"
import InputDateTime from "@/components/util/input/InputDateTime"
import SelectTime from "@/components/util/select/SelectTime"
import { Repeat, UntilOptions } from "@/core/type/enums"
import moment from "moment"
import { useState } from "react"

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
const CalendarDialogReserva = ({close,open,startDate,startTime="00:00"}:{
    close:()=>void
    open:boolean
    startDate?:string
    startTime?:string
}) =>{
    const [repeatOption,setRepeatOption] = useState(Repeat.NEVER)
    const [untilOption,setUntilOption] = useState(UntilOptions.DATE)
    const [untilDate,setUntilDate] = useState(startDate || "")
    return(
        <DialogLayout
        close={close}
        open={open}
        className=" max-w-md h-[60vh]"
        title="Reservar"
        >
        <div className="grid sm: grid-cols-2 gap-x-4 gap-y-4">
            <InputDateTime
            label="Inicio"
            startDate={startDate}
            startTime={startTime}
            />
            <InputDateTime
            label="Fin"
            startDate={startDate}
            startTime={startTime}
            />

            <div className="flex space-x-2 items-center col-span-full">
                <input id="all-day" type="checkbox" />
                <label htmlFor="all-day" className="text-xs">Todo el dia</label>
            </div>

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

            {repeatOption == Repeat.DAYLY &&
            <div className=" grid">
                <span className="label">Repetir cada</span>
                <div className="flex space-x-2 items-center">
                <input type="number" className="input h-8 w-20" min={1} />
                <span className="text-sm">Dia(s)</span>
                </div>
            </div>
            }

            <div className="grid">
                <span className="label">Termina</span>

                <div className="flex space-x-2 items-center mt-2">
                <select name="repeat" id="repeat" className=" select h-8 text-sm"
                >
                            <option className="text-sm"
                             value={UntilOptions.DATE}>Hasta</option>
                             <option className="text-sm"
                             value={UntilOptions.COUNT}>Por conteo</option>
                </select> 
                {untilOption == UntilOptions.COUNT &&
                <input type="number" className="input h-8 w-full" min={1} />
                }
                 {untilOption == UntilOptions.DATE &&
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

        </div>
        
        </DialogLayout>
        )
}

export default CalendarDialogReserva;