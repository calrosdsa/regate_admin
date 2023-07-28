"use client"

import { Inter } from 'next/font/google'
import SideBarEstablecimiento from '@/components/util/sidebar/SidebarEstablecimiento'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAppSelector } from '@/context/reduxHooks';
import LoaderDialog from '@/components/util/loaders/LoaderDialog';



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const loaderDialog = useAppSelector(state=>state.ui.loaderDialog)
  return (
    <>
      <ToastContainer 
    position='bottom-center'
    />
        {/* <SideBar/> */}
      <LoaderDialog open={loaderDialog}/>
    <div className='flex'>
    <SideBarEstablecimiento/>
         <div className=' w-full h-screen overflow-auto  '>
    
         {children}
         </div>
    </div>
    </>
  )
}
