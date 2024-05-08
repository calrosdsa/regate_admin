import ConfirmationDialog from "@/components/util/dialog/ConfirmationDialog";
import DialogLayout from "@/components/util/dialog/DialogLayout";
import Item from "@/components/util/item/Item";
import { useAppDispatch } from "@/context/reduxHooks";
import { uiActions } from "@/context/slices/uiSlice";
import { UpdatePayMethod, addIntervalsHorario } from "@/core/repository/setting";
import { PaidType } from "@/core/type/enums";
import { getIntervaloString, getPaymentMethod } from "@/core/util/converter";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type PayMethod ={
    method:PaidType
}
const payMethods:PayMethod[] = [
    {
        method:PaidType.LOCAL,
    },
    {
        method:PaidType.DEFERRED_PAYMENT,
    },
    {
        method:PaidType.UPFRONT_PAYMENT,
    }
]

const UpdatePayMethodDialog = ({open,close,establecimiento_id,update,currentMethods}:{
    close:()=>void
    open:boolean
    currentMethods:number[] | null
    establecimiento_id:number
    update:(d:number[])=>void
}) =>{
    const dispatch = useAppDispatch()
    const [ methods,setMethods ] = useState<PaidType[]>(currentMethods || [])
    const [showDialogConfirmation,setShowDialogConfirmation] = useState(false)
    // const newInterval= intervalData.filter(item=>!intervalHorario.map(item=>item.minutes).includes(item.minutes))
    const selectInterval = (interval:PaidType)=>{
        if(methods.includes(interval)){
            const n = methods.filter(item=>item != interval)
            setMethods(n)
        }else{
            setMethods([...methods,interval])
        }
    }
   
    const addInterval = async()=>{
        try{
            dispatch(uiActions.setLoaderDialog(true))
            const data = {
                methods:methods,
                establecimiento_id:establecimiento_id
            }
            setShowDialogConfirmation(false)
            close()
            const res = await UpdatePayMethod(JSON.stringify(data),establecimiento_id)
            update(methods)
            // appendIntervals(res.methods)
            dispatch(uiActions.setLoaderDialog(false))
            toast.success("¡Los cambios realizados han sido guardados exitosamente!")
        }catch(err){
            dispatch(uiActions.setLoaderDialog(false))
            toast.error("Se produjo un fallo al guardar los cambios.")
        }
    }

    return(
        <>
        {showDialogConfirmation &&
        <ConfirmationDialog
        open={showDialogConfirmation}
        close={()=>setShowDialogConfirmation(false)}
        performAction={addInterval}
        />  
        }
        <DialogLayout
        className="max-w-lg"
         open={open} close={close} title="Añadir rango de hora para la reserva">
            <div>
            <div className="grid gap-3 grid-cols-2 py-5">
            {payMethods.map((item)=>{
                return(
                    <Item
                    onClick={()=>selectInterval(item.method)}
                    key={item.method}
                    text={getPaymentMethod(item.method)}
                    disabled={false}
                    selected={methods.includes(item.method)}
                    />
                    // <span key={item.method} onClick={()=>selectInterval(item.method)}
                    //  className={`card ${methods.includes(item.method) && 'bg-primary text-white'} `}>
                    //     {getPaymentMethod(item.method)}</span>
                    )
                })}

                </div>
                <Button variant="contained" onClick={()=>setShowDialogConfirmation(true)}>Guardar Cambios</Button>
            </div>
        </DialogLayout>
        </>
    )
}

export default UpdatePayMethodDialog;