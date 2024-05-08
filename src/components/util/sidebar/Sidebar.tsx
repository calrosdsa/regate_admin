"use client"
import { useAppDispatch, useAppSelector } from "@/context/reduxHooks";
import { Disclosure } from "@headlessui/react";
import Link from "next/link";
import UserSideBar from "./UserSidebar";
import { usePathname, useRouter } from "next/navigation";
import { adminRoutes } from "@/core/util/routes";
import {Box, Collapse, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper} from "@mui/material";
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { useState } from "react";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import { useTheme } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { uiActions } from "@/context/slices/uiSlice";
//  import { useRouter } from "next/router";


const SideBar = () =>{
   const dispatch = useAppDispatch()
   const user = useAppSelector(state => state.account.user)
   const pathname = usePathname()
   const [open, setOpen] = useState(true);
   const router = useRouter()
   const theme = useTheme();
   const handleClick = () => {
     setOpen(!open);
   };
 
    // const router = useRouter()

    return(
      


      <Paper
      elevation={2}
      sx={{
         width: '100%',
         p: 1,
         height:"100vh",
         minWidth:250,
         overflow:"auto",
         zIndex:40,
         position:"relative"
       }}
      >

            <div className="absolute bottom-3 right-3">
               <IconButton onClick={()=>{
                  if(theme.palette.mode === 'dark'){
                     dispatch(uiActions.setMode("light"))
                  }else{
                     dispatch(uiActions.setMode("dark"))
                  }
               }}>
               {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
               </IconButton>
            </div>

         {user != null &&
         <UserSideBar
         user={user}
         />
         }


         {/* <li>
         <Link href={adminRoutes.dashboad.main} className={`${pathname == adminRoutes.dashboad.main && "bg-gray-200 dark:bg-gray-700"}
                     flex items-center w-full p-2 text-gray-900 transition duration-75 group hover:bg-gray-200 dark:text-white
                      dark:hover:bg-gray-700`}>
               <svg aria-hidden="true" 
                className={`w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white
                ${pathname == adminRoutes.dashboad.main && " dark:text-white"}`}
                fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path></svg>
               <span className="ml-3">Dashboard</span>
               </Link>
            </li> */}
      <List>


         <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          <SettingsApplicationsIcon />
        </ListItemIcon>
        <ListItemText primary="Administrar" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
         <Collapse in={open} timeout="auto" unmountOnExit>
         <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }} 
            onClick={()=>router.push(adminRoutes.manage.users)}
            selected={pathname == adminRoutes.manage.users}>
               <ListItemText primary="Usuarios" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={()=>router.push(adminRoutes.manage.establecimientos)}
            selected={pathname == adminRoutes.manage.establecimientos}>
               <ListItemText primary="Establecimientos" />
            </ListItemButton>
         </List>
         </Collapse>

         {/* <li>
            <Link href={adminRoutes.depositos} className={`${pathname == adminRoutes.depositos && "bg-gray-200 dark:bg-gray-700"}
                     flex items-center w-full p-2 text-gray-900 transition duration-75 group hover:bg-gray-200 dark:text-white
                      dark:hover:bg-gray-700`}>
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" 
               className={`w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white
               ${pathname == adminRoutes.depositos && " dark:text-white"}`}>
               <path d="M4.5 3.75a3 3 0 00-3 3v.75h21v-.75a3 3 0 00-3-3h-15z" />
               <path fillRule="evenodd" d="M22.5 9.75h-21v7.5a3 3 0 003 3h15a3 3 0 003-3v-7.5zm-18 3.75a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" clipRule="evenodd" />
               </svg>
               <span className="ml-3">Depósitos</span>
            </Link>
         </li> */}

            <ListItemButton 
            onClick={()=>router.push(adminRoutes.entidad.main)}
            selected={pathname == adminRoutes.entidad.main}
            >
		    <ListItemIcon>
			    <AccountBalanceIcon />
              </ListItemIcon>
              <ListItemText primary="Entidad"/>
            </ListItemButton>

         
	 </List>

       


        
         {/* <li>
            <Link href="admin/establecimientos" className="flex items-center p-2 text-gray-900  dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700">
               <svg aria-hidden="true" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
               <span className="flex-1 ml-3 whitespace-nowrap">Establecimientos</span>
            </Link>
         </li> */}
         {/* <li>
            <a href="#" className="flex items-center p-2 text-gray-900  dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700">
               <svg aria-hidden="true" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z"></path><path d="M3 5a2 2 0 012-2h1a1 1 0 010 2H5v7h2l1 2h4l1-2h2V5h-1a1 1 0 110-2h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"></path></svg>
               <span className="flex-1 ml-3 whitespace-nowrap">Inbox</span>
               <span className="inline-flex items-center justify-center w-3 h-3 p-3 ml-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">3</span>
            </a>
         </li>
         <li>
            <a href="#" className="flex items-center p-2 text-gray-900  dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700">
               <svg aria-hidden="true" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
               <span className="flex-1 ml-3 whitespace-nowrap">Users</span>
            </a>
         </li>
         <li>
            <a href="#" className="flex items-center p-2 text-gray-900  dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700">
               <svg aria-hidden="true" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"></path></svg>
               <span className="flex-1 ml-3 whitespace-nowrap">Products</span>
            </a>
         </li>
         <li>
            <a href="#" className="flex items-center p-2 text-gray-900  dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700">
               <svg aria-hidden="true" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"></path></svg>
               <span className="flex-1 ml-3 whitespace-nowrap">Sign In</span>
            </a>
         </li>
         <li>
            <a href="#" className="flex items-center p-2 text-gray-900  dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700">
               <svg aria-hidden="true" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd"></path></svg>
               <span className="flex-1 ml-3 whitespace-nowrap">Sign Up</span>
            </a>
         </li> */}
      </Paper>


    )
}

export default SideBar;
