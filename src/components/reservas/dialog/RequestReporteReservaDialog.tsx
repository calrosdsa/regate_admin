import ButtonSubmit from "@/components/util/button/ButtonSubmit";
import DialogLayout from "@/components/util/dialog/DialogLayout";
import InputDate from "@/components/util/input/InputDate";
import InputWithIcon from "@/components/util/input/InputWithIcon";
import MultiSelectComponent from "@/components/util/input/MultiSelectComponent";
import SelectComponent from "@/components/util/input/SelectCompenent";
import { downloadReporteReservasExcel } from "@/context/actions/download-actions";
import { useAppDispatch } from "@/context/reduxHooks";
import { ReservaEstado } from "@/core/type/enums";
import { reservaEstados } from "@/core/util/data";
import moment from "moment";
import { ChangeEvent, FormEvent, useState } from "react";



const RequestReporteReservaDialog = ({uuid,open,close,instalacionOptions}:{
    uuid:string
    open:boolean
    close:()=>void
    instalacionOptions:Instalacion[]
}) => {
    const dispatch = useAppDispatch()
    const [loading,setLoading] = useState(false)
    const [filterDataReporte,setFilterDataReporte] = useState<ReservaReporteRequest>({
        start_date:"",
        end_date:"",
        instalaciones:[],
        establecimiento_uuid:uuid,
        estado:undefined
    })
    const {end_date,start_date,instalaciones} = filterDataReporte

    const onChange = (e:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFilterDataReporte({
            ...filterDataReporte,
            [e.target.name]:e.target.value
        })
    }

    const onSubmit = (e:FormEvent<HTMLFormElement>)=>{
        try{
            e.preventDefault()
            if(filterDataReporte.estado == -1){
                filterDataReporte.estado = undefined
            }
            if(filterDataReporte.instalaciones.includes(0)){
                console.log("include 0")
                filterDataReporte.instalaciones = []
            }
            console.log(filterDataReporte)
            dispatch(downloadReporteReservasExcel(filterDataReporte))
        }catch(e){
        }
    }

    return (
      <DialogLayout
      open={open}
      close={close}
      title="Exportar excel"
      className="max-w-md"
      >
        <form onSubmit={onSubmit} className="w-full">
            <div className="grid grid-cols-1  sm:grid-cols-2 gap-x-2 w-full">
                <InputDate
                value={moment(start_date)}  
                maxDate={moment(end_date)} 
                onChange={(e)=>{
                    setFilterDataReporte({
                        ...filterDataReporte,
                        start_date:e.format("YYYY-MM-DD")
                    })
                }}
                />
                 <InputDate
                value={moment(end_date)} 
                minDate={moment(start_date)} 
                onChange={(e)=>{
                    setFilterDataReporte({
                        ...filterDataReporte,
                        end_date:e.format("YYYY-MM-DD")
                    })
                }}
                />
            {/* <InputWithIcon
            type="date"
            label="Inicio"
            value={start_date}
            onChange={onChange}
            name="start_date"
            />
             <InputWithIcon
            type="date"
            label="Fin"
            value={end_date}
            onChange={onChange}
            name="end_date"
            /> */}
            </div>

            <MultiSelectComponent
            options={[...instalacionOptions.map((item)=>{ return {value:item.id.toString(),name:item.name}}),{name:"Todo",value:"0"}]}
            label="Canchas"
            allValue="0"
            allName="Todo"
            setInstalaciones={(e)=>setFilterDataReporte({
                ...filterDataReporte,
                instalaciones:e
            })}
            />

            <SelectComponent
            label="Estado"
            size="medium"
            items={reservaEstados.concat({name:"Cancelado",value:ReservaEstado.Cancel.toString()})}
            onChange={(e)=>{
                const v = e.target.value
                console.log(v,Number(v))
                setFilterDataReporte({...filterDataReporte,estado:v == "undefinded"? undefined:Number(v)})
            }}
            name="estado"
            value={filterDataReporte.estado?.toString()||"-1"}
            />
            

            <div className="flex justify-end pb-2">
            <ButtonSubmit
            loading={loading}
            title="Exportar"
            className="w-min"
            />
            </div>
        </form>
      </DialogLayout>
    )
}

export default RequestReporteReservaDialog;


