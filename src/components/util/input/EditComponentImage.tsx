import { Transition } from "@headlessui/react"
import Image from "next/image"
import { useState } from "react"
import CommonImage from "../image/CommonImage"


const EditComponentImage =  ({label,src}:{
    label:string
    src:string
}) =>{
    const [show,setShow] = useState(false)
    const [value,setValue] = useState(src)
    return(
        <div>
           <div className="flex justify-between space-x-5 items-center">
            <div className="grid gap-y-2">
            <span className="label">{label}</span>
            <CommonImage
            src={src}
            h={200}
            w={250}
            className="rounded-lg w-56 h-40"
            // alt={label}
            />
            </div>
            <span className=" underline font-medium cursor-pointer">Edit</span>
            </div>
            <Transition
            show={show}
            enter="transition-opacity duration-75"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            >
              <textarea  className="input mt-4" value={value} onChange={(e)=>setValue(e.target.value)}/>
            </Transition>
        </div>
    )
}

export default EditComponentImage;