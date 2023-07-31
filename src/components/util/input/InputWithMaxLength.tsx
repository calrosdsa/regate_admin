import { ChangeEvent } from "react"


const InputWithMaxLength = ({max,value,onChangeValue,label,name,required = false,type = "text"}:{
    max?:number
    value:string
    name:string
    label:string
    required?:boolean
    type?:string
    onChangeValue:(e:ChangeEvent<HTMLInputElement>)=>void
}) =>{

    return (
        <div className="relative">
           <div>
            <span className="help-text">{label}</span>
            <input type={type} onChange={onChangeValue} className="input" value={value}
            name={name} required={required}/>
          </div>
          {max != undefined &&
           <span className="help-text absolute right-1">{`${value.length}/${max}`}</span>
          }
        </div>
    )
}

export default InputWithMaxLength;