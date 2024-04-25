import DialogLayout from "@/components/util/dialog/DialogLayout"
import CommonImage from "@/components/util/image/CommonImage"
import { LoadingButton } from "@mui/lab"
import { Button, DialogActions, List, ListItem, ListItemButton, ListItemText } from "@mui/material"
import Image from "next/image"
import { useState } from "react"
import ListInstalaciones from "../ListInstalaciones"



const InstalacionesDialog = ({openModal,closeModal,instalaciones,onAccept}:{
    openModal:boolean
    closeModal:()=>void
    instalaciones:Instalacion[]
    onAccept:(e:Instalacion,setLoading:(v:boolean)=>void)=>void
}) =>{
    const [selected,setSelected] = useState<Instalacion | null>(null)
    const [loading,setLoading] = useState(false)

  

    return(
       <DialogLayout title="Configurar horas disponible"
       className="max-w-lg"
       open={openModal} close={closeModal}>
        <div>
        <ListInstalaciones
        instalaciones={instalaciones}
        onClick={(e)=>setSelected(e)}
        selected={(e)=>selected?.id == e.id}
        />
        
            <DialogActions>
                <Button onClick={closeModal}>Descartar</Button>
                <LoadingButton
                loading={loading}
                disabled={selected == null}
                onClick={()=>{
                    if(selected == null) return
                    onAccept(selected,(isLoading:boolean)=>{
                        setLoading(isLoading)
                    })
                }}>Aceptar</LoadingButton>
            </DialogActions>
        </div>
       </DialogLayout>
)
}

export default InstalacionesDialog;