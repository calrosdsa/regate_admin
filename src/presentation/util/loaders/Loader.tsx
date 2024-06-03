import { Dna } from "react-loader-spinner"
import Loading from "./Loading"
import { CircularProgress } from "@mui/material"

interface Props{
    className?:string
    text?:string
}
const Loader = ({className ='',text="Cargando"}:Props) =>{

    return(
        <div className={`${className}`}>
            <div className="flex space-x-2 items-center">
            <CircularProgress size={15} />
        <span>{text}</span>
            </div>
            {/* <Dna
            visible={true}
            height="80"
            width="80"
            ariaLabel="dna-loading"
            wrapperStyle={{}}
            wrapperClass="dna-wrapper"
            /> */}
        </div>
    )
}

export default Loader