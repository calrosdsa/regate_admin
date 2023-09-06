"use client"
import {  Dialog, Transition } from '@headlessui/react';
import axios from 'axios';
import Link from 'next/link';
import React from 'react';
interface Props{
    open:boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    children:React.ReactNode
}

const MobileSidebar:React.FC<Props> = ({open,setOpen,children}) =>{
 
    return(
      <Transition.Root show={open} as='div'>
      <Dialog 
        as='div'
        className='fixed  inset-0 overflow-hidden xl:hidden z-20'
        onClose={setOpen}
      >
        <div className='absolute inset-0 overflow-hidden'>
          <Transition.Child
            as='div'
            enter='ease-in-out duration-400'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in-out duration-400'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Dialog.Overlay className='absolute bg-black opacity-25 inset-0 transition-opacity' />
          </Transition.Child>
          <div className='fixed '>
            <Transition.Child
              as='div'
              enter='transform transition ease-in-out duration-400 sm:duration-700'
              enterFrom='-translate-x-full'
              enterTo='-translate-x-0'
              leave='transform transition ease-in-out duration-400 sm:duration-700'
              leaveFrom='-translate-x-0'
              leaveTo='-translate-x-full'
            >
              <div className='relative max-w-lg '>
                <Transition.Child
                  as='div'
                  enter='ease-in-out duration-400'
                  enterFrom='opacity-0'
                  enterTo='opacity-100'
                  leave='ease-in-out duration-400'
                  leaveFrom='opacity-100'
                  leaveTo='opacity-0'
                >
                  
                </Transition.Child>
                <div className='relative flex  flex-col w-full  bg-white shadow-xl overflow-auto z-30'>
                <div className='flex space-x-4 items-center px-4 sm:px-6'>
                  {/* <Dialog.Title className='text-2xl font-bold text-indigo-500'>
                    <h1>Portal Cautivo</h1>
                  </Dialog.Title> */}
                
                </div>
                {children}
              </div>
              </div>
          </Transition.Child>
          </div>
      </div>
      </Dialog>
      </Transition.Root>
       
    )
}

export default MobileSidebar;