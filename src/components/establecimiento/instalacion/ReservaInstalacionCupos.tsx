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
    const colors = ["bg-yellow-500","bg-green-500","bg-blue-500","bg-red-500",
    "bg-cyan-500", "bg-orange-500", "bg-sky-500", "bg-lime-500",
    "bg-emerald-500", "bg-teal-500", "bg-indigo-500", "bg-violet-500","bg-fuchsia-600", "bg-purple-500",
    "bg-pink-500","bg-rose-500","bg-slate-500" ,"bg-gray-500","bg-amber-500",
    "bg-yellow-800","bg-green-800","bg-blue-800","bg-red-800",
    "bg-cyan-800", "bg-orange-800", "bg-sky-800", "bg-lime-800",
    "bg-emerald-800", "bg-teal-800", "bg-indigo-800", "bg-violet-800","bg-fuchsia-600", "bg-purple-800",
    "bg-pink-800","bg-rose-800","bg-slate-800" ,"bg-gray-800","bg-amber-800"
]

    const getRamdomColor = (prevColors:string[]):string => {
        if(prevColors.length >= colors.length){
            return colors[Math.floor(Math.random()*colors.length)] 
        }else{
            const newArrayOfColors = colors.filter(color=>!prevColors.includes(color))
            return newArrayOfColors[Math.floor(Math.random()*newArrayOfColors.length)]
        }
    }

    const foo = () =>{
        const d = groupByToMap<CupoReserva,number | null>(cupos,(item)=>item.reserva_id)
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
        if(cupos.length != 0){
            setNewCupos([])
        }
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
            {newCupos.sort((left,right)=>{
                return moment.utc(left.time).diff(moment.utc(right.time))
            }).map((item,idx)=>{
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
                            if(isAfter) return
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