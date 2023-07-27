"use client"
import ButtonSubmit from "@/components/util/button/ButtonSubmit";
import InputWithIcon from "@/components/util/input/InputWithIcon";
import InputPassword from "@/components/util/input/InputPassword";
import { login } from "@/context/actions/account-actions";
import { useAppDispatch, useAppSelector } from "@/context/reduxHooks";
import { uiActions } from "@/context/slices/uiSlice";
import axios from "axios";
import Image from "next/image";
import { ChangeEvent, FormEvent, useState } from "react";
import InputWithMaxLength from "@/components/util/input/InputWithMaxLength";
import TextAreaWithMaxLength from "@/components/util/input/TextAreaWithMaxLength";
import { MapComponent } from "@/components/register/MapComponent";
import UploadImage from "@/components/util/input/UploadImage";
const Login = () =>{
    const [openMap,setOpenMap] = useState(false)
    const dispatch = useAppDispatch()
    const loaded = useAppSelector(state=>state.ui.loaded)

    const uiState = useAppSelector(state=>state.ui)
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
        // dispatch(login(email,name))
        window.location.assign("/admin/establecimientos")
      }catch(err){
        console.log(err)
      }
      // window.location.assign("http://localhost:3000/establecimiento/1469058c-6084-4e1e-a191-de1d5fa3b9c5/instalaciones")
    }  
  

    return(
      <>
        <div className=' absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 overflow-auto h-[100vh] pb-20'>
          <form action="">

          <UploadImage
          setFile={setPhoto}
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
          label="Nombre del Establecimiento*"
          />

        <InputWithMaxLength
          value={email}
          name="email"
          onChangeValue={(e)=>{
            if(e.target.value.length <= 50){ 
              onChange(e)
            }
          }}
          max={50}
          label="Email"
          />
         
         <InputWithMaxLength
          value={phone_number}
          name="phone_number"
          onChangeValue={(e)=>{
            if(e.target.value.length <= 20){ 
              onChange(e)
            }
          }}
          max={20}
          label="Número de Telefono"
          />

     

          <div className="relative">
           <div>
            <span className="help-text">Ubicación*</span>
            <div className="flex input justify-between cursor-pointer" 
            onClick={()=>setOpenMap(true)}>
              <input type="text" required={true}  className=" outline-none w-full"
               value={address} 
               />
              {/* <span className=" truncate "></span> */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            </div>
          </div>
        <span className="help-text absolute right-1">{`${address.length}/50`}</span>
        </div>

        
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

           {openMap&&
                <MapComponent 
                loaded={loaded} 
                setLoaded={(b:boolean)=>dispatch(uiActions.setLoaded(b))}
                open={openMap} close={()=>setOpenMap(false)}
                lng={longitud}
                lat={latitud}
                address={address}
                setAddress={(e)=>{
                  setFormData({
                    ...formData,address:e
                  })
                }}
                />
            }

            <ButtonSubmit
            loading={false}
            title="Crear Establecimiento"
            />

      </form>
          {/* <div>
            <span className="help-text">Descripción</span>
            <textarea  className="textarea" rows={5} />
          </div> */}
    </div>
          <div className="absolute bottom-1 divider-up w-full p-2 flex justify-end z-20 bg-gray-200">
            <button className="button">Continuar</button>
          </div>
            </>
    )
}
export default Login;