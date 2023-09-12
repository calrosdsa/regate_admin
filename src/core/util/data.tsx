import { EstadoVisibility } from "../type/enums";


export const estadoVisibility:SelectItem[] = [
    {
        name:"Habilitado",
        value:EstadoVisibility.ENABLED.toString(),
    },
    {
        name:"Deshabilitado",
        value:EstadoVisibility.DISABLED.toString()
    }
]
