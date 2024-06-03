import DialogLayout from "@/presentation/util/dialog/DialogLayout";
import ValueLabel from "@/presentation/util/text/ValueLabel";
import { getEstadoEvento } from "../EventoListTable";
import ButtonSubmit from "@/presentation/util/button/ButtonSubmit";
import { FormEvent, useEffect, useState } from "react";
import { EventoEstado } from "@/core/type/enums";
import { eventoEstados } from "@/core/util/data";
import SelectComponent from "@/presentation/util/input/SelectCompenent";
import InputWithIcon from "@/presentation/util/input/InputWithIcon";
import { toast } from "react-toastify";
import { successfulMessage, unexpectedError } from "@/context/config";
import { EditEventoAmount } from "@/core/repository/evento";

const EditAmountEventoDialog = ({
  evento,
  open,
  close,
  update,
  uuid,
  editEventoAmount
}: {
  evento: Evento;
  open: boolean;
  close: () => void;
  update:(evento:Evento)=>void
  uuid:string,
  editEventoAmount:(b:EditEventoAmountRequest)=>Promise<void>
}) => {
    const [loading,setLoading] = useState(false)
    const [errorMessage,setErrorMessage] = useState<string | undefined>(undefined)
    const [eventoTmp,setEventoTmp] = useState(evento)
    const [formData,setFormData] = useState({
        paid:evento.paid?.toString() || "0",
        estado:evento.estado.toString()
    })
    const {paid,estado} = formData

    const onSumbit = async(e:FormEvent<HTMLFormElement>) =>{
        try{
            setLoading(true)
            e.preventDefault()
            const body:EditEventoAmountRequest = {
                establecimiento_uuid:uuid,
                evento:eventoTmp
            }
            await editEventoAmount(body)
            update(eventoTmp)
            toast.success(successfulMessage)
            setLoading(false)
            close()
        }catch(err){
            toast.error(unexpectedError)
            setLoading(false)
            console.log(err)
        }
    }
    useEffect(() => {
        setEventoTmp({
          ...eventoTmp,
          paid: Number(formData.paid),
          estado: Number(formData.estado),
        });
      }, [formData]);
  return (
    <DialogLayout
      open={open}
      close={close}
      title="Completar el monto del evento."
    >
      <div className="grid gap-3">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <ValueLabel
            label="Precio Total"
            value={eventoTmp.total_price?.toString() || "-"}
          />

          <ValueLabel
            label="Cantidad Pagada"
            value={eventoTmp.paid?.toString() || "-"}
          />

          <ValueLabel label="Estado" value={getEstadoEvento(eventoTmp.estado)} />
        </div>

        <form onSubmit={onSumbit}>
        <InputWithIcon
            value={paid}
            onChange={(e) => {
              const p = Number(e.target.value);
              setFormData({
                ...formData,
                paid: e.target.value,
                estado:
                  p >= Number(eventoTmp.total_price)
                    ? EventoEstado.Valid.toString()
                    : EventoEstado.Pendiente.toString(),
              });
              if  (p > Number(eventoTmp.total_price)){
                setErrorMessage("El monto pagado no puede exceder el monto total.")
              }else{
                setErrorMessage(undefined)
              }
            }}
            label="Cantidad pagada"
            type="number"
            name="paid"
            error={errorMessage}
          />

        <SelectComponent
            label="Estado"
            testId="s-estado"
            items={eventoEstados}
            onChange={(e) => {
              setFormData({
                ...formData,
                estado: e.target.value,
              });
              // setFilterDataReporte({...filterDataReporte,estado:v == "undefinded"? undefined:Number(v)})
            }}
            name="estado"
            value={estado}
          />

          <ButtonSubmit loading={loading} title="Guardar cambios" />
        </form>

      </div>
    </DialogLayout>
  );
};

export default EditAmountEventoDialog;
