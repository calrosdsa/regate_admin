import Image from "next/image"
import EditComponent from "../util/input/EditComponent"
import EditComponentImage from "../util/input/EditComponentImage"

const InstalacionDetail = ({instalacion}:{
    instalacion:Instalacion
}) =>{
    return(
        <div className="grid gap-y-3">
            {/* <button className="button w-min rounded-lg">Editar</button> */}
            <span className="text-xl py-2 font-medium">Instalacion Info</span>
           <EditComponent
           label="Titulo"
           content={instalacion.name}
           />
            <EditComponent
           label="Descripcion"
           content={instalacion.description}
           />

            {/* <div className=" flex justify-between space-x-5 items-center">
                <div className="grid">
                    <span className="label">Descripcion</span>
                    <p className="help-text">{instalacion.description}</p>
                </div>
                <span className=" underline font-medium cursor-pointer">Edit</span>
            </div> */}


            <EditComponentImage
            label="Portada"
            src={instalacion.portada}
            />
           
        </div>
    )
}
export default InstalacionDetail

