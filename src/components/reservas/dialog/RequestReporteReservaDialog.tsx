import ButtonSubmit from "@/components/util/button/ButtonSubmit";
import DialogLayout from "@/components/util/dialog/DialogLayout";
import InputWithIcon from "@/components/util/input/InputWithIcon";
import { ChangeEvent, FormEvent, useState } from "react";


const RequestReporteReservaDialog = ({uuid,open,close}:{
    uuid:string
    open:boolean
    close:()=>void
}) => {
    const [loading,setLoading] = useState(false)
    const [filterDataReporte,setFilterDateReporte] = useState<ReservaReporteRequest>({
        start_date:"",
        end_date:"",
        instalaciones:[],
        establecimiento_uuid:uuid
    })
    const {end_date,start_date,instalaciones,establecimiento_uuid} = filterDataReporte

    const onChange = (e:ChangeEvent<HTMLInputElement>) => {

    }

    const onSubmit = (e:FormEvent<HTMLFormElement>)=>{
        try{
            // dispatch(downloadReporteReservasExcel(filterDataReporte))
        }catch(e){

        }
    }

    return (
      <DialogLayout
      open={open}
      close={close}
      title="Exportar excel"
      className="max-w-sm"
      >
        <form onSubmit={onSubmit}>
            <div className="grid grid-cols-1  sm:grid-cols-2">

            <InputWithIcon
            type="date"
            label="Inicio"
            value={start_date}
            onChange={onChange}
            name="start_date"
            />
             <InputWithIcon
            type="date"
            label="Fin"
            value={start_date}
            onChange={onChange}
            name="start_date"
            />
            </div>

            

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

