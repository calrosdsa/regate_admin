"use-client"

import { LoadingButton } from "@mui/lab"

interface Props{
    loading:boolean
    title:string
    className?:string
    size?:'small' | 'medium' | 'large'
    testId?:string
    disabled?:boolean
}
const ButtonSubmit = ({loading,title,className="",size="medium",testId,disabled=false}:Props) =>{

    return(
        <div className={`relative ${className} mt-3`}>
      <LoadingButton
      variant="contained"
      type="submit" 
      size={size}
      data-testid={testId}
      loading={loading}
      disabled={disabled}
      sx={{ width:"100%"}}>
        {title}
      </LoadingButton>
           </div>
    )
}

export default ButtonSubmit;