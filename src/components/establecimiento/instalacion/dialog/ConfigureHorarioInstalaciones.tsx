import { FormEvent, Fragment, useEffect, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import DialogLayout from "@/components/util/dialog/DialogLayout"
import MultiSelectComponent from "@/components/util/input/MultiSelectComponent"
import { days } from "@/context/actions/chart-actions"
import moment from "moment"
import { Button, DialogActions, IconButton, MenuItem, TextField } from "@mui/material"
import TimeSelect from "@/components/util/input/TimeSelect"
import CloseIcon from '@mui/icons-material/Close';
import { LoadingButton } from "@mui/lab"
import { EditInstalacionesHorario } from "@/core/repository/instalacion"
import { toast } from "react-toastify"
import { successfulMessage, unexpectedError } from "@/context/config"

enum ActionType {
  CREATE = 1,
  UPDATED = 2,
  DELETED = 3,

}
const DialogConfigureHorarioInstalaciones = ({openModal,closeModal,instalaciones}:{
    openModal:boolean
    closeModal:()=>void
    instalaciones:Instalacion[]
}) =>{
  const [loading,setLoading] = useState(false)
  const [instalacionesIds,setInstalacionesIds] = useState<number[]>([])
  const [daysWeek,setDaysWeek] = useState<number[]>([])
  const [available,setAvailable] = useState(true)
  const [customPrecioInstalacion,setCustomPrecuoInstalacion] = useState<CustomPrecioInstalacion[]>([])
  const [disabledHours,setDisabledHours] = useState<string[]>([])
  const [actionType,setActionType] = useState(ActionType.UPDATED)
  const addCustomPrecioInstalcion = () => {
    const n:CustomPrecioInstalacion = {
      precio:"",
      start_time:"",
      end_time:"",
    } 
    setCustomPrecuoInstalacion(e=>[...e,n])
    checkIsHoursIsDisabled()

  }
  
  const onChangeCustomPrecio = (name:string,value:string,index:number)=>{
    const updateList = customPrecioInstalacion.map((item,idx)=>{
        if(index == idx){
            item[name as keyof CustomPrecioInstalacion] = value
        }
        return item
    })
    setCustomPrecuoInstalacion(updateList)
  }
  const getTimeRangeFromCustomPrecioInstalacion = ():string[] => {
    let timeRange:string[] = []
    customPrecioInstalacion.map((item)=>{
      const startM = moment(item.start_time)
      const endM = moment(item.end_time)
      const minutesDifference = ((endM.hour()*60) + moment(endM).minute()) - ((startM.hour()*60) + moment(startM).minute()) 
      for(let t =0;t < (minutesDifference/30)+1;t++){
        timeRange.push(moment(startM).add(30*t,"minutes").format("HH:mm:ss"))
    }
  })
  return timeRange
  }

  const checkIsHoursIsDisabled = () =>{
    try{
    let timeRange:string[] = []
    console.log(customPrecioInstalacion)
      customPrecioInstalacion.map((item)=>{
        const startM = moment(item.start_time)
      const endM = moment(item.end_time)
      const minutesDifference = ((endM.hour()*60) + moment(endM).minute()) - ((startM.hour()*60) + moment(startM).minute()) 
      console.log("MINUTES DIFFERENCE",minutesDifference)
      for(let t =0;t < ((minutesDifference)/30)+1;t++){
        const r = moment(startM).add(30*t,"minutes").format("HH:mm")
        if(!timeRange.includes(r)){
          timeRange.push(r)
        }
      }
        })
        setDisabledHours(timeRange)
        console.log("TIME RANGE",timeRange)
      }catch(err){
        console.log(err)
      }
    }

    const onSubmit = async(e:FormEvent<HTMLFormElement>) =>{
      try{
          e.preventDefault()
          setLoading(true)
          let times = getTimeRangeFromCustomPrecioInstalacion()
          const d:EditInstalacionesPreciosRequest = {
            instalaciones_id:instalacionesIds,
            days_week:daysWeek,
            times:times,
            available:available,
            action_type:actionType,
            custom_precio_instalacion:customPrecioInstalacion
          }
          await EditInstalacionesHorario(d)
          toast.success(successfulMessage)
          console.log(d)
          setLoading(false)
      }catch(err){
        toast.error(unexpectedError)
        setLoading(false)
        console.log(e)
      }
    }

    // useEffect(()=>{
    //   console.log("customprecio instalacion")
    //   checkIsHoursIsDisabled()
    // },[customPrecioInstalacion])


    return(
       <DialogLayout title="Configurar horas disponible"
       className="max-w-lg"
       open={openModal} close={closeModal}>
        <form onSubmit={onSubmit}>

        <div>
            <span className="help-text">
              Configurar precio por rango de hora
            </span>

          <div className="grid  pt-2 w-full overflow-auto">
                {customPrecioInstalacion.map((item,index)=>{
                    return(
                        <>
                        <div key={index} className="flex space-x-2 items-center py-2 min-w-[380px]">
                          <TimeSelect
                          label="Inicio"
                          time={moment(item.start_time).format("HH:mm")}
                          setTime={(e)=>{
                            const today = moment().format("yyyy-MM-DD")
                            onChangeCustomPrecio("start_time",moment(today +" "+e).format("yyyy-MM-DD HH:mm"),index)
                          }}
                          disabledHours={disabledHours}
                          />
                           <TimeSelect
                          label="Fin"
                          time={moment(item.end_time).format("HH:mm")}
                          setTime={(e)=>{
                            const today = moment().format("yyyy-MM-DD")
                            onChangeCustomPrecio("end_time",moment(today +" "+e).format("yyyy-MM-DD HH:mm"),index)
                          }}
                          disabledHours={disabledHours}
                          />
                            <TextField
                            required type="number" className="w-20" value={item.precio} name="precio"
                            label="Monto" size="small"
                            InputLabelProps={{ shrink: true }}
                            onChange={(e)=>onChangeCustomPrecio(e.target.name,e.target.value,index)}
                            />
                            <IconButton onClick={()=>{
                              const newItems = customPrecioInstalacion.filter((t,i)=>i != index)
                              setCustomPrecuoInstalacion(newItems)
                            }}>
                              <CloseIcon/>
                            </IconButton>
                            
                        </div>
                        </>
                    )
                })}
            </div>

            <Button onClick={()=>addCustomPrecioInstalcion()}>
            Agregar horas
            </Button>

          </div>

        <div>
        <MultiSelectComponent
            options={[...days.map((item)=>{ return {value:item.value.toString(),name:item.day}}),{name:"Todo",value:"-1"}]}
            label="Dias de la semana"
            allValue="-1"
            allName="Todo"
            setInstalaciones={(e)=>{
              setDaysWeek(e)
            }}
            />
        </div>

        <div>
        <MultiSelectComponent
            options={[...instalaciones.map((item)=>{ return {value:item.id.toString(),name:item.name}}),{name:"Todo",value:"0"}]}
            label="Canchas"
            allValue="0"
            allName="Todo"
            setInstalaciones={(e)=>{
              setInstalacionesIds(e)
            }}
            />
        </div>

        <div className="grid xl:grid-cols-2 gap-x-5">

        <TextField
        required 
        sx={{minWidth:"100%",mt:2}}
        value={available.toString()} 
        name="estado"
        label="Habilitar"
        size="small"
        InputLabelProps={{ shrink: true }}
        onChange={(e)=>{
          const bool = e.target.value == "true"
          setAvailable(bool)
        }}
        select
        >
         <MenuItem value="true">Habilitar</MenuItem> 
         <MenuItem value="false">Deshabilitar</MenuItem> 

        </TextField>

        <TextField
        required 
        sx={{minWidth:"100%",mt:2}}
        value={actionType.toString()} 
        name="estado"
        label="Acción requerida"
        size="small"
        InputLabelProps={{ shrink: true }}
        onChange={(e)=>{
          const v = e.target.value
          setActionType(Number(v))
        }}
        select>
         <MenuItem value={ActionType.CREATE}>Crear</MenuItem> 
         <MenuItem value={ActionType.UPDATED}>Editar</MenuItem> 
         <MenuItem value={ActionType.DELETED}>Eliminar</MenuItem> 
        </TextField>
        </div>

        <DialogActions>
          <LoadingButton
          type="submit"
          loading={loading} onClick={()=>{}}>Enviar</LoadingButton>
        </DialogActions>

            </form>
       </DialogLayout>
)
}

export default DialogConfigureHorarioInstalaciones;