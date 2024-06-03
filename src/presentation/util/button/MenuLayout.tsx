import { Button, Fade, IconButton, Menu } from '@mui/material'
import { useState } from 'react';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
export default function MenuLayout({children,className="",anchorEl,setAnchorEl}:{
  className?:string
  children:React.ReactNode
  anchorEl:null | HTMLElement
  setAnchorEl:(e:null | HTMLElement)=>void
}) {
  // const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div>
    <IconButton
      id="fade-button"
      aria-controls={open ? 'fade-menu' : undefined}
      aria-haspopup="true"
      aria-expanded={open ? 'true' : undefined}
      onClick={handleClick}
    >
      <MoreVertOutlinedIcon/>
    </IconButton>
    <Menu
      id="fade-menu"
      MenuListProps={{
        'aria-labelledby': 'fade-button',
      }}
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      TransitionComponent={Fade}
    >
      {children}
    </Menu>
  </div>
  )
}
