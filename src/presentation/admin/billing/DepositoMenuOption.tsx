import MenuLayout from "@/presentation/util/button/MenuLayout"
import ConfirmationDialog from "@/presentation/util/dialog/ConfirmationDialog"
import DialogLayout from "@/presentation/util/dialog/DialogLayout"
import { UserEstado } from "@/core/type/enums"
import { downloadFile } from "@/core/util"
import { Menu } from "@headlessui/react"
import { ChangeEvent, useState } from 'react'


const DepositoMenuOption = ({
  deposito
}:{
  deposito:Deposito | null
}) =>{
  
  return(
    <>
   
        <MenuLayout>

        {deposito != null &&
              <Menu.Item disabled={deposito.comprobante_url == null}>
                {({ active }) => (
                  <button 
                  onClick={()=>{
                    if(deposito.comprobante_url == null) return
                    downloadFile(deposito.comprobante_url,`comprobante-${deposito.date_paid.slice(0,10)}-${deposito.id}.png`)
                  }}
                  disabled={deposito.comprobante_url == null}
                  className={`
                 ${active ? 'bg-primary text-white' : 'text-gray-900'}
                 disabled:bg-opacity-50 disabled:text-gray-500 disabled:pointer-events-none
                 group whitespace-nowrap flex w-full items-center rounded-md px-2 py-2 text-sm
                 `}
                  >
                  Descargar comprobante
                  </button>
                )}
              </Menu.Item>
              }
              {/* <Menu.Item>
                {({ active }) => (
                  <button 
                  onClick={()=>{}}
                 className={`
                 ${active ? 'bg-primary text-white' : 'text-gray-900'}
                 group whitespace-nowrap flex w-full items-center rounded-md px-2 py-2 text-sm
                 `}
                  >
                   Deshabilitar usuario
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                  onClick={()=>{}}
                  className={`${active ? 'bg-primary text-white' : 'text-gray-900'}
                   group whitespace-nowrap flex w-full items-center rounded-md px-2 py-2 text-sm
                  ${active ? 'bg-primary text-white' : 'text-gray-900'} 
                  `}
                  >
                     Eliminar usuario
                  </button>
                )}
              </Menu.Item> */}
                </MenuLayout>
        </>
    )
}

export default DepositoMenuOption;