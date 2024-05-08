"use client"
import ButtonSubmit from "@/components/util/button/ButtonSubmit";
import { useAppDispatch, useAppSelector } from "@/context/reduxHooks";
import { uiActions } from "@/context/slices/uiSlice";
import { ChangeEvent, FormEvent, useState } from "react";
import InputWithMaxLength from "@/components/util/input/InputWithMaxLength";
import TextAreaWithMaxLength from "@/components/util/input/TextAreaWithMaxLength";
import { MapComponent } from "@/components/register/MapComponent";
import UploadImage from "@/components/util/input/UploadImage";
import { CreateEstablecimiento } from "@/core/repository/establecimiento";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import { Router } from "next/router";
import { useRouter } from "next/navigation";
import { InputAdornment, Paper, TextField, Typography } from "@mui/material";
import LocationOnIcon from '@mui/icons-material/LocationOn';

const Login = () =>{
    const router = useRouter()
    const [openMap,setOpenMap] = useState(false)
    const dispatch = useAppDispatch()
    const loaded = useAppSelector(state=>state.ui.loaded)
    // const uiState = useAppSelector(state=>state.ui)
    const [loading,setLoading] = useState(false)
    // const authtate = useAppSelector(state=>state.auth)
    const [formData,setFormData ] = useState({
      email:"",
      name:"",
      phone_number:"",
      description:"",
      address:"",
      longitud: -63.18102600200848,
      latitud:-17.783844868238027,
    })
    const [photo,setPhoto] = useState<File | undefined>()
    const {email,name,phone_number,description,address,latitud,longitud} = formData
    const onChange = (e:ChangeEvent<HTMLInputElement>)=>{
    //   dispatch(authActions.setErrrorLogin(undefined))
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
 
    const onSubmit = async(e:FormEvent<HTMLFormElement>) =>{
      try{
        e.preventDefault()
        setLoading(true)
        const form = new FormData()
        form.append("name",name)
        form.append("description",description)
        form.append("address",address)
        form.append("longitud",longitud.toString())
        form.append("latitud",latitud.toString())
        form.append("phone_number",phone_number)
        form.append("email",email)
        if(photo != undefined){ 
          form.append("photo",photo)
        }
        const data = await CreateEstablecimiento(form)
        // console.log(data)
        router.push(`/establecimiento/${data.uuid}/config`)
        setLoading(false)
        toast.success("Se ha creado un nuevo establecimiento")
        
        // dispatch(login(email,name))
      }catch(err){
        toast.error("Un error a ocurrido")
        setLoading(false  )
      }
      // window.location.assign("http://localhost:3000/establecimiento/1469058c-6084-4e1e-a191-de1d5fa3b9c5/instalaciones")
    }  
  

   
    return(
      <>
        <ToastContainer
    position='bottom-center'
    />
        <div className='flex flex-col justify-center w-full px-2  overflow-auto h-[100vh] items-center'>
          <Paper elevation={2} className="p-2 sm:w-2/3 lg:w-1/2
        xl:w-2/3">

          <form onSubmit={onSubmit} >

          <UploadImage
          setFile={setPhoto}
          width="w-full"
          src=""
          />

          <div className="h-2"/>

          <InputWithMaxLength
          value={name}
          required={true}
          name="name"
          onChangeValue={(e)=>{
              onChange(e)
          }}
          max={50}
          label="Nombre del Establecimiento*"
          />

        <InputWithMaxLength
          value={email}
          name="email"
          onChangeValue={(e)=>{
              onChange(e)
          }}
          max={50}
          label="Email"
          type="email"
          />
         
         <InputWithMaxLength
          value={phone_number}
          name="phone_number"
          onChangeValue={(e)=>{
              onChange(e)
          }}
          max={20}
          type="tel"
          label="Número de Telefono"
          />

     

          <div className="relative">
           <div>
            <Typography variant="body2" sx={{mb:1,mt:1}}>Ubicación*</Typography>
            <TextField
            size={"small"}
            required
            sx={{width:"100%"}}
            multiline
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOnIcon/>
                  </InputAdornment>  
              ),
            }}
            value={address} onChange={(e)=>{}}
            onClick={()=>setOpenMap(true)}
            />
         
          </div>
        {/* <span className="help-text absolute right-1">{`${address.length}/50`}</span> */}
        </div>

        
          <InputWithMaxLength
          value={description}
          name="description"
          onChangeValue={(e)=>{
              setFormData({...formData,description:e.target.value})
          }}
          multiline={true}
          max={250}
          label="Descripción"
          />

           {openMap&&
                <MapComponent 
                loaded={loaded} 
                setLoaded={(b:boolean)=>dispatch(uiActions.setLoaded(b))}
                open={openMap}
                close={()=>setOpenMap(false)}
                lng={longitud}
                lat={latitud}
                address={address}
                setAddress={(e)=>{
                  setFormData({
                    ...formData,address:e
                  })
                }}
                update={(lng,lat,address,setLoading)=>{
                  setLoading(true)
                  setFormData({
                    ...formData,
                    longitud:Number(lng),
                    latitud:Number(lat),
                    address:address
                  })
                  setLoading(false)
                  setOpenMap(false)
                }}
                />
            }
            <div className="h-2"/>
            <ButtonSubmit
            loading={loading}
            title="Crear Establecimiento"
            className=""
            />

      </form>
      </Paper>

          {/* <div>
            <span className="help-text">Descripción</span>
            <textarea  className="textarea" rows={5} />
          </div> */}
    </div>
          {/* <div className="absolute bottom-1 divider-up w-full p-2 flex justify-end z-20 bg-gray-200">
            <button className="button">Continuar</button>
          </div> */}
            </>
    )
}
export default Login;