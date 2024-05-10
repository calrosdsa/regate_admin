import ButtonSubmit from "@/components/util/button/ButtonSubmit"
import ButtonWithLoader from "@/components/util/button/ButtonWithLoader"
import TimeSelect from "@/components/util/input/TimeSelect"
import InputWithMaxLength from "@/components/util/input/InputWithMaxLength"
import TextAreaWithMaxLength from "@/components/util/input/TextAreaWithMaxLength"
import UploadImage from "@/components/util/input/UploadImage"
import SelectTime from "@/components/util/select/SelectTime"
import { CreateInstalacion } from "@/core/repository/instalacion"
import { GetCategories } from "@/core/repository/labels"
import moment from "moment"
import Image from "next/image"
import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { toast } from "react-toastify"
import { Button, IconButton, MenuItem, TextField, Typography } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';

const CreateInstalacionComponent = ({uuid,addInstalacion,close}:{
    uuid:string
    addInstalacion:(value:Instalacion)=>void
    close:()=>void
}) =>{
    const [formData,setFormData ] = useState({
        name:"",
        description:"",
        cantidad_de_personas:20,
        category_id: "",
        precio_hora:""
      })
      const [uploadLoading,setUploadingLoading] = useState(false)
      const [categories,setCategories] = useState<Label[]>([])
      const [photo,setPhoto] = useState<File | undefined>()
      const {name,description,category_id,cantidad_de_personas,precio_hora} = formData
      const [customPrecioInstalacion,setCustomPrecuoInstalacion] = useState<CustomPrecioInstalacion[]>([])
      const [disabledHours,setDisabledHours] = useState<string[]>([])
      const onChange = (e:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)=>{
      //   dispatch(authActions.setErrrorLogin(undefined))
        setFormData({ ...formData, [e.target.name]: e.target.value });
      }

      const addCustomPrecioInstalcion = () => {
        const n:CustomPrecioInstalacion = {
          precio:"",
          start_time:"",
          end_time:"",
          times:[],
          isError:false
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



    // const checkCustomPrecioInstalacion = () => {
    //   if(customPrecioInstalacion.length == 0) {
    //     return false
    //   }
    //   for(let i=0;i<customPrecioInstalacion.length;i++){

          
    //       if(customPrecioInstalacion[i].precio == "") return true
    //       if(customPrecioInstalacion[i].start_time == "") return true
    //       if(customPrecioInstalacion[i].end_time == "") return true
    //   }
    // }

    const getCategories = async() => {
      try{

        const res:Label[] = await GetCategories()
        console.log("categories",res)
        setCategories(res)
      }catch(err){
        console.log("categoriea",err)
      }
      }
      const onSubmit = async(e:FormEvent<HTMLFormElement>) => {
        try{
            e.preventDefault()
            setUploadingLoading(true)
            let timeRange = getTimeRangeFromCustomPrecioInstalacion()
            console.log(timeRange)
            const uploadData = new FormData()
            let priceHour:string;
            priceHour = precio_hora 
            // console.log("------",priceHour,customPrecioInstalacion.length)
            if(customPrecioInstalacion.length > 0){
              priceHour = "0"
            }
            timeRange =  Array.from(new Set(timeRange))
            // console.log("SET",timeRange)
            // console.log(customPrecioInstalacion)
            // return
            // console.log(priceHour)
            uploadData.append("name",name)
            uploadData.append("description",description)
            uploadData.append("category_id",category_id)
            uploadData.append("cantidad_de_personas",cantidad_de_personas.toString())
            uploadData.append("precio_hora",priceHour)
            // uploadData.append("establecimiento_id",id.toString())
            uploadData.append("establecimiento_uuid",uuid)
            uploadData.append("custom_precio_instalacion",JSON.stringify(customPrecioInstalacion))
            uploadData.append("time_range",JSON.stringify(timeRange))
            if(photo != undefined) uploadData.append("photo",photo)
            const res:Instalacion = await CreateInstalacion(uploadData)
            addInstalacion(res)
            setUploadingLoading(false)
            close()
            toast.success("Se ha creado una nueva cancha")
        }catch(err){
            toast.error("Un error a ocurrido")
            setUploadingLoading(false)
        }
      }

      useEffect(()=>{
        getCategories()
      },[])


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

      // useEffect(()=>{
      //   console.log("customprecio instalacion")
      //   checkIsHoursIsDisabled()
      // },[customPrecioInstalacion])
   
    return(
        <div className=" max-w-xl ">
            <form onSubmit={onSubmit} className="relative">

            <UploadImage
            id="file-instalacion"
            setFile={setPhoto}
            src=""
          />
          <div className="h-2"/>
          <InputWithMaxLength
          value={name}
          required={true}
          name="name"
          onChangeValue={(e)=>{
            if(e.target.value.length <= 50){ 
                onChange(e)
            }
          }}
          max={50}
          label="Nombre *"
          />

        <InputWithMaxLength
          value={description}
          name="description"
          multiline
          onChangeValue={(e)=>{
              if(e.target.value.length <= 250){ 
              setFormData({...formData,description:e.target.value})
            }
        }}
          max={250}
          label="Descripción"
          />
          <div className="">
            <Typography variant="body2" sx={{mb:1}}>Seleciona una categoria*</Typography>
          <TextField
          name="category_id"
          data-testid="select-category"
          value={category_id} onChange={onChange}
          select size="small" sx={{width:"100%"}}>
            {categories.map((item,idx)=>{
                return(
                    <MenuItem data-testid={`category-${idx}`}
                    key={item.id} value={item.id}>{item.name}</MenuItem>
                    )
                })}
          </TextField>
            </div>

          {/* {customPrecioInstalacion.length == 0 &&
          <InputWithMaxLength
          value={precio_hora.toString()}
          name="precio_hora"
          onChangeValue={(e)=>{
              // if(e.target.value.length <= 20){ 
              onChange(e)
            // }
          }}
          label="Precio por hora"
          required
          type="number"
          />
        } */}

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
                          testId={`inicio-${index}`}
                          time={moment(item.start_time)}
                          date={moment().format("YYYY-MM-DD")}
                          setTime={(e)=>{
                            onChangeCustomPrecio("start_time",e.format("yyyy-MM-DD HH:mm"),index)
                          }}
                          isError={item.isError}
                          disabledHours={disabledHours}
                          />
                           <TimeSelect
                          label="Fin"
                          testId={`fin-${index}`}
                          date={moment().format("YYYY-MM-DD")}
                          time={moment(item.end_time)}
                          setTime={(e)=>{
                            onChangeCustomPrecio("end_time",e.format("yyyy-MM-DD HH:mm"),index)
                          }}
                          isError={item.isError}
                          disabledHours={disabledHours}
                          />
                          <div>
                          <Typography variant="body2">Monto</Typography>
                            <TextField
                            id={`amount-${index}`}
                            required type="number" className="w-20" value={item.precio} name="precio"
                            sx={{mt:1}} size="small"
                            InputLabelProps={{ shrink: true }}
                            onChange={(e)=>onChangeCustomPrecio(e.target.name,e.target.value,index)}
                            />
                          </div>
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
         
         {/* <InputWithMaxLength
          value={cantidad_de_personas.toString()}
          name="cantidad_de_personas"
          onChangeValue={(e)=>{
              if(e.target.value.length <= 20){ 
              onChange(e)
            }
          }}
          label="Maxima cantidad de Personas"
          type="number"
          /> */}

          <ButtonSubmit 
          loading={uploadLoading}
          title="Crear cancha"
          />
            </form>
        </div>
    )
}

export default CreateInstalacionComponent;