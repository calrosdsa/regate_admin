import { Transition } from "@headlessui/react"
import { useState } from "react"


const EditComponent =  ({label,content}:{
    label:string
    content:string
}) =>{
    const [show,setShow] = useState(false)
    const [value,setValue] = useState(content)
    return(
        <div>
             <div className=" flex justify-between items-center space-x-5 border-b-[1px] pb-3">
                <div className="grid">
                    <span className="label">{label}</span>
                    <span className="text-sm">{content}</span>
                </div>
                <span onClick={()=>setShow(!show)} className=" underline font-medium cursor-pointer">Edit</span>
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

export default EditComponent;