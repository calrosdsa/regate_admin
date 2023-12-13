import { DeleteCupos, ResetInstalacionHorarioDay} from "@/core/repository/instalacion";
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
import { TooltipContainer } from "@/components/util/tooltips/Tooltip";
import { time } from "console";

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
    const [selectedCupos,setSelectedCupos] = useState<Cupo[]>([])
    const [confirmDeleteDialog,setConfirmDeleteDialog] = useState(false)

    const appendCupo = (cupo:Cupo) =>{
        if(selectedCupos.map(item=>item.time).includes(cupo.time)){
            const updateList = selectedCupos.filter(item=>item.time != cupo.time)
            setSelectedCupos(updateList)
        }else{
            setSelectedCupos((v)=>[...v,cupo])
        }
    }

    const deleteCupos = async()=>{
        try{
            setConfirmDeleteDialog(false)
            dispatch(uiActions.setLoaderDialog(true))
            const ids = selectedCupos.filter(item=>item.id != undefined).map(item=>item.id)
            await DeleteCupos(ids)
            // const updatedSelectedCupos = selectedCupos.map(item=>{
            //     item.id = undefined
            //     item.price = undefined
            //     return item
            // })
            const updateCurrentCupos = cupos.map(item=>{
                if(ids.includes(item.id)){
                    const current = selectedCupos.find(t => t.id == item.id)
                    if (current != undefined){
                        current.id = undefined
                        current.price = undefined
                        current.available = false
                        item = current
                    }
                } 
                return item
            })
            setSelectedCupos([])
            updateHorarios(updateCurrentCupos)
            console.log(ids)
            dispatch(uiActions.setLoaderDialog(false))
            toast.success(successfulMessage)
        }catch(err){
            dispatch(uiActions.setLoaderDialog(false))
            toast.error(unexpectedError)
            console.log(err)
        }
    }

   const resetDayConfirmation = async() =>{
    try{
        setResetDayConfirmationDialog(false)
        dispatch(uiActions.setLoaderDialog(true))
        const request = {
            id:instalacionId,
            day_week:selectedDay
        }
        const res = await ResetInstalacionHorarioDay(JSON.stringify(request))
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

//    const mergeC = () =>{
//     console.log("merging")
//     cupos.map((item,idx)=>{
//         if(idx % 2 == 0){
//             console.log("its even",item)
//         }
//         return
//     })
//    }

    useEffect(()=>{
        if(currentDay != undefined){
            getHorarioDay(currentDay)
        }
        console.log(currentDay)
    },[instalacionId])

    // useEffect(()=>{
    //     mergeC()
    // },[cupos])


    return(
        <>
        {editHorarioDialog &&
        <EditHorarioPrecio
        open={editHorarioDialog}
        close={()=>setEditHorarioDialog(false)}
        cupos={selectedCupos}
        updateCupos={(updateC:Cupo[])=>{
            const updateCuposList = cupos.map(item=>{
                if(updateC.map(item=>item.time).includes(item.time)){
                    const currentCupo = updateC.find(t=>t.time == item.time)
                    if(currentCupo != undefined){
                        item = currentCupo
                    }
                }
                return item
            })
            updateHorarios(updateCuposList)
            setSelectedCupos([])
            setEditHorarioDialog(false)
        }}
        />
        }

       {confirmDeleteDialog &&
        <ConfirmationDialog
        open={confirmDeleteDialog}
        close={()=>setConfirmDeleteDialog(false)}
        performAction={deleteCupos}
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

        <div className="sticky top-14 -mt-4 bg-gray-50  w-full z-10  flex  space-x-3 h-12  justify-between items-center ">
            <div className="flex space-x-2 items-end overflow-x-auto">    
            <select className="input w-min h-9" value={selectedDay?.toString()} 
            onChange={(e)=>{
                getHorarioDay(Number(e.target.value))
                setSelectedCupos([])
                }}>    
            {dayWeek.map((item)=>{
                return(
                    <option key={item.dayWeek} value={item.dayWeek}>{item.dayName}</option>
                    // <div key={item.dayWeek} onClick={()=>getHorarioDay(item.dayWeek)}
                    // className={`${selectedDay == item.dayWeek ? 'button':'button-inv'}`}>
                    //     {item.dayName}
                    // </div>
                    )
                })}
            </select>

            <TooltipContainer 
                                helpText="Intenta seleccionar la hora que deseas editar."
                                disabled={selectedCupos.length != 0}
                                >
                                    <button
                                     className={`items-center justify-center flex sm:space-x-1 whitespace-nowrap h-9
                                     ${selectedCupos.length == 0 ? "button-disabled":"button"}`}
                                     disabled={selectedCupos.length == 0} onClick={()=>{
                                        setEditHorarioDialog(true)
                                        // appendSerachParams("dialog","1")
                                        // setCreateReservaDialog(true)
                                        }}>
                                        <span className="hidden sm:block">Editar</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                        <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                                        <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                                        </svg>

                                    </button>
                                </TooltipContainer>

                    <button
                    className={`items-center justify-center flex sm:space-x-1 whitespace-nowrap h-9
                    ${selectedCupos.length == 0 ? "button-disabled":"button"}`}
                    disabled={selectedCupos.length == 0} onClick={()=>{
                    setConfirmDeleteDialog(true)
                    // appendSerachParams("dialog","1")
                    // setCreateReservaDialog(true)
                    }}>
                    <span className="hidden sm:block">Resetear</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                    </svg>


                    </button>

                    {selectedCupos.length > 0 &&
                    <button onClick={()=>setSelectedCupos([])}
                    className="flex button items-center h-9">
                    <span className="">{selectedCupos.length}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                    </svg>
                    </button>
                    }

            </div>

            <div className="flex space-x-2 items-center">

             {/* <div className="rounded-full noSelect hover:bg-gray-200 cursor-pointer flex justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-8 h-8 p-[6px]">
            <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
            <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
            </svg>
             </div> */}

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


        </div>
        <Loading
        loading={loading}
        className="flex justify-center w-full"
        />
        <div className="pt-6">

        {cupos.slice(0,48).map((item,index)=>{
                return(
                    <div key={index} onClick={()=>appendCupo(item)}
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

                        <div className={`w-full h-10  flex items-center p-1 cursor-pointer
                        ${item.available && "bg-gray-200"} 
                        ${selectedCupos.map(item=>item.time).includes(item.time) ? "bg-primary text-white":"hover:bg-gray-200"}`}>
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
        </div>


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