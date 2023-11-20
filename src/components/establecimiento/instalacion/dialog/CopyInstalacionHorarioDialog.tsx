import DialogLayout from "@/components/util/dialog/DialogLayout"
import CreateInstalacionComponent from "../CreateInstalacion"
import CommonImage from "@/components/util/image/CommonImage"
import { useState } from "react"
import { CopyInstalacionHorario } from "@/core/repository/instalacion"
import ConfirmationDialog from "@/components/util/dialog/ConfirmationDialog"
import { toast } from "react-toastify"
import { successfulMessage, unexpectedError } from "@/context/config"
import { useAppDispatch } from "@/context/reduxHooks"
import { uiActions } from "@/context/slices/uiSlice"


const CopyInstalacionHorarioDialog = ({open,close,instalaciones,instalacionId,dayWeek,updateHorarios}:{
    open:boolean
    close:()=>void
    instalaciones:Instalacion[]
    instalacionId:number
    dayWeek:number | null
    updateHorarios:(res:Cupo[]) =>void
}) => {
    const [selectedInstacion,setSelecetedInstalacion] = useState(0)
    const [openConfirmationDialog,setOpenConfirmationDialog] = useState(false)
    const dispatch = useAppDispatch()
    const copyInstalacion = async() =>{
        try{
            close()
            dispatch(uiActions.setLoaderDialog(true))
            const request = {
                id:selectedInstacion,
                target_id:instalacionId
            }
            const res:Cupo[] = await CopyInstalacionHorario(JSON.stringify(request))
            const filterCupos = res.filter(item=>item.day == dayWeek)
            updateHorarios(filterCupos)
            toast.success(successfulMessage)
            dispatch(uiActions.setLoaderDialog(false))
        }catch(err){
            dispatch(uiActions.setLoaderDialog(false))
            toast.error(unexpectedError)
            console.log(err)
        }
    }

    return(
        <>
        {openConfirmationDialog &&
        <ConfirmationDialog
        open={openConfirmationDialog}
        close={()=>setOpenConfirmationDialog(false)}
        performAction={()=>{
            copyInstalacion()
            setOpenConfirmationDialog(false)
        }}
        />
        }
        <DialogLayout
        className="max-w-lg"
        title="Elige que horario de las siguientes canchas deseas copiar"
        allowFullScreen={true}
         open={open} close={close}>
          <div className="mt-2">
            {instalaciones.filter(item=> item.id != instalacionId).map((item)=>{
                return(
                    <div key={item.id} className="fles space-x-2 items-center p-2 whitespace-nowrap
                    active:hover:bg-gray-200 sm:hover:bg-gray-200 cursor-pointer"
                    onClick={()=>setSelecetedInstalacion(item.id)}>
                            <input type="checkbox" checked={selectedInstacion == item.id} onChange={(e)=>{}}/>
                            <span className="">{item.name}</span>
                    </div>
                )
            })}

            <div className="flex w-full justify-end">
                <button className="button" onClick={()=>setOpenConfirmationDialog(true)}>
                    Copiar horario
                </button>
            </div>
          </div>
        </DialogLayout>
        </>
    )
}

export default CopyInstalacionHorarioDialog;