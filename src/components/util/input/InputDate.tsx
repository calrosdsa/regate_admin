import { useRef, useState } from "react";
import SelectTime from "../select/SelectTime";
import useEffectOnce from "@/core/util/hooks/useEffectOnce";
import moment from "moment";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";


const InputDate = ({
    value,onChange,minDate
}:{
    onChange:(e:moment.Moment)=>void
    value:moment.Moment
    minDate?:moment.Moment
})=>{
    
    return(
       <>
         <LocalizationProvider dateAdapter={AdapterMoment}>
         <DemoContainer
        components={[
          'DatePicker',
        ]}
      >
        <DemoItem>
          <DatePicker 
          minDate={minDate}
           value={value} onChange={(e)=>{
            if(e == null) return
            onChange(e)
            }}/>
        </DemoItem>
      </DemoContainer>
         </LocalizationProvider>
       </>
    )
}

export default InputDate;