"use client"
// import './globals.css'
// import '../globals.css'
import { Inter } from 'next/font/google'
// import SideBarEstablecimiento from '@/components/util/sidebar/SidebarEstablecimiento'
import SideBar from '@/components/util/sidebar/Sidebar'
import MobileSidebar from '@/components/util/sidebar/MobileSidebar'
import { useAppDispatch, useAppSelector } from '@/context/reduxHooks'
import { uiActions } from '@/context/slices/uiSlice'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { getUser } from '@/context/actions/account-actions'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import LoaderDialog from '@/components/util/loaders/LoaderDialog'
import ButtonIcon from '@/components/util/button/ButtonIcon'

// const inter = Inter({ subsets: ['latin'] })


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const dispatch = useAppDispatch()
  const uiState = useAppSelector(state=>state.ui)
  const pathName = usePathname()

  useEffect(()=>{
    dispatch(uiActions.openSidebar(false))
    dispatch(getUser())
  },[pathName])

  return (
    // <html lang="en">
    //   <body className="flex">
    //     <SideBarEstablecimiento/>
    //     <div className='p-2 w-full'>
    //     {children}
    //     </div>
    //     </body>
    // </html>
    <>
    {}
     <ToastContainer
    position='bottom-center'
    />
      <LoaderDialog open={uiState.loaderDialog}/>
    <div className='flex max-w-[1750px] mx-auto'>

      <div className=' hidden xl:block'>
    <SideBar/>
      </div>

      <div className='xl:hidden'>
        <MobileSidebar
        open={uiState.openSidebar}
        setOpen={()=>dispatch(uiActions.openSidebar(false))}
        >
        <SideBar/>
        </MobileSidebar>
      </div>

         <div className='w-full overflow-auto  xl:pt-0 h-screen'>
         <div className=' border-b-[0.2px] border-gray-400 p-1 xl:hidden px-2'>
          <button type="button" className="" onClick={()=>dispatch(uiActions.openSidebar(true))}>
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
