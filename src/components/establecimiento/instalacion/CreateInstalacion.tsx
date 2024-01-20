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

const CreateInstalacionComponent = ({uuid,addInstalacion,close}:{
    uuid:string
    addInstalacion:(value:Instalacion)=>void
    close:()=>void
}) =>{
    const [formData,setFormData ] = useState({
        name_evento:"",
        description:"",
        cantidad_de_personas:20,
        category_id: 1,
        precio_hora:""
      })
      const [uploadLoading,setUploadingLoading] = useState(false)
      const [categories,setCategories] = useState<Label[]>([])
      const [photo,setPhoto] = useState<File | undefined>()
      const {name,description,category_id,cantidad_de_personas,precio_hora} = formData
      const [customPrecioInstalacion,setCustomPrecuoInstalacion] = useState<CustomPrecioInstalacion[]>([])
      const onChange = (e:ChangeEvent<HTMLInputElement>)=>{
      //   dispatch(authActions.setErrrorLogin(undefined))
        setFormData({ ...formData, [e.target.name]: e.target.value });
      }

      const addCustomPrecioInstalcion = () => {
        const n:CustomPrecioInstalacion = {
          precio:"",
          start_time:"",
          end_time:""
        } 
        setCustomPrecuoInstalacion(e=>[...e,n])
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
        const res:Label[] = await GetCategories()
        setCategories(res)
      }
      const onSubmit = async(e:FormEvent<HTMLFormElement>) => {
        try{
            e.preventDefault()
            setUploadingLoading(true)
            const timeRange = getTimeRangeFromCustomPrecioInstalacion()
            const uploadData = new FormData()
            uploadData.append("name",name)
            uploadData.append("description",description)
            uploadData.append("category_id",category_id.toString())
            uploadData.append("cantidad_de_personas",cantidad_de_personas.toString())
            uploadData.append("precio_hora",precio_hora)
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
   
    return(
        <div className=" max-w-xl ">
            <form onSubmit={onSubmit} className="relative">

            <UploadImage
            id="file-instalacion"
          setFile={setPhoto}
          src=""
          />

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

        <TextAreaWithMaxLength
          value={description}
          name="description"
          onChangeValue={(e)=>{
              if(e.target.value.length <= 250){ 
              setFormData({...formData,description:e.target.value})
            }
        }}
        max={250}
          label="Descripción"
          />
          <div className=" mt-4">
            <span className="help-text">Seleciona una categoria*</span>
          <select name="" id="" className="input">
            {categories.map((item)=>{
                return(
                    <option key={item.id} value={item.id}>{item.name}</option>
                    )
                })}
          </select>
            </div>

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

          <div>
            <span className="help-text">
              Configurar precio por rango de hora
            </span>

          <div className="grid  pt-1 w-full overflow-auto">
                {customPrecioInstalacion.map((item,index)=>{
                    return(
                        <>
                        <div key={index} className="flex space-x-2 items-end pb-2 min-w-[380px]">
                          <TimeSelect
                          label="Inicio"
                          time={moment(item.start_time).format("HH:mm")}
                          setTime={(e)=>{
                            const today = moment().format("yyyy-MM-DD")
                            onChangeCustomPrecio("start_time",moment(today +" "+e).format("yyyy-MM-DD HH:mm"),index)
                          }}
                          />
                           <TimeSelect
                          label="Fin"
                          time={moment(item.end_time).format("HH:mm")}
                          setTime={(e)=>{
                            const today = moment().format("yyyy-MM-DD")
                            onChangeCustomPrecio("end_time",moment(today +" "+e).format("yyyy-MM-DD HH:mm"),index)
                          }}
                          />
                            {/* <input type="time" className="input" value={item.start_time}
                            name="start_time"
                            onChange={(e)=>onChangeCustomPrecio(e,index)}/>
                            <input type="time" className="input" value={item.end_time}
                            name="end_time" onChange={(e)=>onChangeCustomPrecio(e,index)}
                            /> */}
                            <div className="mt-1">

                            <span className="label">Monto</span>
                            <div className="mt-1">
                            <input required type="number" className="input h-8 w-20" value={item.precio} name="precio"
                            onChange={(e)=>onChangeCustomPrecio(e.target.name,e.target.value,index)}
                            />
                            </div>
                            </div>
                            <svg  onClick={()=>{}}
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                            className="icon-button noSelect">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        </>
                    )
                })}
            </div>

          <div className=" flex flex-col space-y-4  pt-1 w-min whitespace-nowrap">
                <span onClick={()=>addCustomPrecioInstalcion()}
                 className="text-button noSelect">Agregar horas</span>
                </div>
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