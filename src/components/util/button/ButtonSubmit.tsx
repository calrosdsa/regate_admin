"use-client"

import { LoadingButton } from "@mui/lab"

interface Props{
    loading:boolean
    title:string
    className?:string
    size?:'small' | 'medium' | 'large'
    testId?:string
}
const ButtonSubmit = ({loading,title,className="",size="medium",testId}:Props) =>{

    return(
        <div className={`relative ${className} mt-3`}>
      <LoadingButton
      variant="contained"
      type="submit" 
      size={size}
      data-testid={testId}
      loading={loading}
      sx={{ width:"100%"}}>
        {title}
      </LoadingButton>
           </div>
    )
}

export default ButtonSubmit;