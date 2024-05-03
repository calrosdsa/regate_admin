"use client"
import { useAppDispatch, useAppSelector } from "@/context/reduxHooks";
import { Disclosure } from "@headlessui/react";
import Link from "next/link";
 import { useParams, usePathname, useSearchParams,  } from "next/navigation";
import { useEffect, useState } from "react";
import UserSideBar from "./UserSidebar";
import { useRouter } from "next/navigation";
import { UserRol } from "@/core/type/enums";
import { GetMessagesCount } from "@/core/repository/chat";
import { chatActions } from "@/context/slices/chatSlice";


const SideBarEstablecimiento = () =>{
   const dispatch = useAppDispatch()
   const establecimientos = useAppSelector(state=>state.account.establecimientos)
   const countMessage = useAppSelector(state=>state.chat.messages_count)
   const user = useAppSelector(state => state.account.user)
   const pathname = usePathname()
   const params = useParams()
   const router = useRouter()
   const root = `/establecimiento/${params.uuid}`

   
   // const searchParams = useSearchParams()
   // const current = new URLSearchParams(Array.from(searchParams.entries()))

   const getCoutConversationMessage = async() => {
      try{
         const res = await GetMessagesCount(params.uuid as string)
         dispatch(chatActions.updateGlobalMessageCount(res))
      }catch(err){
      }
   }

   useEffect(()=>{
      // getCoutConversationMessage() 
   },[])

    return(
        <div className="shadow-xl">

<aside className="z-40 w-64 h-screen">

   <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800 relative">
   

      <ul className="space-y-2 font-medium">
      {user != null &&
      <UserSideBar
      user={user}
      />
      }
         
      <div className="text-gray-900  dark:text-white border-b-[1px] py-2">
         <select name="" id="" className="w-full bg-gray-50 dark:bg-gray-800 outline-none" 
         value={params.uuid}
         onChange={(e)=>{
            router.push(`/establecimiento/${e.target.value}`)
            }}>
            {establecimientos.map((item,idx)=>{
               return(
                  <option  key={idx} value={item.uuid} >
                     {item.name}
                  </option>
               )
            })}
         </select>
      </div>

         <li>
            <Link href={`${root}`} className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700
            ${pathname == `${root}` && "bg-gray-200 dark:bg-gray-700"}`}>
               <svg aria-hidden="true" className="w-6 h-6 text-gray-500  dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path></svg>
               <span className="ml-3">Dashboard</span>
            </Link>
         </li>

         <li>
            <Link href={`${root}/config`} className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700
            ${pathname == `${root}/config` && "bg-gray-200 dark:bg-gray-700"}`}>
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" 
               className="w-6 h-6 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
               <path fillRule="evenodd" d="M4.5 2.25a.75.75 0 000 1.5v16.5h-.75a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5h-.75V3.75a.75.75 0 000-1.5h-15zM9 6a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5H9zm-.75 3.75A.75.75 0 019 9h1.5a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zM9 12a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5H9zm3.75-5.25A.75.75 0 0113.5 6H15a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM13.5 9a.75.75 0 000 1.5H15A.75.75 0 0015 9h-1.5zm-.75 3.75a.75.75 0 01.75-.75H15a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM9 19.5v-2.25a.75.75 0 01.75-.75h4.5a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75h-4.5A.75.75 0 019 19.5z" clipRule="evenodd" />
               </svg>
               <span className="flex-1 ml-3 whitespace-nowrap">Establecimiento</span>
            </Link>
         </li>
         <li>
            <Link href={`${root}/instalaciones`} className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700
            ${pathname == `${root}/instalaciones` && "bg-gray-200 dark:bg-gray-700"}`}>
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" 
               className="w-6 h-6 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
               <path d="M5.223 2.25c-.497 0-.974.198-1.325.55l-1.3 1.298A3.75 3.75 0 007.5 9.75c.627.47 1.406.75 2.25.75.844 0 1.624-.28 2.25-.75.626.47 1.406.75 2.25.75.844 0 1.623-.28 2.25-.75a3.75 3.75 0 004.902-5.652l-1.3-1.299a1.875 1.875 0 00-1.325-.549H5.223z" />
               <path fillRule="evenodd" d="M3 20.25v-8.755c1.42.674 3.08.673 4.5 0A5.234 5.234 0 009.75 12c.804 0 1.568-.182 2.25-.506a5.234 5.234 0 002.25.506c.804 0 1.567-.182 2.25-.506 1.42.674 3.08.675 4.5.001v8.755h.75a.75.75 0 010 1.5H2.25a.75.75 0 010-1.5H3zm3-6a.75.75 0 01.75-.75h3a.75.75 0 01.75.75v3a.75.75 0 01-.75.75h-3a.75.75 0 01-.75-.75v-3zm8.25-.75a.75.75 0 00-.75.75v5.25c0 .414.336.75.75.75h3a.75.75 0 00.75-.75v-5.25a.75.75 0 00-.75-.75h-3z" clipRule="evenodd" />
               </svg>
               <span className="flex-1 ml-3 whitespace-nowrap">Canchas</span>
            </Link>
         </li>
         {/* <li>
            <Link href={`${root}/conversations`} className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700
            ${pathname == `${root}/conversations` && "bg-gray-200 dark:bg-gray-700"}`}>
               <svg aria-hidden="true" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z"></path><path d="M3 5a2 2 0 012-2h1a1 1 0 010 2H5v7h2l1 2h4l1-2h2V5h-1a1 1 0 110-2h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"></path></svg>
               <span className="flex-1 ml-3 whitespace-nowrap">Inbox</span>
               {countMessage > 0 &&
               <span className="inline-flex items-center justify-center w-3 h-3 p-3 ml-3 
               text-sm font-medium text-white bg-primary rounded-full 
               ">{countMessage}</span>
               }
            </Link>
         </li> */}

            {/* <li>
               <Link href={`${root}/users`} className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700
               ${pathname == `${root}/salas` && "bg-gray-200 dark:bg-gray-700"}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                  className="flex-shrink-0 w-6 h-6 text-gray-500  dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                  <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
                  </svg>
   
                  <span className="flex-1 ml-3 whitespace-nowrap">Users</span>
               </Link>
            </li> */}

         <li>
            <Link href={`${root}/reservas`} className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700
            ${pathname == `${root}/reservas` && "bg-gray-200 dark:bg-gray-700"}`}>
               <svg aria-hidden="true" className="flex-shrink-0 w-6 h-6 text-gray-500  dark:text-gray-400 group-hover:text-gray-900
                dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"></path></svg>
               <span className="flex-1 ml-3 whitespace-nowrap">Info Reservas</span>
            </Link>
         </li>

         
         <li>
            <Link href={`${root}/eventos`} className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700
            ${pathname == `${root}/eventos` && "bg-gray-200 dark:bg-gray-700"}`}>
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="flex-shrink-0 w-6 h-6 text-gray-500 
                dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
               <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd" />
               </svg>
               <span className="flex-1 ml-3 whitespace-nowrap">Eventos</span>
            </Link>
         </li>

         <li>
            <Link href={`${root}/users`} className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700
            ${pathname == `${root}/users` && "bg-gray-200 dark:bg-gray-700"}`}>
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="flex-shrink-0 w-6 h-6 text-gray-500  dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
               <path d="M7 8a3 3 0 100-6 3 3 0 000 6zM14.5 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM1.615 16.428a1.224 1.224 0 01-.569-1.175 6.002 6.002 0 0111.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 017 18a9.953 9.953 0 01-5.385-1.572zM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 00-1.588-3.755 4.502 4.502 0 015.874 2.636.818.818 0 01-.36.98A7.465 7.465 0 0114.5 16z" />
               </svg>
               <span className="flex-1 ml-3 whitespace-nowrap">Users</span>
            </Link>
         </li>

          {/* <li>
            <Link href={`${root}/depositos`} className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700
            ${pathname == `${root}/depositos` && "bg-gray-200 dark:bg-gray-700"}`}>
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" 
               className="flex-shrink-0 w-6 h-6 text-gray-500  dark:text-gray-400 group-hover:text-gray-900
               dark:group-hover:text-white">
               <path d="M4.5 3.75a3 3 0 00-3 3v.75h21v-.75a3 3 0 00-3-3h-15z" />
               <path fillRule="evenodd" d="M22.5 9.75h-21v7.5a3 3 0 003 3h15a3 3 0 003-3v-7.5zm-18 3.75a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" clipRule="evenodd" />
               </svg>
               <span className="flex-1 ml-3 whitespace-nowrap">Depositos</span>
            </Link>
         </li> */}
         

         {/* <li>
            <Link href={`${root}/salas`} className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700
            ${pathname == `${root}/salas` && "bg-gray-200 dark:bg-gray-700"}`}>
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" 
               className="flex-shrink-0 w-6 h-6 text-gray-500  dark:text-gray-400 group-hover:text-gray-900
                dark:group-hover:text-white">
                  <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z" clipRule="evenodd" />
                  <path d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z" />
               </svg>


               <span className="flex-1 ml-3 whitespace-nowrap">Salas</span>
            </Link>
         </li> */}

            
      {user?.rol == UserRol.ADMIN_USER_ROL &&
      <li>

      <Link href={"/admin/manage/establecimientos"} className="flex items-center p-2 text-gray-900 rounded-lg cursor-pointer space-x-3
      dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" 
   className="w-6 h-6 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white 
   ">
  <path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm5.03 4.72a.75.75 0 010 1.06l-1.72 1.72h10.94a.75.75 0 010 1.5H10.81l1.72 1.72a.75.75 0 11-1.06 1.06l-3-3a.75.75 0 010-1.06l3-3a.75.75 0 011.06 0z" clipRule="evenodd" />
</svg>
   <span className="flex-1 ml-3 whitespace-nowrap font-medium">Volver al panel admin</span>
      </Link>
         </li>
   }

         {/* <li>
            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
               <svg aria-hidden="true" className="flex-shrink-0 w-6 h-6 text-gray-500  dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"></path></svg>
               <span className="flex-1 ml-3 whitespace-nowrap">Sign In</span>
            </a>
         </li>
         <li>
            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
               <svg aria-hidden="true" className="flex-shrink-0 w-6 h-6 text-gray-500  dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd"></path></svg>
               <span className="flex-1 ml-3 whitespace-nowrap">Sign Up</span>
            </a>
         </li> */}

      </ul>
   </div>
</aside>

        </div>
    )
}

export default SideBarEstablecimiento;