import { Dialog, Transition } from "@headlessui/react";
import Loader from "../loaders/Loader";
import { useEffect, useState } from "react";
import { Divider, IconButton, Paper, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
const InfoBar = ({open,close,infoText,loading}:{
    close:()=>void
    open:boolean
    infoText?:InfoText
    loading:boolean
}) => {
    const [data,setData] = useState<InfoTextItem[]>([])

    useEffect(()=>{
        if(infoText != undefined){
            try{
                const newData:InfoTextContent = JSON.parse(infoText.content)
                setData(newData.data)
            }catch(err){
                
            }
        }
    },[infoText])

    return(
        <>
        <Transition.Root show={open} as='div'>
        <Dialog 
            as='div'
            className='fixed  inset-0 overflow-hidden z-20'
            onClose={()=>close()}
        >
            <div className='absolute inset-0 overflow-hidden '>
            <Transition.Child
                as='div'
                enter='ease-in-out duration-400'
                enterFrom='opacity-0'
                enterTo='opacity-100'
                leave='ease-in-out duration-400'
                leaveFrom='opacity-100'
                leaveTo='opacity-0'
            >
                <Dialog.Overlay className='absolute  inset-0 transition-opacity' />
            </Transition.Child>
            <div className='fixed right-0'>
                <Transition.Child
                as='div'
                enter='transform transition ease-in-out duration-400 '
                enterFrom='translate-x-96'
                enterTo='translate-x-0'
                leave='transform transition ease-in-out duration-400 '
                leaveFrom='translate-x-0'
                leaveTo='translate-x-96'
                >
                <div className='relative max-w-lg '>
                    <Transition.Child
                    as='div'
                    enter='ease-in-out duration-400'
                    enterFrom='opacity-0'
                    enterTo='opacity-100'
                    leave='ease-in-out duration-400'
                    leaveFrom='opacity-100'
                    leaveTo='opacity-0'
                    >
                    
                    </Transition.Child>
                    <Paper elevation={2} className='h-screen w-80 p-2 shadow-lg'> 
                    <div className=' flex justify-between items-center pb-2'>
                        <div>
                            {infoText != undefined &&
                            <Typography className="title text-lg">{infoText.title}</Typography>
                            }    
                        </div>
                        <IconButton  onClick={()=>close()}>
                            <CloseIcon/>
                        </IconButton>
                
                    </div>
                    <Divider/>

                    {loading ?
                    <Loader
                    text="Cargando contenido"
                    className="w-full pt-2  justify-center flex "
                    />
                    :
                        <>
                        {infoText != undefined &&
                        <div>
                            {/* {JSON.stringify(data)} */}
                            {data.map((item,index)=>{
                                return(
                                    <div key={index} className="grid pt-2">
                                        <Typography variant="subtitle2">{item.subtitle}</Typography>
                                        <Typography variant="body1" fontSize={13} className=" text-sm pt-1">{item.content}</Typography>
                                    </div>
                                )
                            })}
                        </div>
                        }
                        </>
                    }
                        </Paper>

                    </div>

                </Transition.Child>
            </div>
        </div>
        </Dialog>
        </Transition.Root>

        </> 
    )
}

export default InfoBar;