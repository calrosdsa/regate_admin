

const SelectComponent = ({items,value,onChange,required=true,name,label}:{
    items:SelectItem[]
    value:string
    onChange:(e:React.ChangeEvent<HTMLSelectElement>)=>void
    required?:boolean
    name:string
    label?:string
}) =>{
    
    return(
        
        <div className="mt-3">
            {label != undefined &&
        <label className="label">{label}</label>
            }
        <select required={required}
        className="input" name={name} value={value} onChange={onChange}>
            <option value=""></option>
            {items.map((item,index)=>{
                return(
                    <option key={index} value={item.value}>{item.name}</option>
                    )
                })}
        </select>
        </div>

    )
}

export default SelectComponent;