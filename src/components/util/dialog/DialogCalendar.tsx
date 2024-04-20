import { Fragment } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { StaticDatePicker } from "@mui/x-date-pickers";
import moment from "moment";

const DialogCalendar = ({openModal,closeModal,onAccept,value}:{
    openModal:boolean
    value:moment.Moment | null
    closeModal:()=>void
    onAccept:(e: moment.Moment | null) =>void
}) =>{

    return(
        <Transition appear show={openModal} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
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
            <div className="flex min-h-full items-center justify-center  text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-xs  transform overflow-hidden rounded-lg 
                 text-left align-middle shadow-xl transition-all ">
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DemoContainer components={['DatePicker']}>
                                    <StaticDatePicker value={value} onAccept={(e)=>{
                                        onAccept(e)
                                        closeModal()
                                        }} onClose={closeModal}/>
                                </DemoContainer>
                                </LocalizationProvider>
                   </Dialog.Panel>
          </Transition.Child>
        </div>
      </div>
    </Dialog>
  </Transition>
)
}

export default DialogCalendar;