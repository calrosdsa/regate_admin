import { Fragment } from "react"
import { Dialog, Transition } from "@headlessui/react"


const ConfirmationDialog = ({open,close,title,description,descartar=close,performAction}:{
    open:boolean
    close:()=>void
    title?:string
    description?:string
    descartar?:()=>void
    performAction:()=>void
}) =>{

    return(
        <Transition appear show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={close}>
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
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-xs transform overflow-hidden rounded-lg bg-white 
                 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center p-2"
                  >
                    <span>Porfavor confirme si desea continuar</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                     className="w-6 h-6 cursor-pointer" onClick={close}>
  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
             </svg>

                     </Dialog.Title>
              <span className='px-2'>{description}</span>
                   <div className='grid grid-cols-2 place-items-center border-t-[1px] text-lg'>
                       <span  onClick={()=>descartar()}
                        className='cursor-pointer hover:bg-gray-200 w-full rounded-bl-lg justify-center border-r-[1px] flex p-2'>Descartar</span>
                       <span onClick={()=>{
                        if(performAction != undefined){
                          performAction()}
                        }
                      } 
                       className='cursor-pointer rounded-br-lg hover:bg-gray-200 w-full justify-center flex p-2'>Continuar</span>
                   </div>
                   </Dialog.Panel>
          </Transition.Child>
        </div>
      </div>
    </Dialog>
  </Transition>
)
}

export default ConfirmationDialog;