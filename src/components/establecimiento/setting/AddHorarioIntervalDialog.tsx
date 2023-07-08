import ConfirmationDialog from "@/components/util/dialog/ConfirmationDialog";
import DialogLayout from "@/components/util/dialog/DialogLayout";
import { useAppDispatch } from "@/context/reduxHooks";
import { uiActions } from "@/context/slices/uiSlice";
import { addIntervalsHorario } from "@/core/repository/setting";
import { getIntervaloString } from "@/core/util/converter";
import { useState } from "react";
import { toast } from "react-toastify";


const intervalData:HorarioInterval[] = [
    {minutes:30},{minutes:60},{minutes:90},{minutes:120},{minutes:150},{minutes:180},
    {minutes:210},{minutes:240},{minutes:270},{minutes:300},{minutes:330},{minutes:360},
]

const AddHorarioIntervalDialog = ({open,close,intervalHorario,setting_id,appendIntervals}:{
    close:()=>void
    open:boolean
    intervalHorario:HorarioInterval[]
    setting_id:string
    appendIntervals:(d:HorarioInterval[])=>void
}) =>{
    const dispatch = useAppDispatch()
    const [ intervals,setIntervals ] = useState<HorarioInterval[]>([])
    const [showDialogConfirmation,setShowDialogConfirmation] = useState(false)
    const newInterval= intervalData.filter(item=>!intervalHorario.map(item=>item.minutes).includes(item.minutes))
    const selectInterval = (interval:HorarioInterval)=>{
        if(intervals.includes(interval)){
            const n = intervals.filter(item=>item != interval)
            setIntervals(n)
        }else{
            setIntervals([...intervals,interval])
        }
    }
   
    const addInterval = async()=>{
        try{
            dispatch(uiActions.setLoaderDialog(true))
            const data:AddIntervalRequest = {
                intervals:intervals,
                setting_id:setting_id
            }
            setShowDialogConfirmation(false)
            close()
            const res:AddIntervalRequest = await addIntervalsHorario(data)
            appendIntervals(res.intervals)
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
        <DialogLayout open={open} close={close} title="Añadir rango de hora para la reserva">
            <div>
            <div className="grid gap-3 grid-cols-2 py-5">
            {newInterval.map((item)=>{
                return(
                    <span key={item.minutes} onClick={()=>selectInterval(item)}
                     className={`card ${intervals.includes(item) && 'bg-primary text-white'} `}>
                        {getIntervaloString(item.minutes)}</span>
                    )
                })}

                </div>
                <button className="button" onClick={()=>setShowDialogConfirmation(true)}>Guardar Cambios</button>
            </div>
        </DialogLayout>
        </>
    )
}

export default AddHorarioIntervalDialog;