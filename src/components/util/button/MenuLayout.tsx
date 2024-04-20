import { Menu, Transition } from '@headlessui/react'
import { IconButton } from '@mui/material'
import { Fragment, useEffect, useRef, useState } from 'react'
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function MenuLayout({children,className=""}:{
  className?:string
  children:React.ReactNode
}) {
  return (
    <div className="h-7">
      <Menu as="div" className={`relative inline-block text-left ${className}`}>
        <div>
          <Menu.Button className="rounded-full noSelect hover:bg-gray-200 cursor-pointer flex justify-center">
            <IconButton>
              <MoreVertIcon/>
            </IconButton>
          
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >

        <Menu.Items className="absolute right-1 z-10 mt-2 overflow-y-auto bg-white shadow-lg ring-1 ring-black
        rounded-md ring-opacity-5 focus:outline-none">
        {children}
            {/* <div className="px-1 py-1 ">

              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-primary text-white' : 'text-gray-900'
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    Edit
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-primary text-white' : 'text-gray-900'
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    Duplicate
                  </button>
                )}
              </Menu.Item>
            </div>
            <div className="px-1 py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-primary text-white' : 'text-gray-900'
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    Archive
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-primary text-white' : 'text-gray-900'
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    Move
                  </button>
                )}
              </Menu.Item>
            </div>
            <div className="px-1 py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-primary text-white' : 'text-gray-900'
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    Delete
                  </button>
                )}
              </Menu.Item>
            </div> */}

          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}
