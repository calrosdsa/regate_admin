import { ResetInstalacionHorarioDay, getInstalacionDayHorario, updateCupoInstalacion } from "@/core/repository/instalacion";
import { DayWeek } from "@/core/type/enums";
import moment from "moment";
import { useEffect, useState } from "react";
import { EditHorarioPrecio } from "./dialog/EditHorarioPrecio";
import Loading from "@/components/util/loaders/Loading";
import MenuOption from "@/components/util/button/MenuOption";
import MenuLayout from "@/components/util/button/MenuLayout";
import { Menu } from "@headlessui/react";
import CopyInstalacionHorarioDialog from "./dialog/CopyInstalacionHorarioDialog";
import { useAppDispatch } from "@/context/reduxHooks";
import { uiActions } from "@/context/slices/uiSlice";
import { toast } from "react-toastify";
import { successfulMessage, unexpectedError } from "@/context/config";
import ConfirmationDialog from "@/components/util/dialog/ConfirmationDialog";

const dayWeek:Horario[] = [
    {dayName:"Domingo",dayWeek:DayWeek.Domingo},
    {dayName:"Lunes",dayWeek:DayWeek.Lunes},
    {dayName:"Martes",dayWeek:DayWeek.Martes},
    {dayName:"Miercoles",dayWeek:DayWeek.Miercoles},
    {dayName:"Jueves",dayWeek:DayWeek.Jueves},
    {dayName:"Viernes",dayWeek:DayWeek.Viernes},
    {dayName:"Sabado",dayWeek:DayWeek.Sabado}
]
const HorarioWeek = ({instalacionId,cupos,selectedDay,getHorarioDay,loading,instalaciones,updateHorarios}:{
    instalacionId:number
    selectedDay:number | null
    cupos:Cupo[]
    loading:boolean
    instalaciones:Instalacion[]
    getHorarioDay:(day:number)=>void
    updateHorarios:(res:Cupo[]) =>void
}) =>{
    // const [cupos,setCupos] = useState<Cupo[]>([])
    // const [selectedDay,setSelectedDay] = useState<number | null>(null)
    const dispatch = useAppDispatch()
    const [editHorarioDialog,setEditHorarioDialog] = useState(false)
    const [openCopyInstalacion,setOpenCopyInstalacion] = useState(false)
    const [cupo,setCupo] = useState<Cupo | undefined>(undefined)
    const currentDay = new Date().getDay()
    const [resetDayConfirmationDialog,setResetDayConfirmationDialog] = useState(false)



    const openEditDialog = (cupo?:Cupo)=>{
        setCupo(cupo)
        setEditHorarioDialog(true)
        console.log(cupo)
    }

   const resetDayConfirmation = async() =>{
    try{
        setResetDayConfirmationDialog(false)
        dispatch(uiActions.setLoaderDialog(true))
        const request = {
            id:instalacionId,
            day_week:selectedDay
        }
        await ResetInstalacionHorarioDay(JSON.stringify(request))
        const updateCupos = cupos.map(item=>{
            item.id = undefined
            item.price = undefined
            item.available = false
            return item
        })
        updateHorarios(updateCupos)
        toast.success(successfulMessage)
        dispatch(uiActions.setLoaderDialog(false))
    }catch(err){
        dispatch(uiActions.setLoaderDialog(false))
        toast.error(unexpectedError)
    }
   }

    useEffect(()=>{
        if(currentDay != undefined){
            getHorarioDay(currentDay)
        }
        console.log(currentDay)
    },[instalacionId])


    return(
        <>
        {editHorarioDialog &&
        <EditHorarioPrecio
        open={editHorarioDialog}
        close={()=>setEditHorarioDialog(false)}
        cupo={cupo}
        />
        }
        {resetDayConfirmationDialog &&
        <ConfirmationDialog
        open={resetDayConfirmationDialog}
        close={()=>setResetDayConfirmationDialog(false)}
        performAction={resetDayConfirmation}
        />
        }

        {openCopyInstalacion &&
        <CopyInstalacionHorarioDialog
        instalaciones={instalaciones}
        open={openCopyInstalacion}
        close={()=>setOpenCopyInstalacion(false)}
        instalacionId={instalacionId}
        dayWeek={selectedDay}
        updateHorarios={(e)=>{
            const idsCupos = e.map(item=>item.time.slice(11,19))
            const updateCupos = cupos.map(item=>{
                if(idsCupos.includes(item.time)){
                    const n = e.find(t=>t.time.slice(11,19) == item.time)
                    if(n != null){
                        item = n
                        item.time = n.time.slice(11,19)
                    }
                }
                return item
            })
            updateHorarios(updateCupos)
        }}
        />
        }
        <div className="relative">

        <div className=" flex w-full space-x-3  pb-6 relative justify-between items-center">
            <select className="input w-min" value={selectedDay?.toString()} 
            onChange={(e)=>getHorarioDay(Number(e.target.value))}>    
            {dayWeek.map((item)=>{
                return(
                    <option value={item.dayWeek}>{item.dayName}</option>
                    // <div key={item.dayWeek} onClick={()=>getHorarioDay(item.dayWeek)}
                    // className={`${selectedDay == item.dayWeek ? 'button':'button-inv'}`}>
                    //     {item.dayName}
                    // </div>
                )
            })}
            </select>

            <MenuLayout>
                <>
                
            <Menu.Item>
                {({ active }) => (
                    <button
                      disabled={instalaciones.length < 1}
                    onClick={()=>setOpenCopyInstalacion(true)}
                    className={`${active ? 'bg-primary text-white' : 'text-gray-900'} 
                    group whitespace-nowrap flex w-full items-center rounded-md px-2 py-2 text-sm
                    ${instalaciones.length < 1 && "disabled"}
                    `}
                    >
                    Copiar horario
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                    <button
                    //   disabled={user.estado == UserEstado.ENABLED}
                    onClick={()=>setResetDayConfirmationDialog(true)}
                    className={`${active ? 'bg-primary text-white' : 'text-gray-900'} 
                    group whitespace-nowrap flex w-full items-center rounded-md px-2 py-2 text-sm
                    `}
                    >
                    Restablecer horario del día.
                  </button>
                )}
              </Menu.Item>
                </>
            </MenuLayout>


        </div>
        <Loading
        loading={loading}
        className="flex justify-center w-full"
        />
        {cupos.slice(0,48).map((item,index)=>{
                return(
                    <div key={index} onClick={()=>openEditDialog(item)}
                    className="flex space-x-4 h-10 items-center">
                        {(index +1) % 2 == 1 ?
                        <span className=" -translate-y-5 w-9 text-sm">{item.time.slice(0,5)}</span>
                        :
                        <span className="w-9"/>
                        }
                            <div className="grid w-10/12">
                        {(index +1) % 2 == 1 &&
                            <span className=" w-full h-[0.5px]  bg-gray-400"></span>
                        }

                        <div className={`w-full h-10 hover:bg-gray-200  flex items-center p-1 cursor-pointer`}>
                            <div className="flex items-center space-x-3">
                                {item.price != undefined ?
                                <span className="text-sm font-medium">{item.price} BOB</span>
                                :
                                <span className="text-sm italic">Sin definir</span>
                                }
                                {/* <span className="text-sm font-medium">{item.price == undefined ? "Sin definir" : `${item.price} BOB`}</span> */}
                                {item.available &&
                                    <span className="text-green-500 font-medium text-xs">Habilitado</span>
                                }
                                {item.available == false && item.price != undefined &&
                                    <span className="text-red-500 font-medium text-xs">Deshabilitado</span>
                                }
                                <span>{item.available}</span>
                            </div>
                        </div>
                    </div>
                    </div>

                )
            })}

        {/* <div className="grid grid-cols-2 xl:grid-cols-4 gap-2">
            {cupos.map((item,index)=>{
                return(
                    <div key={index} onClick={()=>openEditDialog(item)}
                    className={`card grid grid-cols-2 ${item.available || ' opacity-50'} relative`}>
                        {item.available &&
                        <span className="absolute top-0 right-1 text-green-500 font-medium text-xs">Habilitado</span>
                    }
                    {item.available == false && item.price != undefined &&
                        <span className="absolute top-0 right-1 text-red-500 font-medium text-xs">Deshabilitado</span>
                    }
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
        </div> */}


        </div>
        </>
    )
}

export default HorarioWeek;