"use client"

import AddEstablecimientoUserDialog from "@/components/manage/users/dialog/AddEstablecimientoUser"
import CreateUserNegocioDialog from "@/components/manage/users/dialog/CreateUserNegocioDialog"
import UserOptionDialog from "@/components/manage/users/UserOptionDialog"
import MenuLayout from "@/components/util/button/MenuLayout"
import MenuOption from "@/components/util/button/MenuOption"
import ConfirmationDialog from "@/components/util/dialog/ConfirmationDialog"
import Loading from "@/components/util/loaders/Loading"
import { successfulMessage, unexpectedError } from "@/context/config"
import { useAppDispatch } from "@/context/reduxHooks"
import { uiActions } from "@/context/slices/uiSlice"
import { GetEstablecimientosUserByUuid } from "@/core/repository/account"
import { DeleteEstablecimientoUser, GetUsersEmpresa, UpdateUserEstado } from "@/core/repository/manage"
import { UserEstado, UserRol } from "@/core/type/enums"
import { appendSerachParams } from "@/core/util/routes"
import moment from "moment"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"

export default function Page(){
    const dispatch = useAppDispatch()
    const searchParams = useSearchParams();
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    const uuid = searchParams.get("uuid")
    const pathname = usePathname();
    const router = useRouter()
    const [users,setUsers] = useState<User[]>([])
    const [loadingUsers,setLoadingUsers] = useState(false)
    const [currentUser,setCurrentUser] = useState<User | null>(null)
    const [openDialogCreateUser,setOpenDialogCreateUser] = useState(false)
    const [currentUserEstablecimientos,setCurrentUserEstablecimientos] = useState<EstablecimientoUser[]>([])
    const [establecimientosUser,setEstablecimientosUser] = useState<EstablecimientoUser[]>([])
    const [loadingEstablecimientos,setLoadingEstablecimientos] = useState(false)
    const [openConfirmationDialog,setOpenConfirmationDialog] = useState(false)
    const [currentUserEstado,setCurrentUserEstado] = useState<UserEstado | null>(null)
    const [userEstablecimiento,setUserEstablecimiento] = useState<EstablecimientoUser | null>(null)
    const [openAddEstablecimientoDialog,setOpenAddEstablecimientoDialog] = useState(false)

    const selectUserEstado = (estado:UserEstado) => {
        setCurrentUserEstado(estado)
        setOpenConfirmationDialog(true)
    }
    const getMessage = (estado:UserEstado | null,user:User) =>{
        switch(estado){
            case UserEstado.ENABLED:
                return `La cuenta del usuario ${user.username} será habilitada.`
            case UserEstado.DISABLED:
                return `La cuenta del usuario ${user.username} será deshabilitada.`
            case UserEstado.DELETED:
                return `La cuenta del usuario ${user.username} será eliminada`
            default:
                return ""
        }
    }

    const getUsersEmpresa = async() => {
        try{
            setLoadingUsers(true)
            const res:User[] = await GetUsersEmpresa()
            setUsers(res)
            if(res.length > 0){
                if(uuid != null){
                    const user = res.find(item=>item.user_id == uuid)
                    if (user != undefined){
                    selectUser(user)
                    }
                }else{
                    selectUser(res[0])
                }
            }
            setLoadingUsers(false)
        }catch(err){
            setLoadingUsers(false)
        }
    }

    const selectUser = async(user:User) =>{
        try{
            setCurrentUserEstablecimientos([])
            appendSerachParams("uuid",user.user_id,router,current,pathname)
            setCurrentUser(user)
            const dataRequest = {
                uuid:user.user_id,
                empresa_id:user.empresa_id,
                rol:user.rol
            }
            setLoadingEstablecimientos(true)
            const res:EstablecimientoUser[] = await GetEstablecimientosUserByUuid(JSON.stringify(dataRequest))
            setCurrentUserEstablecimientos(res)
            setLoadingEstablecimientos(false)
        }catch(err){
            setLoadingEstablecimientos(false)
        }
    }

    const getAllEstablecientos = async() => {
        try{
            if(currentUser == null) return
            if(establecimientosUser.length > 0) {
                setOpenAddEstablecimientoDialog(true)
                return
            }
            dispatch(uiActions.setLoaderDialog(true))
            const dataRequest = {
                uuid:"",
                empresa_id:currentUser.empresa_id,
                rol:UserRol.ADMIN_USER_ROL
            }
            const res:EstablecimientoUser[] = await GetEstablecimientosUserByUuid(JSON.stringify(dataRequest))
            setEstablecimientosUser(res)
            setOpenAddEstablecimientoDialog(true)
            dispatch(uiActions.setLoaderDialog(false))

        }catch(err){
            dispatch(uiActions.setLoaderDialog(false))

        }
    }

    const deleteUserEstableciento = async() => {
        try{
            if(userEstablecimiento == null) return
            if(userEstablecimiento.admin_id == undefined) return
            dispatch(uiActions.setLoaderDialog(true))
            await DeleteEstablecimientoUser(userEstablecimiento.uuid,userEstablecimiento.admin_id)
            setUserEstablecimiento(null)
            dispatch(uiActions.setLoaderDialog(false))
            toast.success(successfulMessage)
            const f = currentUserEstablecimientos.filter(item=>item.uuid != userEstablecimiento.uuid)
            setCurrentUserEstablecimientos(f)
        }catch(err){
            toast.success(unexpectedError)
            dispatch(uiActions.setLoaderDialog(false))
            console.log(err)
        }
    }


    useEffect(()=>{
        getUsersEmpresa()
    },[])

    const changeUserEstado = async(e: UserEstado) =>{
        try{
            if(currentUser == null) return
            dispatch(uiActions.setLoaderDialog(true))
            const dataR:UpdateUserRequest = {
                uuid:currentUser.user_id,
                estado:e
            }
            await UpdateUserEstado(JSON.stringify(dataR))
            switch(e){
                case UserEstado.DELETED:
                    const newUsers = users.filter(item=>item.user_id != currentUser.user_id)
                    setUsers(newUsers)
                    toast.success("Usuario Eliminado")
                    break;
                default:
                    setCurrentUser({...currentUser,
                        estado:e
                    })
                    const updateUsers= users.map((item)=>{
                        if(item.user_id == currentUser.user_id){
                            item.estado = e
                        }
                        return item
                    })
                    setUsers(updateUsers)
            }
            // getUsersEmpresa()
            dispatch(uiActions.setLoaderDialog(false))
        }catch(err){
            dispatch(uiActions.setLoaderDialog(false))
        }
    }

    return(
        <>
        {userEstablecimiento != null &&
        <ConfirmationDialog
        open={userEstablecimiento != null}
        close={()=>setUserEstablecimiento(null)}
        performAction={deleteUserEstableciento}
        />
        }
        {openDialogCreateUser&&
        <CreateUserNegocioDialog
        openModal={openDialogCreateUser}
        closeModal={()=>setOpenDialogCreateUser(false)}
        refreshUsers={()=>getUsersEmpresa()}
        />
        }
        {(openAddEstablecimientoDialog && currentUser != null)&&
        <AddEstablecimientoUserDialog
        open={openAddEstablecimientoDialog}
        close={()=>setOpenAddEstablecimientoDialog(false)}
        currentUserUuid={currentUser.user_id}
        establecimientosUser={establecimientosUser.filter(item=>!currentUserEstablecimientos.map(t=>t.id).includes(item.id))}
        updateCurrentList={(e)=>setCurrentUserEstablecimientos([...currentUserEstablecimientos,e])}
        />
        }
        <div className="">

        <div className="px-2 h-screen xl:pt-0">

        <div className="grid xl:grid-cols-8 h-full gap-2">
            <div className=" col-span-3 bg-white  rounded-lg shadow-lg p-2 overflow-auto relative">
                <div className="flex justify-between items-center border-b-2 pb-2">
                <span className="headline">Usuarios</span>

                <div className="flex items-center space-x-2">
                <button className="button w-min " disabled={loadingUsers} onClick={()=>getUsersEmpresa()}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z" clipRule="evenodd" />
                                </svg>
                </button>

              
                <button onClick={()=>setOpenDialogCreateUser(true)}
                className="button flex space-x-2">
                    <span>Agregar usuario</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} 
                    stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
            </svg>
                    </button>
            
                </div>
                </div>
            
                <Loading
              loading={loadingUsers}
              className='pt-2 flex w-full justify-center'
              />
                {users.map((item,idx)=>{
                    return(
                        <div onClick={()=>selectUser(item)} className={`hover:bg-gray-200 p-2 flex justify-between cursor-pointer items-center
                        ${item.user_id == currentUser?.user_id && "bg-gray-200"}`} key={idx}>
                            <div className="grid">
                            <span className="subtitle">{item.username}</span>
                            <span className="text-xs">{item.email}</span>
                            </div>
                            {item.rol == UserRol.ADMIN_USER_ROL ?
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                            className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
                            :
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                            </svg>
                        }
                        </div>
                    )
                })}
            
            
            </div>
            <div className="col-start-4 col-span-full bg-white  rounded-lg shadow-lg p-2 relative">
                {/* {loading && <Loader className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"/> } */}

                    {currentUser != null &&
                    <div>

                    <div className="grid w-full">

                <div className="flex justify-between items-center px-2 border-b-[1px] pb-2 w-full">
                    <div className="grid">
                        <span className="font-medium text-lg w-10/12 truncate">{currentUser.username}</span>
                        <span className="text-xs">{currentUser.email}</span>
                        {currentUser.estado == UserEstado.DISABLED &&
                        <div className="flex space-x-2 text-red-600 items-end">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                            className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                            </svg>
                        <span className="text-xs font-medium">Acceso del usuario deshabilitado.</span>
                        </div>
                        }
                        {currentUser.last_login != null &&
                        <div className=" flex justify-between items-center space-x-4">
                            <span className="text-xs font-medium">Ultimo inicio de session</span>
                            <span className="text-xs font-semibold">{moment(currentUser.last_login).utc().format('lll')}</span>
                        </div>
                        }

                        </div>


                    <MenuLayout>
                    {/* {(openUserOptionDialog && currentUser != null) && */}
                    <UserOptionDialog
                    // open={openUserOptionDialog}
                    // close={()=>setOpenUserOptionDialog(false)}
                    selectUserEstado={(e)=>selectUserEstado(e)}
                    user={currentUser}
                    />
                    {/* } */}
                    </MenuLayout>

                    {/* <MenuOption
                    openMenu={()=>setOpenUserOptionDialog(true)}
                    /> */}


                </div>                    
                    </div>
                    

                <div className="title p-2 mt-4 flex justify-between">
                    <span className="subtitle text-base">Complejos asignados</span>

                    {(currentUser != undefined && currentUser.rol == UserRol.CLIENT_USER_ROL)&&
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" 
                    className="w-7 h-7 icon-button noSelect" onClick={()=>getAllEstablecientos()}>
                    <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm.75-10.25v2.5h2.5a.75.75 0 0 1 0 1.5h-2.5v2.5a.75.75 0 0 1-1.5 0v-2.5h-2.5a.75.75 0 0 1 0-1.5h2.5v-2.5a.75.75 0 0 1 1.5 0Z" clipRule="evenodd" />
                    </svg>
                    }

                </div>
                <div className="mt-2">
                <Loading
              loading={loadingEstablecimientos}
              className='pt-2 flex w-full justify-center'
              />
                {currentUserEstablecimientos.map((item)=>{
                    return(
                        <div className="flex items-center p-2 text-gray-600 justify-between cursor-default 
                         border-b" key={item.id}>
                            <span className=" subtitle">{item.name}</span>

                    {(currentUser != undefined && currentUser.rol == UserRol.CLIENT_USER_ROL)&&
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" 
                            className="w-7 h-7 icon-button noSelect" onClick={()=>setUserEstablecimiento(item)}>
                            <path fillRule="evenodd" d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711Z" clipRule="evenodd" />
                            </svg>
                    }

                        </div>
                    )
                })}
                    </div>
                </div>
                }

            </div>
        </div>

        </div>

        </div>
        
        {(openConfirmationDialog&& currentUser != null) &&
        <ConfirmationDialog
        open={openConfirmationDialog}
        description={`${getMessage(currentUserEstado,currentUser)}`}
        close={()=>setOpenConfirmationDialog(false)}
        performAction={()=>{
            if(currentUserEstado != null){
                changeUserEstado(currentUserEstado)
            }
            setOpenConfirmationDialog(false)
        }}
        />
        }
    </>
    )
}