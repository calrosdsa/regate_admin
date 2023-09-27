import { Transition } from "@headlessui/react"
import { useState } from "react"
import ButtonWithLoader from "../button/ButtonWithLoader"


const EditComponent =  ({label,content,edit,type="text",isTextArea=false}:{
    label:string
    content:string
    type?:string
    isTextArea?:boolean
    edit:(addLoader:()=>void,removeLoader:()=>void,value:string)=>void
}) =>{
    const [show,setShow] = useState(false)
    const [loading,setLoading] = useState(false)
    const [value,setValue] = useState(content)
    return(
        <div>
             <div className=" flex justify-between items-center space-x-5 py-3 divider">
                <div className="grid">
                    <span className="label">{label}</span>
                    <span className="text-sm">{content}</span>
                </div>
                <span onClick={()=>setShow(!show)} className=" underline font-medium cursor-pointer">Edit</span>
            </div>
            <Transition
            show={show}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
            >

            {isTextArea ?
                <textarea autoFocus className="textarea mt-4" value={value} onChange={(e)=>setValue(e.target.value)}
                rows={5}/> 
                :
                <input autoFocus type={type} className="input mt-4" value={value} onChange={(e)=>setValue(e.target.value)}
                onKeyDown={(e)=>{
                    if(e.key == "Enter"){
                        edit(()=>setLoading(true),()=>{
                setLoading(false)
                setShow(false)
            },value)
                    }
                }}
                />
            }


              <ButtonWithLoader
              onClick={()=>edit(()=>setLoading(true),()=>{
                setLoading(false)
                setShow(false)
            },value)}
              title="Guardar"
              loading={loading}
              className="mt-2 w-28"
              />
              {/* <button onClick={()=>edit(()=>setLoading(true),()=>setLoading(false),value)} */}
               {/* className=" button">Guardar Cambios</button> */}
            </Transition>
        </div>
    )
}

export default EditComponent;