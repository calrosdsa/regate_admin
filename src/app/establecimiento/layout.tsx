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
import { getUser } from '@/context/actions/account-actions';
import { Dialog, Transition } from '@headlessui/react';
import InfoBar from '@/components/util/info-bar/InfoBar';
import { systemActions } from '@/context/slices/systemSlice';
import { chatActions } from '@/context/slices/chatSlice';



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const loaderDialog = useAppSelector(state=>state.ui.loaderDialog)
  const pathName = usePathname()
  const dispatch = useAppDispatch()
  const uiState = useAppSelector(state=>state.ui)
  const systemState = useAppSelector(state=>state.system)
  const clearState = () =>{
    console.log("CLEAR STATE")
    dispatch(chatActions.setChat(undefined))
 }
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
          <button type="button" className="" onClick={()=>dispatch(uiActions.openSidebar(true))}>
            <span className="sr-only">Open sidebar</span>
            <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
            </svg>
          </button>

          {/* <div className={``}>
         <svg onClick={()=>setOpenInfoBar(!openInfoBar)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
      </svg>
         </div> */}

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
