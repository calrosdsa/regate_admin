import { Dna } from "react-loader-spinner"

interface Props{
    className?:string
}
const Loader = ({className =''}:Props) =>{

    return(
        <div className={`${className}`}>
            <Dna
            visible={true}
            height="80"
            width="80"
            ariaLabel="dna-loading"
            wrapperStyle={{}}
            wrapperClass="dna-wrapper"
            />
        </div>
    )
}

export default Loader