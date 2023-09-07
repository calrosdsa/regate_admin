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
    <div className='flex'>

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

         <div className='px-2 w-full overflow-auto pt-14 xl:pt-0'>
          <div className='xl:hidden'>
          <button type="button" className="absolute top-2 left-2" onClick={()=>dispatch(uiActions.openSidebar(true))}>
            <span className="sr-only">Open sidebar</span>
            <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
            </svg>
          </button>
          </div>
          
         {children}
         </div>

    </div>
  )
}
