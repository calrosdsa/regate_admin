import ButtonIcon from "@/components/util/button/ButtonIcon";
import { getFullName, groupByToMap } from "@/core/util";
import { time } from "console";
import moment from "moment";
import { useEffect, useState } from "react";

type HoraCupo= {
    hour:Date
    show:boolean
    reserva?:CupoReserva
}
// const now = moment().utcOffset(0, true).toJSON().slice(0,10)
// console.log("NOW",now.toJSON().slice(0,10))
// const nowYear = now.year()
// const monthNow = now.month() < 10 ? `0${now.month() +1}`:now.month() +1
// const dayNow = now.day() < 10 ? `0${now.day()}`:now.day()
// console.log(now.daysInMonth())

const ReservaInstalacionCupos = ({cupos,loading,getReservaDetail,selecReservaCupo,selectedCupos,date}:{
    cupos:CupoReserva[]
    selectedCupos:CupoReserva[]
    loading:boolean
    selecReservaCupo:(e:CupoReserva)=>void
    getReservaDetail:(id:number)=>void
    date:Date
}) =>{ 
    const [hoursCupo,setHoursCupo] = useState<HoraCupo[]>([])
    const cupoTime = cupos.map(item=>moment(item.time).utc().format("LT"))
    const [newCupos,setNewCupos]= useState<CupoReserva[]>([])
    // const [selectCupo,setSelectedCupos] = useState<HoraCupo[]>([])
    const colors = ["bg-yellow-500","bg-green-500","bg-blue-500","bg-red-500",
    "bg-cyan-500", "bg-orange-500", "bg-sky-500", "bg-lime-500",
    "bg-emerald-500", "bg-teal-500", "bg-indigo-500", "bg-violet-500","bg-fuchsia-600", "bg-purple-500",
    "bg-pink-500","bg-rose-500","bg-slate-500" ,"bg-gray-500","bg-amber-500",
    "bg-yellow-800","bg-green-800","bg-blue-800","bg-red-800",
    "bg-cyan-800", "bg-orange-800", "bg-sky-800", "bg-lime-800",
    "bg-emerald-800", "bg-teal-800", "bg-indigo-800", "bg-violet-800","bg-fuchsia-600", "bg-purple-800",
    "bg-pink-800","bg-rose-800","bg-slate-800" ,"bg-gray-800","bg-amber-800"
]    
    const getHours = (now:String):HoraCupo[] =>{
        return [
            {hour:new Date(`${now}T00:00:00Z`),show:true},
            {hour:new Date(`${now}T00:30:00Z`),show:false},
            {hour:new Date(`${now}T01:00:00Z`),show:true},
            {hour:new Date(`${now}T01:30:00Z`),show:false},
            {hour:new Date(`${now}T02:00:00Z`),show:true},
            {hour:new Date(`${now}T02:30:00Z`),show:false},
            {hour:new Date(`${now}T03:00:00Z`),show:true},
            {hour:new Date(`${now}T03:30:00Z`),show:false},
            {hour:new Date(`${now}T04:00:00Z`),show:true},
            {hour:new Date(`${now}T04:30:00Z`),show:false},
            {hour:new Date(`${now}T05:00:00Z`),show:true},
            {hour:new Date(`${now}T05:30:00Z`),show:false},
            {hour:new Date(`${now}T06:00:00Z`),show:true},
            {hour:new Date(`${now}T06:30:00Z`),show:false},
            {hour:new Date(`${now}T07:00:00Z`),show:true},
            {hour:new Date(`${now}T07:30:00Z`),show:false},
            {hour:new Date(`${now}T08:00:00Z`),show:true},
            {hour:new Date(`${now}T08:30:00Z`),show:false},
            {hour:new Date(`${now}T09:00:00Z`),show:true},
            {hour:new Date(`${now}T09:30:00Z`),show:false},
            {hour:new Date(`${now}T10:00:00Z`),show:true},
            {hour:new Date(`${now}T10:30:00Z`),show:false},
            {hour:new Date(`${now}T11:00:00Z`),show:true},
            {hour:new Date(`${now}T11:30:00Z`),show:false},
            {hour:new Date(`${now}T12:00:00Z`),show:true},
            {hour:new Date(`${now}T12:30:00Z`),show:false},
            {hour:new Date(`${now}T13:00:00Z`),show:true},
            {hour:new Date(`${now}T13:30:00Z`),show:false},
            {hour:new Date(`${now}T14:00:00Z`),show:true},
            {hour:new Date(`${now}T14:30:00Z`),show:false},
            {hour:new Date(`${now}T15:00:00Z`),show:true},
            {hour:new Date(`${now}T15:30:00Z`),show:false},
            {hour:new Date(`${now}T16:00:00Z`),show:true},
            {hour:new Date(`${now}T16:30:00Z`),show:false},
            {hour:new Date(`${now}T17:00:00Z`),show:true},
            {hour:new Date(`${now}T17:30:00Z`),show:false},
            {hour:new Date(`${now}T18:00:00Z`),show:true},
            {hour:new Date(`${now}T18:30:00Z`),show:false},
            {hour:new Date(`${now}T19:00:00Z`),show:true},
            {hour:new Date(`${now}T19:30:00Z`),show:false},
            {hour:new Date(`${now}T20:00:00Z`),show:true},
            {hour:new Date(`${now}T20:30:00Z`),show:false},
            {hour:new Date(`${now}T21:00:00Z`),show:true},
            {hour:new Date(`${now}T21:30:00Z`),show:false},
            {hour:new Date(`${now}T22:00:00Z`),show:true},
            {hour:new Date(`${now}T22:30:00Z`),show:false},
            {hour:new Date(`${now}T23:00:00Z`),show:true},
            {hour:new Date(`${now}T23:30:00Z`),show:false},
        ]
    }

    const getRamdomColor = (prevColors:string[]):string => {
        if(prevColors.length >= colors.length){
            return colors[Math.floor(Math.random()*colors.length)] 
        }else{
            const newArrayOfColors = colors.filter(color=>!prevColors.includes(color))
            return newArrayOfColors[Math.floor(Math.random()*newArrayOfColors.length)]
        }
    }

    const mergeData = (results:CupoReserva[]) =>{
        const d = groupByToMap<CupoReserva,number | null>(results,(item)=>item.reserva_id)
            let prevColors:string[] = []
             d.forEach((items,key)=>{
                if(key != null){
                    const randomColor = getRamdomColor(prevColors)
                    prevColors =  [...prevColors,randomColor]
                    const updateItems =  items.map((item=>{
                        if(items.map(item=>item.reserva_id).includes(item.reserva_id)){
                            item.color = randomColor
                        }
                        return item
                    }))
                    setNewCupos(v =>[...v,...updateItems])
                }else{
                    setNewCupos(v=>[...v,...items])
                }
            })

       
    }
    
    useEffect(()=>{
        if(newCupos.length >0){
            const now =moment(date).utcOffset(0, true).format().slice(0,10)
            const hourCupos = getHours(now)
            const newHoursCupo =  hourCupos.map(item=>{
                if(cupoTime.includes(moment(item.hour).utc().format("LT"))){
                    const cupo = newCupos.find(cup=>moment(cup.time).utc().format("LT") == moment(item.hour).utc().format("LT"))
                        item.reserva = cupo
                        return item
                }
                return item
            })
            setHoursCupo(newHoursCupo)
        }
    },[newCupos,date])

    useEffect(()=>{
        console.log("CUPOS UPDATED",cupos)
        if(cupos.length != 0){
            setNewCupos([])
            mergeData(cupos)
        //     setHoursCupo([]) 
        }
        // if(cupos.length > 0){
        //     foo()
        // }
    },[cupos])

    useEffect(()=>{
        if(loading){
            // setHoursCupo([])
        }
    },[loading])
    
    return(
        <div className="mt-2">
            {hoursCupo.map((item,idx)=>{
               const isSelected = selectedCupos.map(cupo=>moment(cupo.time).utc().format()).includes(moment.utc(item.hour).format())
               const isAfter = moment(item.hour.toISOString()).isBefore(moment().utcOffset(0, true).toISOString())
                return(
                    
                    <div key={idx} className="">
                        {/* {isAfter.toString()},{moment().utcOffset(0, true).toISOString()} {item.hour.toISOString()} */}
                        {item.show ?


                        <div className="flex space-x-4 h-10 items-center">
                            <span className=" -translate-y-5 w-9 text-sm">{moment(item.hour).utc().format("LT")}</span>
                            <div className="grid w-10/12">
                        <span className=" w-full h-[0.5px] bg-gray-400"></span>
                        <div 
                             onClick={()=>{
                                if(item.reserva != undefined){
                                    if(!item.reserva.available) return
                                    if(item.reserva.reserva_id != null){
                                        getReservaDetail(item.reserva.reserva_id)
                                    }else {
                                        if(item.reserva.evento_id != undefined) return
                                        if(isAfter) return
                                        selecReservaCupo(item.reserva)
                                                }
                                            }
                                        }}
                            className={`w-full h-10 flex items-center p-1 cursor-pointer
                            ${item.reserva != undefined && `${item.reserva.color} text-white ` }
                            ${isSelected && "bg-gray-400 bg-opacity-50"}
                            ${isAfter && "disabled"}
                            ${item.reserva?.evento_id != undefined && "disabled"}
                            `}>
                                <>
                                {item.reserva?.reserva_id != null ?
                                <span className="text-sm">{getFullName(item.reserva?.nombre,item.reserva?.apellido)}</span>
                                :
                                <>
                                {item.reserva != undefined &&
                                    <>
                                    {/* {item.reserva.available? */}
                                   <div className="flex w-full justify-between">
                                   {/* <span className="text-green-700 text-xs">Hora disponible </span> */}
                                   {item.reserva.available ?
                                       <span className="subtitle">{item.reserva.precio} BOB</span>
                                       :
                                       <span className="subtitle text-red-500">Hora no configurada</span>
                                    }

                                    {item.reserva?.evento_id != undefined?
                                    <span className="subtitle text-primary">Reservada para evento</span>
                                    :
                                    isAfter &&
                                    <span className="subtitle">No puedes reservar en esta hora</span>
                                    }
                                    
                                   </div>
                                        {/* :
                                        <span className="text-gray-500 text-xs">Hora deshabilitada</span>
                                        } */}
                                    </>
                                }
                                </>
                                }
                                </>
                            </div>
                            </div>

                        </div>    
                        :
                        <div className="flex space-x-4 h-10 items-center">

                            <span className=" w-9"></span>
                            <div 
                             onClick={()=>{
                                if(item.reserva != undefined){
                                    if(!item.reserva.available) return
                                    if(item.reserva.reserva_id != null){
                                        getReservaDetail(item.reserva.reserva_id)
                                    }else {
                                        if(item.reserva.evento_id != undefined) return
                                        if(isAfter) return
                                        selecReservaCupo(item.reserva)
                                                }
                                            }
                                        }}
                            className={`w-10/12 h-10 flex items-center p-1 cursor-pointer
                            ${item.reserva != undefined && `${item.reserva.color} text-white ` }
                            ${isSelected && "bg-gray-400 bg-opacity-50"}
                            ${isAfter && "disabled"}
                            ${item.reserva?.evento_id != undefined && "disabled"}
                            `}>
                                <>
                                {item.reserva?.reserva_id != null ?
                                <span className="text-sm">{getFullName(item.reserva?.nombre,item.reserva?.apellido)}</span>
                                :
                                <>
                                {item.reserva != undefined &&
                                    <>
                                    {/* {item.reserva.available? */}
                                   <div className="flex w-full justify-between">
                                   {/* <span className="text-green-700 text-xs">Hora disponible </span> */}
                                   {item.reserva.available ?
                                       <span className="subtitle">{item.reserva.precio} BOB</span>
                                       :
                                       <span className="subtitle text-red-500">Hora no configurada</span>
                                    }

                                    {item.reserva?.evento_id != undefined?
                                    <span className="subtitle text-primary">Reservada para evento</span>
                                    :
                                    isAfter &&
                                    <span className="subtitle">No puedes reservar en esta hora</span>
                                    }
                                    
                                   </div>
                                        {/* :
                                        <span className="text-gray-500 text-xs">Hora deshabilitada</span>
                                        } */}
                                    </>
                                }
                                </>
                                }
                                </>
                            </div>
                           
                        {/* <span className=" w-full h-[0.5px] bg-gray-400"></span> */}
                        </div>
                        }
                    </div>
                )
            })}
        </div>
      
      
    )
}

export default ReservaInstalacionCupos;