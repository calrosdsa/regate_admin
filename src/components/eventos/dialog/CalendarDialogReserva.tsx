import DialogLayout from "@/components/util/dialog/DialogLayout"
import InputDateTime from "@/components/util/input/InputDateTime"
import SelectTime from "@/components/util/select/SelectTime"
import { Repeat } from "@/core/type/enums"
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
                <select name="repeat" id="repeat" className=" select h-8 text-sm"
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
                <span>Termina</span>
                <select name="repeat" id="repeat" className=" select h-8 text-sm"
                >
                            <option className="text-sm"
                             value={0}>Hasta</option>
                             <option className="text-sm"
                             value={0}>Por conteo</option>
                </select> 
            </div>

        </div>

        </DialogLayout>
    )
}

export default CalendarDialogReserva;