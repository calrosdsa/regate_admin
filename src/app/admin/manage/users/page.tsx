"use client"

import CreateUserNegocioDialog from "@/components/manage/users/CreateUserNegocioDialog"
import Loading from "@/components/util/loaders/Loading"
import { GetUsersEmpresa } from "@/core/repository/manage"
import { UserRol } from "@/core/type/enums"
import { useEffect, useState } from "react"

export default function Page(){
    const [users,setUsers] = useState<User[]>([])
    const [loadingUsers,setLoadingUsers] = useState(false)
    const [currentUser,setCurrentUser] = useState<User | null>(null)
    const [openDialogCreateUser,setOpenDialogCreateUser] = useState(false)

    const getUsersEmpresa = async() => {
        try{
            setLoadingUsers(true)
            const res:User[] = await GetUsersEmpresa()
            setUsers(res)
            if(res.length > 0){
                setCurrentUser(res[0])
            }
            setLoadingUsers(false)
        }catch(err){
            setLoadingUsers(false)
        }
    }

    const selectUser = (user:User) =>{
        setCurrentUser(user)
    }

    useEffect(()=>{
        getUsersEmpresa()
    },[])

    return(
        <>
        {openDialogCreateUser&&
        <CreateUserNegocioDialog
        openModal={openDialogCreateUser}
        closeModal={()=>setOpenDialogCreateUser(false)}
        />
    }
        <div className="">

        <div className="px-2 h-screen pt-10 xl:pt-0">

        <div className="grid xl:grid-cols-7 h-full gap-2">
            <div className=" col-span-2 bg-white  rounded-lg shadow-lg p-2 overflow-auto relative">
                <div className="flex justify-between items-center border-b-2 pb-2">
                <span className="headline">Usuarios</span>
                <button onClick={()=>setOpenDialogCreateUser(true)}
                className="button flex space-x-2">
                    <span>Agregar usuario</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} 
                    stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
            </svg>
                    </button>
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
            <div className="col-start-3 col-span-full bg-white  rounded-lg shadow-lg p-2 relative">
                {/* {loading && <Loader className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"/> } */}

                <div className="flex justify-between items-center px-2">
                    {currentUser != null &&
                    <div className="grid w-full">
                        <span className="font-medium text-lg w-10/12 truncate">{currentUser.username}</span>
                        <span className="text-xs">{currentUser.email}</span>
                    </div>
                }

            
                </div>

            </div>
        </div>

        </div>

        </div>
    </>
    )
}