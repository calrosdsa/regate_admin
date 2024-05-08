import { Button, Typography } from "@mui/material";
import Image from "next/image";
import { styled } from '@mui/material/styles';


const Amenity = ({item,className,onClick,disabled=true,selected=false}:{
    item:Label
    className?:string
    onClick?:()=>void
    disabled?:boolean
    selected?:boolean
}) => {
    const ItemAmenity = styled(Button)(({ theme }) => ({
        // backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        cursor:"pointer",
        border: disabled ? `1px solid ${theme.palette.text.secondary}`:`1px solid ${theme.palette.primary.main}`,
    }));
    return(
        <ItemAmenity
        onClick={onClick}
        variant={selected ? "contained":"text"}
        className={`card flex space-x-2 items-center `}>
        <Image
        src={item.thumbnail as string}
        width={100}
        height={100}
        className='h-6 w-6 bg-white rounded-full p-1'
        alt=''
        />
        <Typography variant="body2">{item.name}</Typography>
    </ItemAmenity>
    )
}

export default Amenity;