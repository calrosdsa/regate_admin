import Image from "next/image"
import EditComponentImage from "../../util/input/EditComponentImage"
import EditComponent from "@/components/util/input/EditComponent"
import UploadImage from "@/components/util/input/UploadImage"
import { DeleteInstalacion, UpdateInstalacion, UpdateInstalacionPhoto } from "@/core/repository/instalacion"
import { toast } from "react-toastify"
import { useEffect, useState } from "react"
import ButtonWithLoader from "@/components/util/button/ButtonWithLoader"
import { Transition } from "@headlessui/react"
import { GetCategories } from "@/core/repository/labels"
import EditComponentSelect from "@/components/util/input/EditComponentSelect"
import { Tooltip } from 'react-tooltip';
import { estadoVisibility } from "@/core/util/data"
import { EstadoVisibility } from "@/core/type/enums"
import { successfulMessage, unexpectedError } from "@/context/config"
import { IconButton } from "@mui/material"
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmationDialog from "@/components/util/dialog/ConfirmationDialog"
import { uiActions } from "@/context/slices/uiSlice"
import { useAppDispatch } from "@/context/reduxHooks"

const InstalacionDetail = ({instalacion,update,uuid,refresh}:{
    instalacion:Instalacion
    update:(name:string,value:string)=>void
    refresh:()=>void
    uuid:string
}) =>{
    const dispatch = useAppDispatch()
    const [show,setShow] = useState(false)
    const [category,setCategory] = useState<number>(instalacion.category_id)
    const [photo,setPhoto] = useState<File | undefined>(undefined)
    const [ categories,setCategories ] = useState<Label[]>([])
    const [loadingUpdate,setLoadingUpdate] = useState(false)
    const [deleteConfirmationDialog,setDeleteConfirmationDialog] = useState(false)

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
    const deleteInstalacion = async() =>{
        try{
            dispatch(uiActions.setLoaderDialog(true))
            const d:DeleteInstalacionRequest = {
                id:instalacion.id,
                uuid:instalacion.uuid,
                establecimiento_uuid:uuid
            }
            await DeleteInstalacion(d)
            refresh()
            setDeleteConfirmationDialog(false)
            dispatch(uiActions.setLoaderDialog(false))
            toast.success(successfulMessage)
        }catch(err){
            dispatch(uiActions.setLoaderDialog(false))
            toast.error(unexpectedError)
        }
    }
    const updateInstalacion = async(name:string,value:string,addLoader:()=>void,removeLoader:()=>void) =>{
            try{
                addLoader()
                const req = JSON.stringify({[name]:value})
                console.log(JSON.stringify(req))
                const res = await UpdateInstalacion(req,instalacion.id,uuid,instalacion.uuid)
                console.log(res)
                update(name,value)
                removeLoader()
                toast.success(successfulMessage)
            }catch(err){
                console.log(err)
                removeLoader()
                toast.error(unexpectedError)
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
                toast.success(successfulMessage)
            }catch(err){
                setLoading(false)
                console.log(err)
                toast.error(unexpectedError)
            }
        }
    }
    useEffect(()=>{
      
    },[instalacion])
    return(
        <>
        {deleteConfirmationDialog &&
        <ConfirmationDialog
        open={deleteConfirmationDialog}
        close={()=>setDeleteConfirmationDialog(true)}
        performAction={()=>deleteInstalacion()}
        description={`Se eliminar la cancha (${instalacion.name})`}
        />
        }
        <div className="grid gap-y-3 w-full">
            {/* <button className="button w-min rounded-lg">Editar</button> */}
            <div className="flex justify-between space-x-3">
            <span className="text-xl py-2 font-medium">Instalacion Info</span>
            <IconButton onClick={()=>setDeleteConfirmationDialog(true)}>
                <DeleteIcon/>
            </IconButton>
            </div>
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
            {/* <EditComponent
                label="Maxima cantidad de personas"
                content={`${instalacion.max_cupos}`}
                edit={(addLoader,removeLoader,value)=>{
                    updateInstalacion("max_cupos",value,addLoader,removeLoader)
                }}
                type="tel"
                /> */}

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
          </>
    )
}
export default InstalacionDetail

