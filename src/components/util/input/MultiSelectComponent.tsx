import { useEffect, useState } from "react"


const MultiSelectComponent = ({options,label,allName,allValue,setInstalaciones}:{
    options:SelectItem[]
    label?:string
    allValue:string
    allName:string
    setInstalaciones:(e:number[])=>void
}) =>{
    const [selected,setSelected] = useState<SelectItem[]>([{name:allName,value:allValue}])
    const removeSelect = (value:string | undefined) =>{
        const filterList = selected.filter(item=>item.value != value)
        setSelected(filterList)
    }
    useEffect(()=>{
        const ids = selected.map(item=>Number(item.value))
        setInstalaciones(ids)
    },[selected])
    return(
        <div className="mt-3">
            {label != undefined &&
                <label className="label">{label}</label>
            }
            {selected.length > 0 &&
            <div className="flex space-x-2 mt-1 overflow-auto md:overflow-hidden md:flex-wrap md:space-x-0 md:gap-2 
            pb-1 md:pb-0 mb-2" >
                {selected.map((item,idx)=>{
                    return(
                        <div key={idx} className="card whitespace-nowrap noSelect flex space-x-2">
                            <span>{item.name}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                             className="w-6 h-6 icon-button noSelect" onClick={()=>removeSelect(item.value)}>
                            <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
                            </svg>

                        </div>
                    )
                })}
            </div>
            }

                <select className="md:pt-0 input h-10 " value={""} onChange={(e)=>{
                    const v = e.target.value
                    const item = options.find(t=>t.value == v)
                    if(item != undefined){
                    if(v == allValue){
                        setSelected([item])
                    }else{
                        const filterList = selected.filter(item=>item.value != allValue)
                            setSelected([...filterList,item])
                        }
                    }
                    console.log(e.target.value)
                }}>
                    <option value=""></option>
                    {options
                    .filter(item=>!selected.map(t=>t.value).includes(item.value)).map((item,idx)=>{
                        return(
                            <option key={idx} value={item.value}>{item.name}</option>
                        )
                    })}
                </select>
            </div>
    )
}

export default MultiSelectComponent