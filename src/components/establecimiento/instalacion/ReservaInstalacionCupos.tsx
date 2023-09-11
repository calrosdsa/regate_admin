import { groupByToMap } from "@/core/util";
import moment from "moment";
import { useEffect, useState } from "react";

const ReservaInstalacionCupos = ({cupos,loading,getReservaDetail,selecReservaCupo,selectedCupos}:{
    cupos:CupoReserva[]
    selectedCupos:CupoReserva[]
    loading:boolean
    selecReservaCupo:(e:CupoReserva)=>void
    getReservaDetail:(id:number)=>void
}) =>{ 
    const [newCupos,setNewCupos]= useState<CupoReserva[]>([])
    const colors = ["bg-yellow-500","bg-green-500","bg-blue-500","bg-red-500","bg-cyan-500",
    "bg-cyan-500", "bg-orange-500", "bg-sky-500", "bg-lime-500",
    "bg-emerald-500", "bg-teal-500", "bg-sky-500", "bg-indigo-500", "bg-violet-500","bg-fuchsia-600", "bg-purple-500",
    "bg-pink-500","bg-rose-500","bg-slate-500" ,"bg-gray-500"]

    const getRamdomColor = (prevColor:string):string => {
        const newArrayOfColors = colors.filter(color=>color != prevColor)
        return newArrayOfColors[Math.floor(Math.random()*newArrayOfColors.length)]
    }

    const foo = () =>{
        const d = groupByToMap<CupoReserva,number | null>(cupos,(item)=>item.reserva_id)
        let prevColor:string = ""
         d.forEach((items,key)=>{

            if(key != null){
                const randomColor = getRamdomColor(prevColor)
                prevColor =  randomColor
                const updateItems =  cupos.map((item=>{
                    if(items.map(item=>item.reserva_id).includes(item.reserva_id)){
                        item.color = randomColor
                    }
                    return item
                }))
                // console.log(updateItems,"ARRAY ")
                setNewCupos(updateItems)
            }else{
                setNewCupos(items)
            }
        })
    }
    useEffect(()=>{
    if(cupos.length > 0){
        foo()
    }
    },[cupos])
    useEffect(()=>{
        if(loading){
            setNewCupos([])
        }
    },[loading])
    return(
    
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-2 ">
            {newCupos.map((item,idx)=>{
                const isSelected = selectedCupos.map(item=>item.time).includes(item.time)
                // console.log(moment().utcOffset(0, true).toISOString(),'MOMENT UTC')
                const isAfter = moment.utc(item.time).isBefore(moment().utcOffset(0, true).toISOString())
                // console.log(isAfter,item.time)
                // const disabled = r
                return(
                    <div key={idx} onClick={()=>{
                        if(item.reserva_id != null){
                            getReservaDetail(item.reserva_id)
                        }else {
                            selecReservaCupo(item)
                        }
                    }}
                    className={`card grid grid-cols-2 ${isSelected && "bg-gray-900 text-white"}
                    ${isAfter && "disabled"}
                    ${item.color}
                    ${item.precio_reserva != null && "text-white"}`}>
                        <div className="grid">
                        <span className="label">Hora</span>
                        <span className="text-sm">{item.time.substring(11,16)}</span>
                        </div>
                        <div className="grid">
                        <span className="label">Precio</span>
                        <span className="text-sm">{item.precio}</span>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default ReservaInstalacionCupos;