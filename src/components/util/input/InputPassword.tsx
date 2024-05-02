import { IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import { ChangeEvent, useState } from "react";
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

interface Props{
    onChange:(e:ChangeEvent<HTMLInputElement>)=>void
    password:string
    label:string
    name:string
    error?:string
    className?:string
    size?:'small' | 'medium'
}
const InputPassword = ({onChange,password,label,name,error,className,size="small"}:Props) =>{
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

    return(
        <div className={`relative mt-3 ${className}`}>
        <Typography  variant="body2" sx={{mb:1}}>{label}</Typography>
    <TextField
      id="password"
      name={name} 
      type={showPassword ? 'text' : 'password'}
      required
      size={size}
      onChange={onChange} 
      value={password}
      fullWidth
      sx={{backgroundColor:"white"}}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
          <LockIcon/>
          </InputAdornment>
        ),
        endAdornment:(
              <InputAdornment position="end">
                <IconButton
                  size={size}
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
        )
      }}
      // minLength={8}
      helperText={error}
        placeholder="" />
      </div>  
    )
}

export default InputPassword;