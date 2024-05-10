import CommonImage from "@/components/util/image/CommonImage";
import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";


const ListInstalaciones =  ({instalaciones,selected,onClick}:{
    instalaciones:Instalacion[]
    selected:(e:Instalacion)=>boolean
    onClick:(e:Instalacion)=>void
}) =>{

    return(
        <List sx={{ width: '100%' }}>
            {instalaciones.map((item,idx) => (
                <ListItem
                data-testid={`cancha-${idx}`}
                divider={true}
                key={idx}
                disablePadding
                secondaryAction={
                    item.portada != null &&
                    <CommonImage 
                    src={item.portada}
                    h={70}
                    w={70}
                    className="h-10 w-10 object-cover rounded-full bg-gray-200 "
                    />
                }
                >
                <ListItemButton
                selected={selected(item)}
                 onClick={()=>onClick(item)}>
                <ListItemText primary={item.name.slice(0,50)} secondary={item.category_name} />
                </ListItemButton>
                </ListItem>
            ))}
            </List>
    )
}

export default ListInstalaciones;