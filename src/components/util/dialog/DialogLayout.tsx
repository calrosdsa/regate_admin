import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';  
import { ReactNode } from 'react';
import { Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const DialogLayout = ({open,close,children,title ="",allowClose=false,allowFullScreen=false,
showHeader=true,testId}:{
    open:boolean
    allowClose?:boolean
    close:()=>void
    testId?:string
    children:ReactNode
    className?:string
    showHeader?:boolean
    title?:string
    allowFullScreen?:boolean
}) =>{
  
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isFullScreen = allowFullScreen && fullScreen
    return(
      <Dialog
        fullScreen={isFullScreen}
        open={open}
        onClose={()=>{
          if(allowClose){
            close()
          }
        }}
        aria-labelledby="responsive-dialog-title"

      >
        {showHeader &&
        <DialogTitle id="responsive-dialog-title" >
          <div className='flex justify-between items-center space-x-8'>
            <Typography variant="h6">
          {title}
            </Typography>

            <IconButton data-testid={`${testId}-close`} onClick={()=>close()}>
              <CloseIcon/>
            </IconButton>
          </div>
        </DialogTitle>
        }
        <DialogContent 
        >
          {children}
        </DialogContent>
      </Dialog>
  //       <Transition appear show={open} as={Fragment}>
  //       <Dialog
  //       autoFocus={false}
  //       as="div" className="relative z-10" onClose={()=>{
  //         if(allowClose){
  //           close()
  //         }
  //       }}>
  //         <Transition.Child
  //           as={Fragment}
  //           enter="ease-out duration-300"
  //           enterFrom="opacity-0"
  //           enterTo="opacity-100"
  //           leave="ease-in duration-200"
  //           leaveFrom="opacity-100"
  //           leaveTo="opacity-0"
  //         >
  //           <div className="fixed inset-0 bg-black bg-opacity-25" />
  //         </Transition.Child>
    
  //         <div className="fixed inset-0 overflow-y-auto ">
  //           <div className={`flex min-h-full items-center justify-center ${!allowFullScreen && "p-4"} text-center`}>
  //             <Transition.Child
  //               as={Fragment}
  //               enter="ease-out duration-300"
  //               enterFrom="opacity-0 scale-95"
  //               enterTo="opacity-100 scale-100"
  //               leave="ease-in duration-200"
  //               leaveFrom="opacity-100 scale-100"
  //               leaveTo="opacity-0 scale-95"
  //               >
  //               <Dialog.Panel className={`transform overflow-auto rounded-lg bg-white p-2 
  //               text-left align-middle shadow-xl transition-all w-full ${className} ${allowFullScreen && "h-screen sm:h-full"}`}>
  //                 {showHeader&&
  //                 <Dialog.Title
  //                 as="h3"
  //                 className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center space-x-12"
  //                 >
  //                   <span>{title}</span>
  //                   <IconButton onClick={close}>
  //                     <CloseIcon/>
  //                      </IconButton>

  //                    </Dialog.Title>
  //                   }
  //                    {/* <input type="text" readOnly className="h-0 w-1 opacity-0"/> */}
  //                    <div className="mt-2">
  //                    {children}
  //                    </div>
  //           </Dialog.Panel>
  //         </Transition.Child>
  //       </div>
  //     </div>
  //   </Dialog>
  // </Transition>
    )
}

export default DialogLayout;