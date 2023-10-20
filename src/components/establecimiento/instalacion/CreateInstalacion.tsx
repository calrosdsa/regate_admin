import ButtonSubmit from "@/components/util/button/ButtonSubmit"
import ButtonWithLoader from "@/components/util/button/ButtonWithLoader"
import InputWithMaxLength from "@/components/util/input/InputWithMaxLength"
import TextAreaWithMaxLength from "@/components/util/input/TextAreaWithMaxLength"
import UploadImage from "@/components/util/input/UploadImage"
import { CreateInstalacion } from "@/core/repository/instalacion"
import { GetCategories } from "@/core/repository/labels"
import Image from "next/image"
import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { toast } from "react-toastify"

const CreateInstalacionComponent = ({uuid,addInstalacion,close}:{
    uuid:string
    addInstalacion:(value:Instalacion)=>void
    close:()=>void
}) =>{
    const [formData,setFormData ] = useState({
        name:"",
        description:"",
        cantidad_de_personas:20,
        category_id: 1,
      })
      const [uploadLoading,setUploadingLoading] = useState(false)
      const [categories,setCategories] = useState<Label[]>([])
      const [photo,setPhoto] = useState<File | undefined>()
      const {name,description,category_id,cantidad_de_personas} = formData
      const onChange = (e:ChangeEvent<HTMLInputElement>)=>{
      //   dispatch(authActions.setErrrorLogin(undefined))
        setFormData({ ...formData, [e.target.name]: e.target.value });
      }

      const getCategories = async() => {
        const res:Label[] = await GetCategories()
        setCategories(res)
      }
      const onSubmit = async(e:FormEvent<HTMLFormElement>) => {
        try{
            setUploadingLoading(true)
            e.preventDefault()
            const uploadData = new FormData()
            uploadData.append("name",name)
            uploadData.append("description",description)
            uploadData.append("category_id",category_id.toString())
            uploadData.append("cantidad_de_personas",cantidad_de_personas.toString())
            // uploadData.append("establecimiento_id",id.toString())
            uploadData.append("establecimiento_uuid",uuid)
            if(photo != undefined) uploadData.append("photo",photo)
            const res:Instalacion = await CreateInstalacion(uploadData)
            addInstalacion(res)
            setUploadingLoading(false)
            close()
            toast.success("Se ha creado una nueva cancha")
            console.log("INSTALACION --",res)
        }catch(err){
            toast.error("Un error a ocurrido")
            setUploadingLoading(false)
        }
      }

      useEffect(()=>{
        getCategories()
      },[])
   
    return(
        <div className=" max-w-xl">
            <form onSubmit={onSubmit}>

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
          value={cantidad_de_personas.toString()}
          name="cantidad_de_personas"
          onChangeValue={(e)=>{
              if(e.target.value.length <= 20){ 
              onChange(e)
            }
          }}
          label="Maxima cantidad de Personas"
          type="number"
          />

          <ButtonSubmit 
          loading={uploadLoading}
          title="Crear cancha"
          />
            </form>
        </div>
    )
}

export default CreateInstalacionComponent;