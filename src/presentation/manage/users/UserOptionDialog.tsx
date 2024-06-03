import ConfirmationDialog from "@/presentation/util/dialog/ConfirmationDialog"
import DialogLayout from "@/presentation/util/dialog/DialogLayout"
import { UserEstado } from "@/core/type/enums"
import { Menu } from "@headlessui/react"
import { ListItemText, MenuItem } from "@mui/material"
import { useState } from 'react'


const UserOptionDialog = ({selectUserEstado,user,anchorEl,setAnchorEl}:{
    user:User
    selectUserEstado:(estado:UserEstado)=>void
    anchorEl:null | HTMLElement
    setAnchorEl:(e:null | HTMLElement)=>void
}) =>{
   
    return(
        <>
              <MenuItem 
              disabled={user.estado == UserEstado.ENABLED}
              onClick={()=>{
                  setAnchorEl(null)
                  selectUserEstado(UserEstado.ENABLED)
                  }} >                  
              {/* <ListItemIcon>
              <EditIcon/>
          </ListItemIcon> */}
                <ListItemText> Habilitar usuario</ListItemText>
              </MenuItem>

              <MenuItem 
              disabled={user.estado == UserEstado.DISABLED}
              onClick={()=>{
                  setAnchorEl(null)
                  selectUserEstado(UserEstado.DISABLED)
                  }} >                  
                <ListItemText>Deshabilitar usuario</ListItemText>
              </MenuItem>

              <MenuItem 
              disabled={user.estado == UserEstado.DELETED}
              onClick={()=>{
                  setAnchorEl(null)
                  selectUserEstado(UserEstado.DELETED)
                  }} >                  
                <ListItemText>Eliminar usuario</ListItemText>
              </MenuItem>

            {/* <Menu.Item>
                {({ active }) => (
                  <button
                  disabled={user.estado == UserEstado.ENABLED}
                  onClick={()=>selectUserEstado(UserEstado.ENABLED)}
                  className={`${active ? 'bg-primary text-white' : 'text-gray-900'} 
                   group whitespace-nowrap flex w-full items-center rounded-md px-2 py-2 text-sm
                  ${user.estado == UserEstado.ENABLED && "disabled"}`}
                  >
                    Habilitar usuario
                  </button>
                )}
              </Menu.Item> */}
              {/* <Menu.Item>
                {({ active }) => (
                  <button disabled={user.estado == UserEstado.DISABLED}
                  onClick={()=>selectUserEstado(UserEstado.DISABLED)}
                 className={`
                 ${active ? 'bg-primary text-white' : 'text-gray-900'}
                  group whitespace-nowrap flex w-full items-center rounded-md px-2 py-2 text-sm
                 ${user.estado == UserEstado.DISABLED && "disabled"} `}
                  >
                   Deshabilitar usuario
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                  disabled={user.estado == UserEstado.DELETED}
                  onClick={()=>selectUserEstado(UserEstado.DELETED)}
                  className={`${active ? 'bg-primary text-white' : 'text-gray-900'}
                   group whitespace-nowrap flex w-full items-center rounded-md px-2 py-2 text-sm
                  ${active ? 'bg-primary text-white' : 'text-gray-900'} `}
                  >
                     Eliminar usuario
                  </button>
                )}
              </Menu.Item> */}
        </>
    )
}

export default UserOptionDialog;