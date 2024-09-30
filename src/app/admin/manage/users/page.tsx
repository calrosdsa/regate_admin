"use client"

import AddEstablecimientoUserDialog from "@/presentation/manage/users/dialog/AddEstablecimientoUser"
import CreateUserNegocioDialog from "@/presentation/manage/users/dialog/CreateUserNegocioDialog"
import UserOptionDialog from "@/presentation/manage/users/UserOptionDialog"
import MenuLayout from "@/presentation/util/button/MenuLayout"
import MenuOption from "@/presentation/util/button/MenuOption"
import ConfirmationDialog from "@/presentation/util/dialog/ConfirmationDialog"
import Loading from "@/presentation/util/loaders/Loading"
import { successfulMessage, unexpectedError } from "@/context/config"
import { useAppDispatch } from "@/context/reduxHooks"
import { uiActions } from "@/context/slices/uiSlice"
import { DeleteEstablecimientoUser, GetUsersEmpresa, UpdateUserEstado } from "@/core/repository/manage"
import { UserEstado, UserRol } from "@/data/model/types/enums"
import { appendSerachParams } from "@/core/util/routes"
import { Button, Divider, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Typography } from "@mui/material"
import moment from "moment"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { accountRepository } from "@/data/repository"
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
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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
            const res:EstablecimientoUser[] = await accountRepository.GetEstablecimientosUserByUuid(JSON.stringify(dataRequest))
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
            const res:EstablecimientoUser[] = await accountRepository.GetEstablecimientosUserByUuid(JSON.stringify(dataRequest))
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
            setUserEstablecimiento(null)
            await DeleteEstablecimientoUser(userEstablecimiento.uuid,userEstablecimiento.admin_id)
            dispatch(uiActions.setLoaderDialog(false))
            toast.success(successfulMessage)
            const f = currentUserEstablecimientos.filter(item=>item.uuid != userEstablecimiento.uuid)
            setCurrentUserEstablecimientos(f)
        }catch(err){
            toast.error(unexpectedError)
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

        <div className=" h-screen xl:pt-0">

        <div className="grid xl:grid-cols-8 h-full w-full p-2 gap-x-2 gap-y-2">

            <Paper elevation={2} className=" col-span-3 rounded-xl p-2  overflow-auto relative  w-full">
                <div className="flex justify-between items-center  pb-2">
                <span className="headline">Usuarios</span>

                <div className="flex items-center space-x-2">
                <Button  disabled={loadingUsers} onClick={()=>getUsersEmpresa()} variant="contained">
                     <RefreshIcon/>  
                </Button>

              
                <Button onClick={()=>setOpenDialogCreateUser(true)}
                variant="contained" >
                    <Typography variant="button" sx={{
                        mr:1,display:{xs:"none",sm:"block"},
                        }}>Agregar Usuario</Typography>
                    <PersonAddIcon/>
                    </Button>
            
                </div>
                </div>
                <Divider/>
            
                <Loading
              loading={loadingUsers}
              className='pt-2'
              />
              <List sx={{ width: '100%'}}>
                {users.map((item,idx)=>{
                    return(
                        <ListItem key={idx} disablePadding>
                        <ListItemButton 
                        divider={true}
                        selected={item.user_id == currentUser?.user_id}
                        onClick={()=>selectUser(item)} 
                        >
                        <ListItemText
                            primary={item.username}
                            secondary={item.email}
                            />
                            <ListItemIcon>
                            {
                               item.rol == UserRol.ADMIN_USER_ROL ?
                                <VerifiedUserIcon/>
                                :
                                <PersonIcon/>
                               
                           }
                           </ListItemIcon>
                        </ListItemButton>
                            </ListItem>
                       
                    )
                })}
                
                </List>
            </Paper>
            
            <Paper elevation={2} className="col-start-4 col-span-full shadow-md  rounded-lg  p-2 relative">
                {/* {loading && <Loader className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"/> } */}

                    {currentUser != null &&
                    <div className="">

                    <div className="grid w-full">

                <div className="flex justify-between items-center px-2 pb-2 w-full">
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


                    <MenuLayout 
                    anchorEl={anchorEl}
                    setAnchorEl={(e)=>setAnchorEl(e)}>
                    {/* {(openUserOptionDialog && currentUser != null) && */}
                    <UserOptionDialog
                    // open={openUserOptionDialog}
                    // close={()=>setOpenUserOptionDialog(false)}
                    selectUserEstado={(e)=>selectUserEstado(e)}
                    user={currentUser}
                    anchorEl={anchorEl}
                    setAnchorEl={(e)=>setAnchorEl(e)}
                    />
                    {/* } */}
                    </MenuLayout>

                    {/* <MenuOption
                    openMenu={()=>setOpenUserOptionDialog(true)}
                    /> */}


                </div> 

                <Divider/>

                    </div>
                    

                <div className="title p-2 mt-4 flex justify-between">
                    <Typography variant="h6">Complejos asignados</Typography>

                    {(currentUser != undefined && currentUser.rol == UserRol.CLIENT_USER_ROL)&&
                    <IconButton onClick={()=>getAllEstablecientos()}>
                        <AddIcon/>
                    </IconButton>
                    }

                </div>
                <div className="mt-2">
                <Loading
              loading={loadingEstablecimientos}
              className='pt-2 flex w-full justify-center'
              />
              <List sx={{ width: '100%' }}>

                {currentUserEstablecimientos.map((item)=>{
                    return(
                         <ListItem key={item.id}
                         divider
                         secondaryAction={
                            (currentUser != undefined && currentUser.rol == UserRol.CLIENT_USER_ROL)&&
                            <IconButton onClick={()=>setUserEstablecimiento(item)}>
                                <DeleteIcon/>
                            </IconButton>
                         }>
                            <ListItemText
                             primary={item.name}
                             />
                             
                         </ListItem>
                       
                    )
                })}
                    </List>
                    </div>
                </div>
                }

            </Paper>

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