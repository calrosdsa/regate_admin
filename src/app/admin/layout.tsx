"use client"
// import './globals.css'
// import '../globals.css'
import { Inter } from 'next/font/google'
// import SideBarEstablecimiento from '@/components/util/sidebar/SidebarEstablecimiento'
import SideBar from '@/presentation/util/sidebar/Sidebar'
import MobileSidebar from '@/presentation/util/sidebar/MobileSidebar'
import { useAppDispatch, useAppSelector } from '@/context/reduxHooks'
import { uiActions } from '@/context/slices/uiSlice'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import ButtonIcon from '@/presentation/util/button/ButtonIcon'
import { ValidateUser } from '@/core/repository/account'
import { rootEstablecimiento } from '@/core/util/routes'
import { Http } from '@/core/type/enums'
import { IconButton } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';
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
  const router = useRouter()

  const validateUser = async() =>{
      const res = await ValidateUser()
      if(res.status == Http.StatusUnauthorized){
        window.location.replace('/auth/login')  
      }
  }
  useEffect(()=>{
    dispatch(uiActions.openSidebar(false))
  },[pathName])
  
  useEffect(()=>{
    validateUser()
    dispatch(getUser())
  },[])
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
          <IconButton  className="" onClick={()=>dispatch(uiActions.openSidebar(true))}>
            <MenuIcon/>
          </IconButton>
          </div>
          
         {children}
         </div>

    </div>
    </>
  )
}
