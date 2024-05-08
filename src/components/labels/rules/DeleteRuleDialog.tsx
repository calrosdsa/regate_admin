import { useState } from "react";
import DialogLayout from "../../util/dialog/DialogLayout";
import ConfirmationDialog from "../../util/dialog/ConfirmationDialog";
import { useAppDispatch } from "@/context/reduxHooks";
import { uiActions } from "@/context/slices/uiSlice";
import { AddAmenities, AddRules, DeleteRules } from "@/core/repository/labels";
import { toast } from "react-toastify";
import { Button,Checkbox, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";


const DeleteRuleDialog = ({rules,close,open,establecimientoId,setNewRulesEstablecimiento}:{
    rules:Label[]
    open:boolean
    close:()=>void
    establecimientoId:number
    setNewRulesEstablecimiento:(e:Label[])=>void
}) =>{
    const dispatch = useAppDispatch()
    const [ids,setIds] = useState<number[]>([])
    const [showDialogConfirmation,setShowDialogConfirmation] = useState(false)

    const selectItem = (id:number) =>{
        if(ids.includes(id)){
            const newList = ids.filter(item =>item != id)
            setIds(newList)
        }else{
            setIds([...ids,id])
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
            const res:Label[] = await DeleteRules(req)
            setNewRulesEstablecimiento(res)
            // console.log(res)
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
         open={open} close={close} title="Remover reglas">
            <div className="py-2 max-w-xl">
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                    {rules.map((item,idx)=>{
                        const labelId = `checkbox-list-label-${idx}`;
                        return(
                            <ListItemButton key={idx} role={undefined} onClick={()=>selectItem(item.id)} dense>
                            <ListItemIcon>
                              <Checkbox
                                edge="start"
                                checked={ids.includes(item.id)}
                                tabIndex={-1}
                                disableRipple
                                inputProps={{ 'aria-labelledby': labelId }}
                              />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={item.name} />
                          </ListItemButton>
                    )
                })}
            </List>          
                {/* <div className="gap-2 flex overflow-auto max-w-xl flex-wrap " >
                    {rules.map((item)=>{
                        return(
                            <div key={item.id} onClick={()=>selectItem(item.id)}
                            className="flex cursor-pointer space-x-4 divider p-1 w-full">
                                <input type="checkbox" checked={ids.includes(item.id)} onChange={(e)=>{}}/>
                                <span>{item.name}</span>
                            </div>
                            // <Amenity key={item.id} onClick={()=>selectItem(item.id)}
                        //    item={item} className={`noselect ${ids.includes(item.id) ? "border-2 border-primary":"border-2"}`}/>
                        )
                    })}
                    
                </div> */}

                <div className="w-full justify-end pt-2">
                <Button onClick={()=>setShowDialogConfirmation(true)}
                disabled={ids.length == 0} variant="contained">
                    Remover
                </Button>
                </div>
                {/* {JSON.stringify(rules)} */}
            </div>
        </DialogLayout>
        </>
    )
}

export default DeleteRuleDialog;   