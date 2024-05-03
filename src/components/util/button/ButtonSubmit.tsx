"use-client"

import { LoadingButton } from "@mui/lab"

interface Props{
    loading:boolean
    title:string
    className?:string
    size?:'small' | 'medium' | 'large'
}
const ButtonSubmit = ({loading,title,className="",size="medium"}:Props) =>{

    return(
        <div className={`relative ${className} mt-3`}>
      <LoadingButton
      variant="contained"
      type="submit" 
      size={size}
      loading={loading}
      sx={{ width:"100%"}}>
        {title}
      </LoadingButton>
           </div>
    )
}

export default ButtonSubmit;