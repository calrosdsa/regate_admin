import { useState } from "react";
import DialogLayout from "../../util/dialog/DialogLayout";
import Amenity from "./Amenity";
import ConfirmationDialog from "../../util/dialog/ConfirmationDialog";
import { useAppDispatch } from "@/context/reduxHooks";
import { uiActions } from "@/context/slices/uiSlice";
import { AddAmenities } from "@/core/repository/labels";
import { toast } from "react-toastify";


const AddAmenityDialog = ({amenities,close,open,establecimientoId,setNewAmenitiesEstablecimiento}:{
    amenities:Label[]
    open:boolean
    close:()=>void
    establecimientoId:number
    setNewAmenitiesEstablecimiento:(e:Label[])=>void
}) =>{
    const dispatch = useAppDispatch()
    const [ids,setIds] = useState<number[]>([])
    const [showDialogConfirmation,setShowDialogConfirmation] = useState(false)

    const selectItem = (amenityId:number) =>{
        if(ids.includes(amenityId)){
            const newList = ids.filter(item =>item != amenityId)
            setIds(newList)
        }else{
            setIds([...ids,amenityId])
        }
    }

    const saveChanges=async() =>{
        try{
            dispatch(uiActions.setLoaderDialog(true))
            const req:LabelRequest =  {
                establecimiento_id:establecimientoId,
                ids
            }
            setShowDialogConfirmation(false)
            close()
            const res:Label[] = await AddAmenities(req)
            setNewAmenitiesEstablecimiento(res)
            console.log(res)
            dispatch(uiActions.setLoaderDialog(false))
            toast.success("¡Los cambios realizados han sido guardados exitosamente!")
        }catch(err){
            dispatch(uiActions.setLoaderDialog(false))
            toast.error("Se produjo un fallo al guardar los cambios.")
        }
    }


    return (
        <>
          {showDialogConfirmation &&
        <ConfirmationDialog
        open={showDialogConfirmation}
        close={()=>setShowDialogConfirmation(false)}
        performAction={saveChanges}
        />
        }
        <DialogLayout
        className="max-w-lg"
         open={open} close={close} title="Agregar comodidades">
            <div className="py-2 max-w-xl">
                <div className="gap-2 flex overflow-auto max-w-xl flex-wrap " >
                    {amenities.map((item)=>{
                        return <Amenity key={item.id} onClick={()=>selectItem(item.id)}
                        item={item} className={`noselect ${ids.includes(item.id) ? "border-2 border-primary":"border-2"}`}/>
                    })}
                    
                </div>

                <div className="w-full justify-end pt-2 ">
                <button onClick={()=>setShowDialogConfirmation(true)}
                className="button" disabled={ids.length == 0}>
                    Añadir
                </button>
                </div>
                {/* {JSON.stringify(amenities)} */}
            </div>
        </DialogLayout>
        </>
    )
}

export default AddAmenityDialog;