import { Transition } from "@headlessui/react"
import ButtonWithLoader from "../button/ButtonWithLoader"
import { useState } from "react"
import { Tooltip } from "react-tooltip"
import { Button, MenuItem, TextField, Typography } from "@mui/material"


const EditComponentSelect = ({items,currentSelected,getItems,updateSelect,tooltipId,contentToolTip,
    label,enableEdit=true}:{
    items:SelectItem[]
    label:string
    currentSelected:SelectItem | undefined
    getItems:()=>void
    updateSelect:(value:string,addLoader:()=>void,removeLoader:()=>void,currentName:string)=>void
    contentToolTip?:JSX.Element
    enableEdit?:boolean
    tooltipId?:string
}) => {
    const [show,setShow] = useState(false)
    const [loading,setLoading] = useState(false)
    const [value,setValue] = useState(currentSelected?.value || "")
    return(
        <div>
             <div className=" flex justify-between items-center space-x-5 py-3">
                <div className="grid">
                    <div className="flex space-x-2 items-center">
                    <Typography fontWeight={500} fontSize={16.5}>{label}</Typography>
                        {(contentToolTip != undefined && tooltipId != undefined) &&
                        <>
                    <Tooltip anchorSelect={`#${tooltipId}`} place="top">
                       {contentToolTip}
                    </Tooltip>
                    <a id={tooltipId} className="w-min">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                    className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                    </svg>
                        </a>
                        </>
                    }
                    </div>
                    {currentSelected != undefined &&
                    <Typography variant="subtitle1" >{currentSelected.name}</Typography>
                    // <span className="text-sm">{currentSelected.name}</span>
                }
                </div>
                {enableEdit &&
                    <Button color="inherit" onClick={()=>{
                        getItems()
                        setShow(!show)
                    }} className=" underline font-medium cursor-pointer">Editar</Button>
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
          <TextField disabled={!enableEdit}
          select
          size="small"
          sx={{mb:1}}
          name="" id="" className="input"  value={value} onChange={(e)=>{
            setValue(e.target.value)
            }}>
            {items.map((item)=>{
                return(
                    <MenuItem 
                    key={item.value} value={item.value}>{item.name}</MenuItem>
                    )
                })}
          </TextField>

                {enableEdit &&
            <ButtonWithLoader
            onClick={()=>{
                  const name = items.find(item=>item.value == value)?.name
                  if(name != undefined){
                      updateSelect(value,()=>setLoading(true),()=>{
                          setLoading(false)
                          setShow(false)
                        },name)
                    }
              }}
              title="Guardar"
              loading={loading}
              />
            }
              {/* <button onClick={()=>edit(()=>setLoading(true),()=>setLoading(false),value)} */}
               {/* className=" button">Guardar Cambios</button> */}
            </Transition>

            </div>
    )
}

export default EditComponentSelect;