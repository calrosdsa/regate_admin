import { Button, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const Item = ({text,onClick,selected=false,disabled=true}:{
    text:string  
    onClick?:()=>void  
    selected?:boolean 
    disabled?:boolean
}) =>{    
    const ItemMui = styled(Button)(({ theme }) => ({
        // backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        cursor:"pointer",
        border: disabled ? `1px solid ${theme.palette.text.secondary}`:`1px solid ${theme.palette.primary.main}`,
    }));
    return(
        <ItemMui
        variant={selected ? "contained" : "text" }
        onClick={()=>{
            if(onClick != undefined){
                onClick()
            }
        }}
        >{text}</ItemMui>
    )
}

export default Item;