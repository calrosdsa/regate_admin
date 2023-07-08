// import './globals.css'
// import '../globals.css'
import { Inter } from 'next/font/google'
// import SideBarEstablecimiento from '@/components/util/sidebar/SidebarEstablecimiento'
import SideBar from '@/components/util/sidebar/Sidebar'

const inter = Inter({ subsets: ['latin'] })


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
    <SideBar/>
         <div className='p-2 w-full'>
         {children}
         </div>
    </div>
  )
}
