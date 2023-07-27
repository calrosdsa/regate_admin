import { ChangeEvent } from "react"


const InputWithMaxLength = ({max,value,onChangeValue,label,name,required = false}:{
    max:number
    value:string
    name:string
    label:string
    required?:boolean
    onChangeValue:(e:ChangeEvent<HTMLInputElement>)=>void
}) =>{

    return (
        <div className="relative">
           <div>
            <span className="help-text">{label}</span>
            <input type="text" onChange={onChangeValue} className="input" value={value}
            name={name} required={required}/>
          </div>
        <span className="help-text absolute right-1">{`${value.length}/${max}`}</span>
        </div>
    )
}

export default InputWithMaxLength;