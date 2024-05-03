"use client"

import { Inter } from 'next/font/google'
import SideBarEstablecimiento from '@/components/util/sidebar/SidebarEstablecimiento'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAppDispatch, useAppSelector } from '@/context/reduxHooks';
import LoaderDialog from '@/components/util/loaders/LoaderDialog';
import MobileSidebar from '@/components/util/sidebar/MobileSidebar';
import uiSlice, { uiActions } from '@/context/slices/uiSlice';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getEstablecimientosUser, getUser } from '@/context/actions/account-actions';
import { Dialog, Transition } from '@headlessui/react';
import InfoBar from '@/components/util/info-bar/InfoBar';
import { systemActions } from '@/context/slices/systemSlice';
import { chatActions } from '@/context/slices/chatSlice';
import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';



export default function RootLayout({
  children,params
}: {
  children: React.ReactNode
  params:{uuid:string}
}) {
  const loaderDialog = useAppSelector(state=>state.ui.loaderDialog)
  const pathName = usePathname()
  const dispatch = useAppDispatch()
  const uiState = useAppSelector(state=>state.ui)
  const systemState = useAppSelector(state=>state.system)
  const clearState = () =>{
    dispatch(chatActions.setChat(undefined))
 }
    useEffect(()=>{
        dispatch(getEstablecimientosUser(params.uuid))
    },[])
  useEffect(()=>{
    dispatch(uiActions.openSidebar(false))
    dispatch(getUser())
    clearState()
  },[pathName])
  return (
    <>
      <ToastContainer 
    position='bottom-center'
    />
        {/* <SideBar/> */}
      <LoaderDialog open={loaderDialog}/>
    <div className='flex max-w-[1750px] mx-auto'>

    <div className=' hidden xl:block'>
    <SideBarEstablecimiento/>
      </div>

      <div className='xl:hidden'>
        <MobileSidebar
        open={uiState.openSidebar}
        setOpen={()=>dispatch(uiActions.openSidebar(false))}
        >
        <SideBarEstablecimiento/>
        </MobileSidebar>
      </div>

         <div className='w-full overflow-auto  xl:pt-0 h-screen'>
          <div className=' border-b-[0.2px] border-gray-400 p-1 xl:hidden flex justify-between'>  
          <IconButton  className=""  onClick={()=>dispatch(uiActions.openSidebar(true))}>
            <MenuIcon/>
          </IconButton>      
         
        

          </div>

         {children}
        
         <InfoBar
         open={systemState.openInfoBar}
         close={()=>dispatch(systemActions.setOpenInfoBar(false))}
         infoText={systemState.infoText}
         loading={systemState.loadingInfoText}
         />
      
          {/* } */}

         </div>

    </div>
    </>
  )
}
