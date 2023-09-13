import Image from "next/image"
import EditComponentImage from "../../util/input/EditComponentImage"
import EditComponent from "@/components/util/input/EditComponent"
import UploadImage from "@/components/util/input/UploadImage"
import { UpdateInstalacion, UpdateInstalacionPhoto } from "@/core/repository/instalacion"
import { toast } from "react-toastify"
import { useEffect, useState } from "react"
import ButtonWithLoader from "@/components/util/button/ButtonWithLoader"
import { Transition } from "@headlessui/react"
import { GetCategories } from "@/core/repository/labels"
import EditComponentSelect from "@/components/util/input/EditComponentSelect"
import { Tooltip } from 'react-tooltip';
import { estadoVisibility } from "@/core/util/data"
import { EstadoVisibility } from "@/core/type/enums"


const InstalacionDetail = ({instalacion,update,uuid}:{
    instalacion:Instalacion
    update:(name:string,value:string)=>void
    uuid:string
}) =>{
    const [show,setShow] = useState(false)
    const [category,setCategory] = useState<number>(instalacion.category_id)
    const [photo,setPhoto] = useState<File | undefined>(undefined)
    const [ categories,setCategories ] = useState<Label[]>([])
    const [loadingUpdate,setLoadingUpdate] = useState(false)

    // const itemsSelected:SelectItem[] = categories.map(item=>{
    //     return( {value:item.name,name:item.id.toString()} )
    // })

    const getCategories = async() =>{
        try{
            const res:Label[] = await GetCategories()
            setCategories(res)
            console.log(res)
            setShow(!show)
        }catch(err){
            console.log(err)
        }
    }
    const updateInstalacion = async(name:string,value:string,addLoader:()=>void,removeLoader:()=>void) =>{
            try{
                addLoader()
                const req = JSON.stringify({[name]:value})
                console.log(JSON.stringify(req))
                const res = await UpdateInstalacion(req,instalacion.id)
                console.log(res)
                update(name,value)
                removeLoader()
                toast.success("¡Los cambios realizados han sido guardados exitosamente!")
            }catch(err){
                console.log(err)
                removeLoader()
                toast.error("¡Los cambios realizados han sido guardados exitosamente!")
            }
    }
    const uploadImage = async(setLoading:(e:boolean)=>void) =>{
        if(photo != undefined){
            try{
                setLoading(true)
                const formData = new FormData()
                formData.append("photo",photo)
                formData.append("uuid",instalacion.uuid)
                formData.append("id",instalacion.id.toString())
                formData.append("establecimiento_uuid",uuid)
                const res:string = await UpdateInstalacionPhoto(formData)
                update("portada",res)
                setLoading(false)
                // setOpenMap(false)
                toast.success("¡Los cambios realizados han sido guardados exitosamente!")
            }catch(err){
                setLoading(false)
                console.log(err)
                toast.error("¡Los cambios realizados han sido guardados exitosamente!")
            }
        }
    }
    useEffect(()=>{
      
    },[instalacion])
    return(
        <div className="grid gap-y-3 w-full">
            {/* <button className="button w-min rounded-lg">Editar</button> */}
            <span className="text-xl py-2 font-medium">Instalacion Info</span>
           <EditComponent
                label="Titulo"
                content={instalacion.name}
                edit={(addLoader,removeLoader,value)=>{
                    updateInstalacion("name",value,addLoader,removeLoader)
                }}/>
            <EditComponent
                label="Descripcion"
                isTextArea={true}
                content={instalacion.description}
                edit={(addLoader,removeLoader,value)=>{
                    updateInstalacion("description",value,addLoader,removeLoader)
                }}
                />
            <EditComponent
                label="Maxima cantidad de personas"
                content={`${instalacion.max_cupos}`}
                edit={(addLoader,removeLoader,value)=>{
                    updateInstalacion("max_cupos",value,addLoader,removeLoader)
                }}
                type="tel"
                />

            <EditComponentSelect
            label="Categoria"
            items={categories.map(item=>{
                return( {name:item.name,value:item.id.toString()} )
            })}
            getItems={getCategories}
            currentSelected={ {name:instalacion.category_name,value:instalacion.category_id.toString()}}
            updateSelect={async(value,addLoader,removeLoader,currentName)=>{
                await updateInstalacion("category_id",value,addLoader,removeLoader)
                update("category_name",currentName)
            }}
            /> 


            <EditComponentSelect
            label="Visibilidad"
            items={estadoVisibility}
            getItems={()=>{}}
            currentSelected={{name:estadoVisibility.find(item=>item.value == instalacion.estado.toString())
                ?.name as string,value:instalacion.estado.toString()}}
            updateSelect={async(value,addLoader,removeLoader,currentName)=>{
                await updateInstalacion("estado",value,addLoader,removeLoader)
                // update("estado",currentName)
            }}
            contentToolTip={
                    <div className="grid">
                        <span>Habilitado: Sera visible en la aplicación </span>
                        <span>Deshabilitado: No sera visible en la aplicacion</span>
                    </div>
            }
            tooltipId="estado-cancha"
            />   

            


            <UploadImage
          setFile={setPhoto}
          src={instalacion.portada}
          save={uploadImage}
          width="w-full"
          id={instalacion.name}
          />
           
        </div>
    )
}
export default InstalacionDetail

