

const TruncateText = ({maxLength,text,classNameText=""}:{
    maxLength:number
    text:string
    classNameText?:string
}) =>{

    return (
        <div>
            <span className={classNameText}>
                {text == "" ? 
                " - "
                :
                text.slice(0,maxLength) + (text.length > maxLength ? "...":"")
            }
            </span>
        </div>
    )
}

export default TruncateText;