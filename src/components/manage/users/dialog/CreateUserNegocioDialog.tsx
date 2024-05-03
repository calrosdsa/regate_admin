import React,{FormEvent, Fragment, useState} from 'react'
import { Dialog,Switch,Transition } from '@headlessui/react'
import InputPassword from '@/components/util/input/InputPassword'
import ButtonSubmit from '@/components/util/button/ButtonSubmit'
import { useAppDispatch, useAppSelector } from '@/context/reduxHooks'
import { toast } from 'react-toastify'
import DialogHeader from '@/components/util/dialog/DialogHeader'
import { Http, UserRol } from '@/core/type/enums'
import { getEstablecimientos } from '@/context/actions/account-actions'
import Image from 'next/image'
import Loading from '@/components/util/loaders/Loading'
import ButtonWithLoader from '@/components/util/button/ButtonWithLoader'
import { uiActions } from '@/context/slices/uiSlice'
import InputWithIcon from '@/components/util/input/InputWithIcon'
import { unexpectedError } from '@/context/config'
import DialogLayout from '@/components/util/dialog/DialogLayout'
import { GetEstablecimientos } from '@/core/repository/establecimiento'
import { CreateUser } from '@/core/repository/manage'
import { Button, DialogActions, Typography } from '@mui/material'

 interface Props{
   openModal:boolean
   closeModal:()=>void
   refreshUsers:()=>void
 }

 type Data = {
  username:string
  email:string
  rol:number | undefined
 }

 enum Tab {
    MAIN,
    ESTABLECIMIENTOS,
 }

const CreateUserNegocioDialog:React.FC<Props>=({
  openModal,closeModal,refreshUsers,
})=> {
    // const [openDialogConfirm,setOpenDialogConfirm] = useState(false)
    const dispatch = useAppDispatch()
    // const establecimientos = useAppSelector(state => state.account.establecimientos)
    const [loading,setLaoding] = useState(false)
    const uiState = useAppSelector(state => state.ui)
    const [currentTab,setCurrentTab] = useState(Tab.MAIN)
    const [establecimientosIds,setEstablecimientoIds] = useState<EstablecimientoUser[]>([])
    // const loading = useAppSelector(state=>state.ui.loading)
    const [formData,setFormData]=useState<Data>({
        username:"",
        email:"",
        rol:UserRol.CLIENT_USER_ROL
    })
    const {username,email,rol} = formData
    const [establecimientos,setEstablecimientos] = useState<EstablecimientoData[]>([])
    const getDataEstablecimientos = async()=>{
        try{
            dispatch(uiActions.setInnerLoading(true))
            const data:EstablecimientoData[] = await GetEstablecimientos()
            dispatch(uiActions.setInnerLoading(false))
            setEstablecimientos(data)
        }catch(err){
            dispatch(uiActions.setInnerLoading(false))
        }
            // setReservas(data)
    }
  const onChange = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>{
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const selectEstablecimientos = (id:number) =>{
    const establecimiento = establecimientos.find(item=>item.id == id)
    if(establecimiento != undefined) {
      const currentEstablecimiento:EstablecimientoUser = {
        uuid:establecimiento.uuid,
        name:establecimiento.name,
        id:establecimiento.id,
      }
      if(establecimientosIds.map(item=>item.uuid).includes(currentEstablecimiento.uuid)){
        const newIds = establecimientosIds.filter(item=>item.uuid != currentEstablecimiento.uuid)
        setEstablecimientoIds(newIds)
      }else{
        setEstablecimientoIds([...establecimientosIds,currentEstablecimiento])
      }
    }
  }

  const createUser = async() => {
    try{
      setLaoding(true)
      const request:CreateUserRequest = {
        email:email,
        username:username,
        rol:rol as number,
        establecimientos:establecimientosIds
    }
    const res:Response = await CreateUser(request)
    const data = await res.json()
    switch(res.status){
      case 400:
        toast.error(data.message)
        break;
      case 200:  
        refreshUsers()
        toast.success("Se ha agragado un nuevo usuario")
        closeModal()
        break;
    }
    setLaoding(false)
    }catch(err:any){
      setLaoding(false)
    }
  }

  const onSubmit = async(e:FormEvent<HTMLFormElement>)=>{
    try{
      e.preventDefault()
      setLaoding(true)
      if(rol == UserRol.CLIENT_USER_ROL){
        if(establecimientos.length == 0){
          getDataEstablecimientos()
        }
        setCurrentTab(Tab.ESTABLECIMIENTOS)
        setLaoding(false)
        return
      }
      const request:CreateUserRequest = {
          email:email,
          username:username,
          rol:rol as number,
          establecimientos:[]
      }
      const res:Response = await CreateUser(request)
      switch(res.status){
        case Http.StatusOk:          
          refreshUsers()
          toast.success("Se ha agragado un nuevo usuario")
          closeModal()
          setLaoding(false)
          break;
        case Http.StatusBadRequest:  
          const data:ResponseMessage  = await res.json()
          toast.error(data.message)
          setLaoding(false)
          break;
      }
    }catch(err){
      toast.error(unexpectedError)
      setLaoding(false)
    }
  }

  return (
    <>
   <DialogLayout
   title='Crear administrador'
   className=' max-w-lg'
   open={openModal}
   close={closeModal}
    >
        <div className='rounded-lg bg-white overflow-auto'>
            {Tab.MAIN == currentTab &&
            <form className='p-2' onSubmit={onSubmit}>
                <InputWithIcon
                value={username}
                onChange={onChange}
                name='username'
                label='Nombre'      
                />
                <InputWithIcon
                value={email}
                onChange={onChange}
                name='email'
                label='Email'
                type='email'
                />

              <Typography variant="body2" sx={{my:1}}>Asignar rol</Typography> 

              <div className='border-[1px] py-2 space-y-4'>
                <div className='grid grid-cols-6 place-items-center'>
                  <div className='col-span-5 grid grid-cols-8'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                className="w-6 h-6 col-span-1 place-self-center">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              <div className=' col-span-7'>
              <span className='font-semibold'>Acceso de usuario</span>
              <p className='text-[13px] leading-3'>Un usuario con el rol de usuario tendrá acceso restringido y solo podrá gestionar los establecimientos designados por un administrador.</p>
              </div>
                  </div>

                  <div className="">
              <Switch
              checked={rol == UserRol.CLIENT_USER_ROL}
              onChange={(e)=>{
                if(e){
                  setFormData({
                    ...formData,
                    rol:UserRol.CLIENT_USER_ROL
                  })
                }else{
                  setFormData({
                    ...formData,
                    rol:undefined
                  })
                }
              }}
              className={`${rol == UserRol.CLIENT_USER_ROL ? 'bg-primary' : 'bg-gray-400'}
              relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
              >
              <span className="sr-only">Use setting</span>
              <span
                aria-hidden="true"
                className={`${rol == UserRol.CLIENT_USER_ROL ? 'translate-x-6' : 'translate-x-0'}
                pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                />
              </Switch>
              </div>

                </div>

                <div className='grid grid-cols-6 place-items-center'>
                  <div className='col-span-5 grid grid-cols-8'>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                        className="w-6 h-6 col-span-1 place-self-center">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
              <div className=' col-span-7'>
              <span className='font-semibold'>Acceso de administrador</span>
              <p className='text-[13px] leading-3'>Los usuarios con rol de administrador tendrán el control total.
                Pueden modificar la configuración, los usuarios y datos de la organización.</p>
              </div>
                  </div>

                  <div className="">
              <Switch
              checked={rol == UserRol.ADMIN_USER_ROL}
              onChange={(e)=>{
                if(e){
                  setFormData({
                    ...formData,
                    rol:UserRol.ADMIN_USER_ROL
                  })
                }else{
                  setFormData({
                    ...formData,
                    rol:undefined
                  })
                }
              }}
              className={`${rol == UserRol.ADMIN_USER_ROL ? 'bg-primary' : 'bg-gray-400'}
              relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
              >
              <span className="sr-only">Use setting</span>
              <span
                aria-hidden="true"
                className={`${rol == UserRol.ADMIN_USER_ROL ? 'translate-x-6' : 'translate-x-0'}
                  pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
              />
              </Switch>
              </div>
                </div>
              </div>
                 
                <ButtonSubmit
                loading={loading}
                title='Confirmar'
                />
            </form>
            }
            {Tab.ESTABLECIMIENTOS == currentTab &&
            <div className=' pt-2'>
              
              <Loading
              loading={uiState.innerLoading}
              className='pt-2 flex w-full justify-center'
              />
              <div className=' overflow-auto'>
              {establecimientos.map((item,idx)=>{
                return(
                  <div key={idx} onClick={()=>selectEstablecimientos(item.id)}
                  className='flex justify-between items-center px-2 py-3 border-b-[1px] cursor-pointer 
                  hover:bg-gray-200'>
                    <span className='title'>{item.name}</span>

                    <input type="checkbox" checked={establecimientosIds.map(item=>item.uuid).includes(item.uuid)} 
                    onChange={()=>selectEstablecimientos(item.id)}/>
                  </div>
                )
              })}

              </div>
            
                <DialogActions >
                  <div className=' space-x-2'>
                <Button variant="contained" onClick={()=>setCurrentTab(Tab.MAIN)}>Volver</Button>
                <ButtonWithLoader
                loading={loading}
                title='Crear usuario'
                onClick={()=>createUser()}
                />
                  </div>
                </DialogActions>
                {/* <button className='button' onClick={()=>createUser()}>Crear usuario</button> */}

            </div>
            }
        </div>
    </DialogLayout>
    </>
  )
}

export default CreateUserNegocioDialog;

