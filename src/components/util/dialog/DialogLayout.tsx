import { Dialog, Transition } from "@headlessui/react"
import {  Fragment, ReactNode, useRef } from 'react'


const DialogLayout = ({open,close,children,title ="",className="",allowClose=false,allowFullScreen=false}:{
    open:boolean
    allowClose?:boolean
    close:()=>void
    children:ReactNode
    className?:string
    title?:string
    allowFullScreen?:boolean
}) =>{


    return(
        <Transition appear show={open} as={Fragment}>
        <Dialog
        as="div" className="relative z-10" onClose={()=>{
          if(allowClose){
            close()
          }
        }}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>
    
          <div className="fixed inset-0 overflow-y-auto">
            <div className={`flex min-h-full items-center justify-center ${!allowFullScreen && "p-4"} text-center`}>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
                >
                <Dialog.Panel className={`transform overflow-hidden rounded-lg bg-white p-2
                text-left align-middle shadow-xl transition-all w-full ${className} ${allowFullScreen && "h-screen sm:h-full"}`}>
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center space-x-12"
                  >
                    <span>{title}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                     className="w-9 h-9 p-1 rounded-full noSelect hover:bg-gray-200 cursor-pointer" onClick={close}>
  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
             </svg>

                     </Dialog.Title>
                     <input type="text" readOnly className="h-0 w-1 opacity-0"/>
                     <div className="-mt-6">
                     {children}
                     </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </div>
    </Dialog>
  </Transition>
    )
}

export default DialogLayout;