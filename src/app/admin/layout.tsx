"use client"
// import './globals.css'
// import '../globals.css'
import { Inter } from 'next/font/google'
// import SideBarEstablecimiento from '@/components/util/sidebar/SidebarEstablecimiento'
import SideBar from '@/components/util/sidebar/Sidebar'
import MobileSidebar from '@/components/util/sidebar/MobileSidebar'
import { useAppDispatch, useAppSelector } from '@/context/reduxHooks'
import { uiActions } from '@/context/slices/uiSlice'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { getEstablecimientosUser, getUser } from '@/context/actions/account-actions'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import LoaderDialog from '@/components/util/loaders/LoaderDialog'
import ButtonIcon from '@/components/util/button/ButtonIcon'
import { ValidateUser } from '@/core/repository/account'
import { rootEstablecimiento } from '@/core/util/routes'
import { Http } from '@/core/type/enums'
import { IconButton } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';
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
        router.push('../auth/login')  
      }
  }
  useEffect(()=>{
    validateUser()
    dispatch(uiActions.openSidebar(false))
    dispatch(getUser())
    dispatch(getEstablecimientosUser())
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
