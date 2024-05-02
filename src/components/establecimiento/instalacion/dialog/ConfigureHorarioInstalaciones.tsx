import { FormEvent, Fragment, useEffect, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import DialogLayout from "@/components/util/dialog/DialogLayout"
import MultiSelectComponent from "@/components/util/input/MultiSelectComponent"
import { days } from "@/context/actions/chart-actions"
import moment from "moment"
import { Button, Checkbox, DialogActions, FormControlLabel, IconButton, MenuItem, TextField, Tooltip, Typography } from "@mui/material"
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
const DialogConfigureHorarioInstalaciones = ({openModal,closeModal,instalaciones,uuid}:{
    openModal:boolean
    closeModal:()=>void
    instalaciones:Instalacion[]
    uuid:string
}) =>{
  const [loading,setLoading] = useState(false)
  const [instalacionesIds,setInstalacionesIds] = useState<number[]>([])
  const [daysWeek,setDaysWeek] = useState<number[]>([])
  const [available,setAvailable] = useState(true)
  const [useDefinedPrice,setUseDefinedPrice] = useState(false)
  const [customPrecioInstalacion,setCustomPrecuoInstalacion] = useState<CustomPrecioInstalacion[]>([])
  const [disabledHours,setDisabledHours] = useState<string[]>([])
  const [actionType,setActionType] = useState(ActionType.UPDATED)
  const addCustomPrecioInstalcion = () => {
    const n:CustomPrecioInstalacion = {
      precio:"",
      start_time:"",
      end_time:"",
      isError:false,
      times:[]
    } 
    setCustomPrecuoInstalacion(e=>[...e,n])
    checkIsHoursIsDisabled()

  }
  
  const onChangeCustomPrecio = (name:string,value:string,index:number)=>{
    const updateList = customPrecioInstalacion.map((item,idx)=>{
        if(index == idx){
          switch(name){
            case "precio":
              item["precio"] = value
              break;
            case "start_time":
              item["start_time"] = value
              break;
            case "end_time":
              item["end_time"] = value
              break;
          }
        }
        return item
    })
    setCustomPrecuoInstalacion(updateList)
  }
  const getTimeRangeFromCustomPrecioInstalacion = ():CustomPrecioInstalacion[] => {
    return customPrecioInstalacion.map((item)=>{
      let timeRange:string[] = []
      const startM = moment(item.start_time)
      const endM = moment(item.end_time).subtract(30,"minutes")
      let endHours =0
      if(startM.date() != endM.date()){
        endHours = 24 * 60
      }else{
        endHours = endM.hour() * 60
      }
      const minutesDifference = ((endHours) + endM.minute()) - ((startM.hour()*60) + startM.minute()) 
      for(let t =0;t < (minutesDifference/30)+1;t++){
        timeRange.push(moment(startM).add(30*t,"minutes").format("HH:mm:ss"))
    }
      item.times = timeRange
      return item
  })
  }

  const checkIsHoursIsDisabled = () =>{
    try{
    let timeRange:string[] = []
      customPrecioInstalacion.map((item)=>{
        const startM = moment(item.start_time)
      const endM = moment(item.end_time).subtract(30,"minutes")
      if(endM.isBefore(startM)){
        item.isError = true 
      }else{
        item.isError = false 
      }
      let endHours =0
      if(startM.date() != endM.date()){
        endHours = 24 * 60
      }else{
          endHours = endM.hour() * 60
      }

      const minutesDifference = ((endHours) + moment(endM).minute()) - ((startM.hour()*60) + moment(startM).minute()) 
      console.log("MINUTES DIFFERENCE",minutesDifference)
      for(let t =0;t < ((minutesDifference)/30)+1;t++){
        const r = moment(startM).add(30*t,"minutes").format("YYYY-MM-DD HH:mm")
        if(!timeRange.includes(r)){
          timeRange.push(r)
        }
      }
        })
        setDisabledHours(timeRange)
      }catch(err){
        console.log(err)
      }
    }

    const onSubmit = async(e:FormEvent<HTMLFormElement>) =>{
      try{
          e.preventDefault()
          setLoading(true)
          let customPrecionInstalacionWithTimeRange = getTimeRangeFromCustomPrecioInstalacion()
          let times:string[] = []
          customPrecionInstalacionWithTimeRange.map(item=>
            times = times.concat(item.times)
          )
          if(daysWeek.length == 0) return
          let daysWeekDefault:number[] = []
          if(daysWeek[0] == -1){
            daysWeekDefault = [0,1,2,3,4,5,6]
          }else{
            daysWeekDefault = daysWeek
          }
          const d:EditInstalacionesPreciosRequest = {
            instalaciones_id:instalacionesIds,
            days_week:daysWeekDefault,
            times:times,
            available:available,
            action_type:actionType,
            custom_precio_instalacion:customPrecionInstalacionWithTimeRange,
            establecimiento_uuid:uuid,
            use_defined_price:useDefinedPrice,
          }
          await EditInstalacionesHorario(d)
          toast.success(successfulMessage)
          setLoading(false)
      }catch(err){
        toast.error(unexpectedError)
        setLoading(false)
        console.log(e)
      }
    }


    return(
       <DialogLayout title="Configurar horas disponible"
       className="max-w-lg"
       open={openModal} close={closeModal}>
        <form onSubmit={onSubmit} className="px-1">

        <div>
            <span className="help-text">
              Configurar precio por rango de hora
            </span>

          <div className="grid  pt-2 w-full overflow-auto">
                {customPrecioInstalacion.map((item,index)=>{
                    return(
                        <>
                        <div key={index} className="flex space-x-2 items-end py-2 min-w-[380px]">
                          <TimeSelect
                          label="Inicio"
                          time={moment(item.start_time)}
                          isError={item.isError}
                          setTime={(e)=>{
                            onChangeCustomPrecio("start_time",e.format("yyyy-MM-DD HH:mm"),index)
                          }}
                          date={moment().format("YYYY-MM-DD")}
                          disabledHours={disabledHours}
                          />
                           <TimeSelect
                          label="Fin"
                          time={moment(item.end_time)}
                          isError={item.isError}
                          setTime={(e)=>{
                            onChangeCustomPrecio("end_time",e.format("yyyy-MM-DD HH:mm"),index)
                          }}
                          date={moment().format("YYYY-MM-DD")}
                          disabledHours={disabledHours}
                          />
                          {(!useDefinedPrice && actionType != ActionType.DELETED) &&
                          <div>
                            <Typography variant="body2">Monto</Typography>
                            <TextField
                            required type="number" className="w-20" value={item.precio} name="precio"
                            size="small" sx={{mt:1}}
                            InputLabelProps={{ shrink: true }}
                            onChange={(e)=>onChangeCustomPrecio(e.target.name,e.target.value,index)}
                            />
                            </div>
                          }
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

          {actionType == ActionType.UPDATED &&
            <div>
            <FormControlLabel sx={{p:1}} control={<Checkbox value={useDefinedPrice} onChange={(e,v)=>setUseDefinedPrice(v)} />}
            label="Usar precio previamente definido" />
            </div> 
          }

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
        label="Acción a realizar"
        size="small"
        InputLabelProps={{ shrink: true }}
        onChange={(e)=>{
          const v = e.target.value
          if(Number(v) != ActionType.UPDATED){
            setUseDefinedPrice(false)
          }
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