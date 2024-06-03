import { DeleteCupos, ResetInstalacionHorarioDay} from "@/core/repository/instalacion";
import { DayWeek } from "@/core/type/enums";
import moment from "moment";
import { useEffect, useState } from "react";
import { EditHorarioPrecio } from "./dialog/EditHorarioPrecio";
import Loading from "@/presentation/util/loaders/Loading";
import MenuOption from "@/presentation/util/button/MenuOption";
import MenuLayout from "@/presentation/util/button/MenuLayout";
import { Menu } from "@headlessui/react";
import CopyInstalacionHorarioDialog from "./dialog/CopyInstalacionHorarioDialog";
import { useAppDispatch } from "@/context/reduxHooks";
import { uiActions } from "@/context/slices/uiSlice";
import { toast } from "react-toastify";
import { successfulMessage, unexpectedError } from "@/context/config";
import ConfirmationDialog from "@/presentation/util/dialog/ConfirmationDialog";
import { TooltipContainer } from "@/presentation/util/tooltips/Tooltip";
import { time } from "console";
import EditIcon from '@mui/icons-material/Edit';
import { Box, Button, ListItemText, MenuItem, Paper, Select, TextField, Typography, useTheme } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';

const dayWeek:Horario[] = [
    {dayName:"Domingo",dayWeek:DayWeek.Domingo},
    {dayName:"Lunes",dayWeek:DayWeek.Lunes},
    {dayName:"Martes",dayWeek:DayWeek.Martes},
    {dayName:"Miercoles",dayWeek:DayWeek.Miercoles},
    {dayName:"Jueves",dayWeek:DayWeek.Jueves},
    {dayName:"Viernes",dayWeek:DayWeek.Viernes},
    {dayName:"Sabado",dayWeek:DayWeek.Sabado}
]
const HorarioWeek = ({instalacionId,cupos,currentDay,getHorarioDay,loading,instalaciones,updateHorarios}:{
    instalacionId:number
    currentDay:number
    cupos:Cupo[]
    loading:boolean
    instalaciones:Instalacion[]
    getHorarioDay:(day:number)=>void
    updateHorarios:(res:Cupo[]) =>void
}) =>{
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const dispatch = useAppDispatch()
    const theme = useTheme()
    const [editHorarioDialog,setEditHorarioDialog] = useState(false)
    const [openCopyInstalacion,setOpenCopyInstalacion] = useState(false)
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
            dispatch(uiActions.setLoaderDialog(false))
            toast.success(successfulMessage)
        }catch(err){
            dispatch(uiActions.setLoaderDialog(false))
            toast.error(unexpectedError)
        }
    }

   const resetDayConfirmation = async() =>{
    try{
        setResetDayConfirmationDialog(false)
        dispatch(uiActions.setLoaderDialog(true))
        const request = {
            id:instalacionId,
            day_week:currentDay
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

    useEffect(()=>{
        if(currentDay != undefined){
            getHorarioDay(currentDay)
        }
    },[instalacionId])

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
        setCupos={(e)=>{
            const n = selectedCupos.filter(t=>t.time != e.time)
              setSelectedCupos(n)
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
        dayWeek={currentDay}
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

        <Paper 
        elevation={2}
        className=" w-full z-10 sticky top-14  flex  space-x-3   justify-between items-center ">
            <div className="flex space-x-2  items-center overflow-x-auto  pb-2 ">    
            <Button 
                variant="contained"      
                sx={{height:35}}
                disabled={loading}
                onClick={()=>{
                 getHorarioDay(currentDay)
                }}
                >
                <RefreshIcon/>
                </Button>
            <Select
            size="small"
            sx={{height:35}}
            value={currentDay} 
            onChange={(e)=>{
                getHorarioDay(Number(e.target.value))
                setSelectedCupos([])
                }}
            >
                 {dayWeek.map((item)=>{
                return(
                    <MenuItem  key={item.dayWeek} value={item.dayWeek}>{item.dayName}</MenuItem>
                    // <option key={item.dayWeek} value={item.dayWeek}>{item.dayName}</option>
                    // <div key={item.dayWeek} onClick={()=>getHorarioDay(item.dayWeek)}
                    // className={`${selectedDay == item.dayWeek ? 'button':'button-inv'}`}>
                    //     {item.dayName}
                    // </div>
                    )
                })}
            </Select>
          

                               <TooltipContainer 
                                helpText="Intenta seleccionar la hora que deseas editar."
                                disabled={selectedCupos.length != 0}
                                >
                                    <Button
                                    variant="contained"
                                    sx={{height:35}}
                                     disabled={selectedCupos.length == 0} onClick={()=>{
                                        setEditHorarioDialog(true)
                                        // appendSerachParams("dialog","1")
                                        // setCreateReservaDialog(true)
                                        }}
                                        endIcon={<EditIcon/>}
                                        >
                                        <Typography className="hidden sm:block">Editar</Typography>
                                    </Button>
                                </TooltipContainer>

                    <Button 
                    variant="contained"      
                    sx={{height:35}}
                    disabled={selectedCupos.length == 0} onClick={()=>{
                    setConfirmDeleteDialog(true)
                    // appendSerachParams("dialog","1")
                    // setCreateReservaDialog(true)
                    }}
                    endIcon={<DeleteIcon/>}
                    >
                    <span className="hidden sm:block">Resetear</span>
                    </Button>

                    {selectedCupos.length > 0 &&
                    <Button
                    sx={{height:35}}
                    onClick={()=>setSelectedCupos([])}
                    endIcon={<CloseIcon/>}
                    variant="contained"
                    >
                    <span className="">{selectedCupos.length}</span>
                    </Button>
                    }

            </div>

            <div className="flex space-x-2 items-center pb-5">

            <MenuLayout
             anchorEl={anchorEl}
             setAnchorEl={(e)=>setAnchorEl(e)}>
                <>
                <MenuItem onClick={()=>{
                    setAnchorEl(null)
                  setOpenCopyInstalacion(true)
                    }} >                  
                    {/* <ListItemIcon>
                    <EditIcon/>
                </ListItemIcon> */}
                <ListItemText>Copiar horario</ListItemText>
                    </MenuItem>
                    <MenuItem  onClick={()=>{
                    setAnchorEl(null)
                 setResetDayConfirmationDialog(true)
                    }} >                  
                <ListItemText>Restablecer horario del día</ListItemText>
                    </MenuItem>
            
                </>
            </MenuLayout>

            </div>
        </Paper>

        <Loading
        loading={loading}
        className="flex justify-center w-full my-2"
        />
        <div className="pt-6 px-2">

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

                        <Box 
                        sx={{
                            backgroundColor:
                                selectedCupos.map(item=>item.time).includes(item.time)  ?
                                (
                                theme.palette.mode == "dark"?
                                theme.palette.primary.dark  
                                :
                                theme.palette.primary.light
                                )
                            : theme.palette.background.paper
                        }}
                        className={`w-full h-10  flex items-center p-1 cursor-pointer`}>

                            <div className="flex items-center space-x-3">
                                {item.price != undefined ?
                                <Typography variant="caption" className="text-sm font-medium">{item.price} BOB</Typography>
                                :
                                <Typography variant="caption" className="text-sm italic">Sin definir</Typography>
                                }
                                {/* <Typography variant="caption" className="text-sm font-medium">{item.price == undefined ? "Sin definir" : `${item.price} BOB`}</Typography> */}
                                {item.available &&
                                    <Typography variant="caption" className="text-green-500 font-medium text-xs">Habilitado</Typography>
                                }
                                {item.available == false && item.price != undefined &&
                                    <Typography variant="caption" className="text-red-500 font-medium text-xs">Deshabilitado</Typography>
                                }

                                <Typography>
                                    <>
                                    {item.available}
                                    </>
                                    </Typography>
                            </div>

                        </Box>

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