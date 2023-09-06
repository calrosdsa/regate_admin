"use client"

import { Inter } from 'next/font/google'
import SideBarEstablecimiento from '@/components/util/sidebar/SidebarEstablecimiento'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAppDispatch, useAppSelector } from '@/context/reduxHooks';
import LoaderDialog from '@/components/util/loaders/LoaderDialog';
import MobileSidebar from '@/components/util/sidebar/MobileSidebar';
import { uiActions } from '@/context/slices/uiSlice';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const loaderDialog = useAppSelector(state=>state.ui.loaderDialog)
  const pathName = usePathname()
  const dispatch = useAppDispatch()
  const uiState = useAppSelector(state=>state.ui)
  useEffect(()=>{
    dispatch(uiActions.openSidebar(false))
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
        children={<SideBarEstablecimiento/>}
        />
      </div>

         <div className=' xl:pt-0 w-full overflow-auto '>
          <div className='xl:hidden'>
          <button type="button" className="absolute top-2 left-2 " onClick={()=>dispatch(uiActions.openSidebar(true))}>
            <span className="sr-only">Open sidebar</span>
            <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
            </svg>
          </button>
          </div>
         {children}
         </div>

    </div>
    </>
  )
}
