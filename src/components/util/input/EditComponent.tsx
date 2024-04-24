import { Transition } from "@headlessui/react"
import { useState } from "react"
import ButtonWithLoader from "../button/ButtonWithLoader"
import { Button, TextField, Typography } from "@mui/material"
import { LoadingButton } from "@mui/lab"


const EditComponent =  ({label,content,edit,type="text",multiline=false,enableEdit=true,disabled=false}:{
    label:string
    content:string
    type?:string
    disabled?:boolean
    enableEdit?:boolean
    multiline?:boolean
    edit?:(addLoader:()=>void,removeLoader:()=>void,value:string)=>void
}) =>{
    const [show,setShow] = useState(false)
    const [loading,setLoading] = useState(false)
    const [value,setValue] = useState(content)
    return(
        <div>
             <div className=" flex justify-between items-center space-x-5 py-3">
                <div className="grid">
                    <Typography fontWeight={500} fontSize={16.5}>{label}</Typography>
                    <Typography variant="subtitle1" >{content}</Typography>
                </div>
                {enableEdit &&
                    <Button disabled={disabled} onClick={()=>setShow(!show)} color="inherit">
                        <span className=" underline font-medium">Editar</span>
                    </Button>
                }
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
                <div>
                <TextField
                size="small"
                value={value}
                onChange={(e)=>setValue(e.target.value)}
                multiline={multiline}
                sx={{width:"100%"}}
                onKeyDown={(e)=>{
                    if(e.key == "Enter"){
                        if(edit == undefined) return
                        edit(()=>setLoading(true),()=>{
                        setLoading(false)
                        setShow(false)
                },value)
                    }
                }}
                />
            {/* {multiline ?
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
            } */}


              <LoadingButton
              variant="contained"
              onClick={()=>{
                if(edit == undefined) return
                edit(()=>setLoading(true),()=>{
                setLoading(false)
                setShow(false)
            },value)
              }}
              loading={loading}
              sx={{mt:1}}
              >Guardar</LoadingButton>
              {/* <button onClick={()=>edit(()=>setLoading(true),()=>setLoading(false),value)} */}
               {/* className=" button">Guardar Cambios</button> */}
              </div>
            </Transition>
        </div>
    )
}

export default EditComponent;