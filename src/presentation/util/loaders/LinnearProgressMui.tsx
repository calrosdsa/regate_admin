import { Box, LinearProgress } from "@mui/material"


const LinearProgressMui = ({loading}:{loading:boolean}) =>{
    return (
        <Box sx={{ width: '100%',height:4   }}>
        {loading &&
        <LinearProgress />
         }
        </Box>
        
    )
}

export default LinearProgressMui;