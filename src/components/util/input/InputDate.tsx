import { useRef, useState } from "react";
import SelectTime from "../select/SelectTime";
import useEffectOnce from "@/core/util/hooks/useEffectOnce";
import moment from "moment";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";


const InputDate = ({
    value,onChange,minDate,maxDate,testId
}:{
    onChange:(e:moment.Moment)=>void
    value:moment.Moment
    minDate?:moment.Moment
    maxDate?:moment.Moment
    testId?:string
})=>{
    
    return(
       <>
         <LocalizationProvider dateAdapter={AdapterMoment}>
         <DemoContainer
        
        components={[
          'DatePicker',
        ]}>
          <div data-testid={testId}>
        <DemoItem>
          <DatePicker 
          minDate={minDate}
          maxDate={maxDate}
           value={value} onChange={(e)=>{
            console.log(e)
            if(e == null) return
            onChange(e)
            }}/>
        </DemoItem>
          </div>
      </DemoContainer>
         </LocalizationProvider>
       </>
    )
}

export default InputDate;