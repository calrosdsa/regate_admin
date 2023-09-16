import { PlacesType, Tooltip } from "react-tooltip"


export const TooltipIcon = ({title,helpText,tooltipId="tooltip",place="top"}:{
    title:string
    helpText:string
    tooltipId?:string
    place?:PlacesType
}) =>{

    return (
        <div className='flex space-x-2 items-center'>
        <span className="label">{title}</span>
      <div className="group flex relative w-full">
        <a id={tooltipId} className="w-min">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
         className="w-5 h-5 cursor-pointer">
<path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
       </svg>
        </a>
        <>
        <Tooltip anchorSelect={`#${tooltipId}`} className="z-10" place={place} noArrow={true}>
          
           {helpText}
        </Tooltip>
      
            </>
      
    </div>
    </div>
    )
}

export const TooltipContainer = ({helpText,children="",className,disabled=false}:{
  helpText:string
  className?:string
  disabled?:boolean
  children:React.ReactNode
}) =>{

  return (
    <>
    {disabled ?
    <>
    {children}
    </>
    :
    <div title={helpText}>
    {children}     
  </div>
      }
    </>
  // <Tooltip anchorSelect=".my-anchor-element" place="top">
  //   Hello world 
  // </Tooltip>
  )
}