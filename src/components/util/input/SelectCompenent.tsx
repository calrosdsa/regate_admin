

const SelectComponent = ({items,value,onChange,required=true,name,label,containerClassName="mt-3",
defaultItem}:{
    items:SelectItem[]
    value:string
    onChange:(e:React.ChangeEvent<HTMLSelectElement>)=>void
    required?:boolean
    name:string
    defaultItem?:SelectItem
    label?:string
    containerClassName?:string
}) =>{
    
    return(
        
        <div className={`${containerClassName}`}>
            {label != undefined &&
        <label className="label">{label}</label>
            }
        <select required={required}
        className="input" name={name} value={value} onChange={onChange}>
            <option value={defaultItem?.value}>{defaultItem?.name}</option>
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