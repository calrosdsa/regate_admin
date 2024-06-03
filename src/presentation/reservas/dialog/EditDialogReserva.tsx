import DialogLayout from "@/presentation/util/dialog/DialogLayout";
import InputWithIcon from "@/presentation/util/input/InputWithIcon";
import { FormEvent, useEffect, useState } from "react";
import { getEstadoReserva } from "../ReservaList";
import SelectComponent from "@/presentation/util/input/SelectCompenent";
import { reservaEstados } from "@/core/util/data";
import ButtonSubmit from "@/presentation/util/button/ButtonSubmit";
import { CheckTimeExtra, EditReserva } from "@/core/repository/reservas";
import { toast } from "react-toastify";
import { successfulMessage, unexpectedError } from "@/context/config";
import moment from "moment";
import { Typography } from "@mui/material";
import ValueLabel from "@/presentation/util/text/ValueLabel";
import { Http, ReservaEstado } from "@/core/type/enums";

const EditReservaDialog = ({
  open,
  close,
  reserva,
  update,
  uuid,
}: {
  open: boolean;
  close: () => void;
  reserva: Reserva;
  update: (r: Reserva) => void;
  uuid: string;
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    paid: reserva.paid.toString(),
    estado: reserva.estado.toString(),
    extra_time: "0",
  });
  const { paid, estado, extra_time } = formData;
  const [reservaTmp, setReservaTmp] = useState(reserva);
  const [errorMessage,setErrorMessage] = useState<string | undefined>(undefined)

  const checkTimeExtra = async (extraTime: string) => {
    try {
      setLoading(true);
      const body: TimeExtraReservaRequest = {
        minutes: Number(extraTime),
        start_from: reserva.end_date,
        instalacion_id: reserva.instalacion_id,
        establecimiento_uuid: uuid,
      };
      console.log(body);
      const res = await CheckTimeExtra(body);
      let data;
      switch (res.status) {
        case Http.StatusOk:
          data = (await res.json()) as TimeExtraReservaResponse;
          const totalPrice = reservaTmp.total_price + Number(data.total_price)
          setReservaTmp({
            ...reservaTmp,
            total_price: totalPrice,
            end_date: moment(reserva.end_date)
              .utc()
              .add(Number(extraTime), "minutes")
              .format(),
          });
          setFormData({
            ...formData,
            estado:  Number(paid) >= totalPrice
            ? ReservaEstado.Valid.toString()
            : ReservaEstado.Pendiente.toString(),
            extra_time: extraTime,
          })
          break;
        case Http.StatusNotAcceptable:
          data = (await res.json()) as ResponseMessage;
          toast.error(data.message);
          break;
      }  
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setLoading(true);
      const r: ReservaEditRequest = {
        id: reserva.id,
        amount: Number(paid),
        estado: Number(estado),
        reserva_uuid: reserva.uuid,
        extra_time: Number(extra_time),
        start_date: reserva.start_date,
        end_date: reserva.end_date,
      };
      await EditReserva(r);
      setLoading(false);
      toast.success(successfulMessage);
      update(reservaTmp);
      close();
    } catch (err) {
      setLoading(false);
      toast.error(unexpectedError);
    }
  };
  useEffect(() => {
    setReservaTmp({
      ...reservaTmp,
      paid: Number(formData.paid),
      estado: Number(formData.estado),
    });
  }, [formData]);
  return (
    <DialogLayout open={open} close={close} title="Editar reserva">
      <div className="grid gap-3">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <ValueLabel
            label="Precio Total"
            value={reservaTmp.total_price.toString()}
          />

          <ValueLabel
            label="Cantidad Pagada"
            value={reservaTmp.paid.toString()}
          />

          <ValueLabel
            label="Estado"
            value={getEstadoReserva(reservaTmp.estado)}
          />

          <ValueLabel
            label="Fecha y Hora de la Reserva"
            className="col-span-full"
            value={`${moment.utc(reservaTmp.start_date).format("ll")} de 
                ${moment.utc(reservaTmp.start_date).format("LT")} a
                ${moment.utc(reservaTmp.end_date).format("LT")}`}
          />
        </div>

        <form onSubmit={onSubmit}>
          <InputWithIcon
            value={paid}
            onChange={(e) => {
              const p = Number(e.target.value);
              setFormData({
                ...formData,
                paid: e.target.value,
                estado:
                  p >= reservaTmp.total_price
                    ? ReservaEstado.Valid.toString()
                    : ReservaEstado.Pendiente.toString(),
              });
              if  (p > reservaTmp.total_price){
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
            items={reservaEstados.slice(1, reservaEstados.length)}
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

          <SelectComponent
            label="Tiempo extra"
            testId="s-extra-time"
            required={false}
            items={[
              { value: "30", name: "30 minutos" },
              { value: "60", name: "1 hora" },
              { value: "90", name: "1.5 horas" },
              { value: "120", name: "2 horas" },
              { value: "150", name: "2.5 horas" },
              { value: "180", name: "3 horas" },
              { value: "210", name: "3.5 horas" },
              { value: "240", name: "4 horas" },
            ]}
            onChange={(e) => {
            //   setFormData({
            //     ...formData,
            //     extra_time: e.target.value,
            //   });
              checkTimeExtra(e.target.value);
            }}
            name="extra_time"
            value={extra_time}
          />

          <ButtonSubmit
           loading={loading} title="Guardar cambios" />
        </form>
      </div>
    </DialogLayout>
  );
};

export default EditReservaDialog;
