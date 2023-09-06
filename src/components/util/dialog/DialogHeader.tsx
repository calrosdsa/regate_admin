interface Props{
    title:string
    close:()=>void
}
const DialogHeader = ({title,close}:Props)=>{

    return(
        <div className="w-full flex justify-between px-2 pt-2">
            <span className="title">{title}</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
            onClick={close} className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
</svg>

        </div>
    )
}

export default DialogHeader;