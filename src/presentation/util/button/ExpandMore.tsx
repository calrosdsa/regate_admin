import * as React from 'react';
import { styled } from '@mui/material/styles';
import Collapse from '@mui/material/Collapse';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ListItem, ListItemButton, ListItemText } from '@mui/material';

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
  }

const ExpandMore = ({
    children,title
}:{
    children:React.ReactNode
    title:string
}) =>{
    const [expanded, setExpanded] = React.useState(true);
    const ExpandMore = styled((props: ExpandMoreProps) => {
        const { expand, ...other } = props;
        return <IconButton {...other} />;
      })(({ theme, expand }) => ({
        transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
          duration: theme.transitions.duration.shortest,
        }),
      }));

      const handleExpandClick = () => {
        setExpanded(!expanded);
      };

    return (
        <>
        <ListItem secondaryAction={
            <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
            size="small"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        } >
            <ListItemText primary={title}
            primaryTypographyProps={{
             fontSize: 16,
             fontWeight: 'medium',
             lineHeight: '20px',
           }}
            />
        </ListItem>
          <Collapse in={expanded} timeout="auto" unmountOnExit sx={{pl:1,pr:1}}>
            {children}
          </Collapse>
        </>
    )
}

export default ExpandMore;