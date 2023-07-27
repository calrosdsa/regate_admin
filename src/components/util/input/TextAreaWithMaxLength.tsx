import { ChangeEvent } from "react"


const TextAreaWithMaxLength = ({max,value,onChangeValue,label,name}:{
    max:number
    value:string
    name:string
    label:string
    onChangeValue:(e:ChangeEvent<HTMLTextAreaElement>)=>void
}) =>{

    return (
        <div className="relative">
           <div>
            <span className="help-text">{label}</span>
            <textarea  onChange={onChangeValue} className="textarea" value={value}
            name={name} rows={5}/>
          </div>
        <span className="help-text absolute right-1">{`${value.length}/${max}`}</span>
        </div>
    )
}

export default TextAreaWithMaxLength;