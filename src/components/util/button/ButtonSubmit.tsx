"use-client"

import { LoadingButton } from "@mui/lab"

interface Props{
    loading:boolean
    title:string
    className?:string
}
const ButtonSubmit = ({loading,title,className=""}:Props) =>{

    return(
        <div className={`relative ${className} mt-3`}>
      <LoadingButton
      variant="contained"
      type="submit" loading={loading} sx={{ width:"100%"}}>
        {title}
      </LoadingButton>
           </div>
    )
}

export default ButtonSubmit;