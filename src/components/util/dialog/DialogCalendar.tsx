import { Fragment } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { StaticDatePicker } from "@mui/x-date-pickers";
import moment from "moment";
import DialogLayout from "./DialogLayout";

const DialogCalendar = ({openModal,closeModal,onAccept,value}:{
    openModal:boolean
    value:moment.Moment | null
    closeModal:()=>void
    onAccept:(e: moment.Moment | null) =>void
}) =>{

    return(
        <DialogLayout
        close={closeModal}
        allowFullScreen={false}
        open={openModal}>

                    <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DemoContainer components={['DatePicker']}>
                                    <StaticDatePicker value={value} onAccept={(e)=>{
                                      onAccept(e)
                                      closeModal()
                                    }} onClose={closeModal}/>
                                </DemoContainer>
                                </LocalizationProvider>
        </DialogLayout>
)
}

export default DialogCalendar;