import { logout } from "@/context/actions/account-actions";
import { useAppDispatch } from "@/context/reduxHooks";
import { Button, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LogoutIcon from '@mui/icons-material/Logout';
import CommonImage from "../image/CommonImage";
import { LOCAL_URL } from "@/context/config";

const UserSideBar = ({user}:{
    user:User
}) =>{
    const dispatch = useAppDispatch()
    const router = useRouter()

    return (
        <div
         className="grid gap-y-2">
            {/* <div onClick={()=>router.push("../../account")}  className="px-2 py-1 border-b-[1px]
                flex items-center space-x-3 h-12  cursor-pointer">
                <img src="/images/user-icon-placeholder.webp" alt="" className="rounded-full h-7 w-7"/>
                <div className="grid">
                <span className="text-sm font-medium truncate">{user?.username}</span>
                <span className="text-xs truncate">{user?.email}</span>
                </div>
            </div> */}
            <List >

            <ListItemButton
            onClick={()=>router.push("../../account")}
            divider>
                <ListItemIcon>
                    <CommonImage
                    src="/images/user-icon-placeholder.webp"
                    className="rounded-full h-7 w-7"

                    />
                </ListItemIcon>
                <ListItemText primary={user?.username}
                secondary={user?.email}/>
            </ListItemButton>    


            <ListItemButton  onClick={()=>dispatch(logout())}>
                <ListItemIcon>
                    <LogoutIcon/>
                </ListItemIcon>
                <ListItemText primary="Cerrar session"/>
            </ListItemButton>
            </List>
            {/* <div onClick={()=>{}} 
                className={`w-10/12  cursor-pointer justify-center mx-auto 
                flex space-x-2 py-1 border-[1px] border-gray-300 items-center bg-white dark:bg-gray-800 hover:bg-gray-200 
    active:ring-blue-300 active:ring-2 px-3 dark:hover:bg-gray-700 dark:text-white
                `}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg> 

            <span className='text-sm' onClick={()=>dispatch(logout())}>Cerrar session</span>
        </div> */}
        </div>
    )
}

export default UserSideBar;