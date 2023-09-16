import ConfirmationDialog from "@/components/util/dialog/ConfirmationDialog"
import DialogLayout from "@/components/util/dialog/DialogLayout"
import { UserEstado } from "@/core/type/enums"
import { Menu } from "@headlessui/react"
import { useState } from 'react'


const UserOptionDialog = ({selectUserEstado,user}:{
    user:User
    selectUserEstado:(estado:UserEstado)=>void
}) =>{
   
    return(
        <>
            <Menu.Item>
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
              </Menu.Item>
              <Menu.Item>
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
              </Menu.Item>
        </>
    )
}

export default UserOptionDialog;