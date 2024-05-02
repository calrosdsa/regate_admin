import { Button } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const AddAndDeleteButtons = ({onAddButtonClick,onDeleteButtonClick}:{
    onAddButtonClick:()=>void
    onDeleteButtonClick:()=>void
}) => {


    return(
        <>
        <Button  onClick={()=>onAddButtonClick()} startIcon={<AddIcon/>} size="small">
            Añadir
            </Button>

            <Button  onClick={()=>onDeleteButtonClick()} startIcon={<DeleteIcon/>} size="small">
            Remover
            </Button>
        </>
    )
}

export default AddAndDeleteButtons;