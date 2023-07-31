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
                    updateInstalacion("name",value,addLoader,removeLoader)
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


            <div>
             <div className=" flex justify-between items-center space-x-5 py-3 divider">
                <div className="grid">
                    <span className="label">Categoria</span>
                    <span className="text-sm">{instalacion.category_name}</span>
                </div>
                <span onClick={getCategories} className=" underline font-medium cursor-pointer">Edit</span>
            </div>

            <Transition
            show={show}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
            >
          <select name="" id="" className="input" value={category} onChange={(e)=>{
            setCategory(Number(e.target.value))
            }}>
            {categories.map((item)=>{
                return(
                    <option key={item.id} value={item.id}>{item.name}</option>
                    )
                })}
          </select>

            <ButtonWithLoader
              onClick={async()=>{
                await updateInstalacion("category_id",category?.toString(),()=>setLoadingUpdate(true),()=>{
                    setLoadingUpdate(false)
                    setShow(false)
                })
                const name = categories.find(item=>item.id == category)?.name
                if(name != undefined){
                    update("category_name",name)
                }
              }}
              title="Guardar"
              loading={loadingUpdate}
            />
              {/* <button onClick={()=>edit(()=>setLoading(true),()=>setLoading(false),value)} */}
               {/* className=" button">Guardar Cambios</button> */}
            </Transition>

            </div>
            {/* <div className=" flex justify-between space-x-5 items-center">
                <div className="grid">
                    <span className="label">Descripcion</span>
                    <p className="help-text">{instalacion.description}</p>
                </div>
                <span className=" underline font-medium cursor-pointer">Edit</span>
            </div> */}


            <UploadImage
          setFile={setPhoto}
          src={instalacion.portada}
          save={uploadImage}
          id={instalacion.name}
          />
           
        </div>
    )
}
export default InstalacionDetail

