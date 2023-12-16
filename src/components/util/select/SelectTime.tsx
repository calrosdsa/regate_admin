import { hours } from '@/context/actions/chart-actions'
import { Menu, Transition } from '@headlessui/react'
import moment from 'moment'
import { Fragment } from 'react'

const SelectTime = ({
    setTime
}:{
    setTime:(e:Date)=>void
}) =>{
  return (
    <div className="h-8 z-10 border-r border-t border-b border-gray-400 px-1 grid place-content-center hover:bg-gray-200 rounded-l-lg">
      <Menu as="div" className={`relative inline-block text-left `}>
        <div>
          <Menu.Button className="rounded-full noSelect  cursor-pointer flex justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
        </svg>
          
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

      <Menu.Items className="fixed  z-10 mt-2 overflow-y-auto bg-white shadow-lg ring-1 ring-black
        rounded-md ring-opacity-5 focus:outline-none grid h-64 overflow-auto">
            {hours.map((item,idx)=>{
                return(
        <Menu.Item >
          {({ active}) => (
              <button
              onClick={()=>setTime(item.hour)}
              className={`px-4 py-2  ${active && 'bg-blue-500'}`}
              >
              {moment(item.hour).utc().format("LT")}
            </button>
          )}
        </Menu.Item>
                )
            })}
    
      </Menu.Items>
        </Transition>
    </Menu>
    </div>
  )
}

export default SelectTime;