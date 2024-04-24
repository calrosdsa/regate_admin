import DialogLayout from "@/components/util/dialog/DialogLayout"
import CommonImage from "@/components/util/image/CommonImage"
import { LoadingButton } from "@mui/lab"
import { Button, DialogActions, List, ListItem, ListItemButton, ListItemText } from "@mui/material"
import Image from "next/image"
import { useState } from "react"



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
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {instalaciones.map((item,idx) => (
                <ListItem
                key={idx}
                disablePadding
                secondaryAction={
                    item.portada != null &&
                    <CommonImage 
                    src={item.portada}
                    h={70}
                    w={70}
                    className="h-10 w-10 object-cover rounded-full"
                    />
                }
                >
                <ListItemButton
                selected={selected?.id == item.id}
                 onClick={()=>{
                    setSelected(item)
                }}>
                <ListItemText primary={item.name} secondary={item.category_name} />
                </ListItemButton>
                </ListItem>
            ))}
            </List>
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