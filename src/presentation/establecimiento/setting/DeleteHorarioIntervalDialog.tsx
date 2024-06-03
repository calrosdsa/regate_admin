import ConfirmationDialog from "@/presentation/util/dialog/ConfirmationDialog";
import DialogLayout from "@/presentation/util/dialog/DialogLayout";
import Item from "@/presentation/util/item/Item";
import { useAppDispatch } from "@/context/reduxHooks";
import { uiActions } from "@/context/slices/uiSlice";
import { addIntervalsHorario, deleteIntervalsHorario } from "@/core/repository/setting";
import { getIntervaloString } from "@/core/util/converter";
import { Button } from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";



const DeleteHorarioIntervalDialog = ({open,close,intervalHorario,appendIntervals}:{
    close:()=>void
    open:boolean
    intervalHorario:HorarioInterval[]
    appendIntervals:(d:HorarioInterval[])=>void
}) =>{
    const dispatch = useAppDispatch()
    const [ intervals,setIntervals ] = useState<HorarioInterval[]>([])
    const [showDialogConfirmation,setShowDialogConfirmation] = useState(false)
    const selectInterval = (interval:HorarioInterval)=>{
        if(intervals.includes(interval)){
            const n = intervals.filter(item=>item != interval)
            setIntervals(n)
        }else{
            setIntervals([...intervals,interval])
        }
    }
   
    const deleteInterval = async()=>{
        try{
            dispatch(uiActions.setLoaderDialog(true))
            setShowDialogConfirmation(false)
            close()
            const res:HorarioInterval[] = await deleteIntervalsHorario(intervals)
            const newL = intervalHorario.filter(item=>!res.map(item=>item.minutes).includes(item.minutes))
            appendIntervals(newL)
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
        performAction={deleteInterval}
        />
        }
        <DialogLayout
        className="max-w-lg"
         open={open} close={close} title="Remover rango de hora para la reserva">
            <div>
            <div className="grid gap-3 grid-cols-2 py-5">
            {intervalHorario.map((item)=>{
                return(
                    <Item
                    onClick={()=>selectInterval(item)}
                    key={item.minutes}
                    disabled={false}
                    text={getIntervaloString(item.minutes)}
                    selected={intervals.includes(item)}
                    />
                    // <span key={item.minutes} onClick={()=>selectInterval(item)}
                    //  className={`card ${intervals.includes(item) && 'bg-primary text-white'} `}>
                    //     {getIntervaloString(item.minutes)}</span>
                    )
                })}

                </div>
                <Button  onClick={()=>setShowDialogConfirmation(true)}>Guardar Cambios</Button>
            </div>
        </DialogLayout>
        </>
    )
}

export default DeleteHorarioIntervalDialog;