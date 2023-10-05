import { Dialog, Transition } from "@headlessui/react";
import Loader from "../loaders/Loader";
import { useEffect, useState } from "react";

const InfoBar = ({open,close,infoText,loading}:{
    close:()=>void
    open:boolean
    infoText?:InfoText
    loading:boolean
}) => {
    const [data,setData] = useState<InfoTextItem[]>([])

    useEffect(()=>{
        if(infoText != undefined){
            const newData:InfoTextContent = JSON.parse(infoText.content)
            setData(newData.data)
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
                    <div className='h-screen bg-white w-80 p-2 shadow-lg'> 
                    <div className=' flex justify-between items-center border-b-[1px] pb-2'>
                        <div>
                            {infoText != undefined &&
                            <span className="title text-lg">{infoText.title}</span>
                            }    
                        </div>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                    className="w-9 h-9 p-1 rounded-full noSelect hover:bg-gray-200 cursor-pointer"
                    onClick={()=>close()}>
                        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                    </svg>
                    </div>

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
                                        <span className="title">{item.subtitle}</span>
                                        <span className=" text-sm pt-1">{item.content}</span>
                                    </div>
                                )
                            })}
                        </div>
                        }
                        </>
                    }
                        </div>
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