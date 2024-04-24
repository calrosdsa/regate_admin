import DialogLayout from "@/components/util/dialog/DialogLayout"
import SelectComponent from "@/components/util/input/SelectCompenent"
import { useState } from "react"

const FiterReservasDialog = ({open,close,update,instalaciones}:{
    open:boolean
    close:()=>void
    update:(d:ReservaDataFilter)=>void
    instalaciones:Instalacion[]
}) =>{
    const [selectedInstalacion,setSelectedInstalacion]= useState("0")

    return(
        <DialogLayout
        open={open}
        close={close}
        className=" max-w-lg"
        title="Filtrar"
        >
         <div className="">
         <SelectComponent
                value={selectedInstalacion}
                items={instalaciones.map((t)=>{
                    return {
                        value:t.id.toString(),
                        name:t.name
                    } 
                })}
                onChange={(e)=>{                    
                    setSelectedInstalacion(e.target.value)
                }}
                name={"Instalaciones"}
                defaultItem={{name:"Todas las canchas",value:"0"}}
                />
         </div>

        </DialogLayout>
    )
}

export default FiterReservasDialog;