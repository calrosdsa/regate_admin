import { getInstalacionDayHorario } from "@/core/repository/instalacion";
import { DayWeek } from "@/core/type/enums";
import moment from "moment";
import { useEffect, useState } from "react";
import { EditHorarioPrecio } from "./dialog/EditHorarioPrecio";

const dayWeek:Horario[] = [
    {dayName:"Domingo",dayWeek:DayWeek.Domingo},
    {dayName:"Lunes",dayWeek:DayWeek.Lunes},
    {dayName:"Martes",dayWeek:DayWeek.Martes},
    {dayName:"Miercoles",dayWeek:DayWeek.Miercoles},
    {dayName:"Jueves",dayWeek:DayWeek.Jueves},
    {dayName:"Viernes",dayWeek:DayWeek.Viernes},
    {dayName:"Sabado",dayWeek:DayWeek.Sabado}
]
const HorarioWeek = ({instalacionId,cupos,selectedDay,getHorarioDay}:{
    instalacionId:number
    selectedDay:number | null
    cupos:Cupo[]
    getHorarioDay:(day:number)=>void
}) =>{
    // const [cupos,setCupos] = useState<Cupo[]>([])
    // const [selectedDay,setSelectedDay] = useState<number | null>(null)
    const [editHorarioDialog,setEditHorarioDialog] = useState(false)
    const [cupo,setCupo] = useState<Cupo | undefined>(undefined)


    const openEditDialog = (cupo?:Cupo)=>{
        setCupo(cupo)
        setEditHorarioDialog(true)
        console.log(cupo)
    }
   

    // useEffect(()=>{
    //     if(currentDay != undefined){
    //         getHorarioDay(currentDay)
    //     }
    //     console.log(currentDay)
    // },[instalacionId])


    return(
        <>
        {editHorarioDialog &&
        <EditHorarioPrecio
        open={editHorarioDialog}
        close={()=>setEditHorarioDialog(false)}
        cupo={cupo}
        />
        }
        <div className="mt-2">

        <div className="flex w-full space-x-3 overflow-auto pb-4 relative">

            <div className="h-5"/>
            {dayWeek.map((item)=>{
                return(
                    <div key={item.dayWeek} onClick={()=>getHorarioDay(item.dayWeek)}
                     className={`${selectedDay == item.dayWeek ? 'button':'button-inv'}`}>
                        {item.dayName}
                    </div>
                )
            })}

        </div>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-2">
            {cupos.map((item,index)=>{
                return(
                    <div key={index} onClick={()=>openEditDialog(item)}
                    className={`card grid grid-cols-2 ${item.available || ' opacity-50'}`}>
                        <div className="grid">
                        <span className="label">Hora</span>
                        <span className="text-sm">{item.time.slice(0,5)}</span>
                        </div>

                        <div className="grid">
                        <span className="label">Precio</span>
                        <span className="text-sm">{item.price == undefined ? "Sin definir" : item.price}</span>
                        </div>
                    </div>
                )
            })}
        </div>
        </div>
        </>
    )
}

export default HorarioWeek;