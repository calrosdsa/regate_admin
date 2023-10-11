import Loader from "@/components/util/loaders/Loader";
import { getDepositoEstadoName } from "@/core/repository/billing";
import { DepositoEstado } from "@/core/type/enums";
import moment from "moment";


const Deposito = ({deposito,loading}:{
    deposito:Deposito | null
    loading:boolean
}) =>{

    return(
        <div className="w-full shadow-md">


            <div className="bg-gray-200 w-full p-2 grid">
                <span className="font-medium">Información general sobre el depósito</span>
            <span className="text-xs text-gray-500">Cargos totales e información de pago</span>
            </div>
            {loading &&
            <Loader
            className="flex justify-center mt-10"
            />
        }
            {deposito != null &&
            <div className="border-[1px]  bg-white p-2 sm:p-4">

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 border-b-[1px] pb-2">

            <div className="grid">
            <span className=" subtitle">Asunto del depósito</span>
            <span className="text-sm">{deposito.gloss}</span>
            </div>

            <div className="grid">
            <span className=" subtitle">Periodo de facturación</span>
            <span className="text-lg text-gray-600">{moment(deposito.date_paid).utc().format("l")}</span>
            </div>


            {deposito.estado == DepositoEstado.PENDIENTE &&
            <div className="grid">                
            <span className=" subtitle">Estado de la factura</span>
            <div className="flex space-x-2 text-gray-600 items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
            className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-lg">{getDepositoEstadoName(deposito.estado)}</span>
            </div>
            </div>
            }

            {deposito.estado == DepositoEstado.EMITIDO &&
            <div className="grid gap-y-1">                
            <span className=" subtitle">Estado de la factura</span>
            <div className="flex space-x-2 text-green-600 items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-lg">{getDepositoEstadoName(deposito.estado)}
            {deposito.emition_date != null &&
            <span className="text-gray-600"> {moment(deposito.emition_date).format('l')}</span>
            }
            </span>
            </div>
            </div>
            }


            </div>

            <div className="grid grid-cols-3 gap-3 pt-10">
                <div className=" col-span-full md:col-start-2 md:col-span-2">
            <span className=" subtitle text-lg">Balance</span>
            <div className="grid gird-cols-3 p-1 gap-y-1">
                <span className="col-start-1">Ingresos</span>
            <span className="text-sm col-start-3  place-self-center">{deposito.income} {deposito.currency_abb}</span>
            <span className="col-start-1">Tarifa</span>
            <span className="col-start-2">{deposito.tarifa}%</span>
            <span className="text-sm col-start-3 place-self-center">-  {(deposito.income*deposito.tarifa)/100} {deposito.currency_abb}</span>
            <div className="col-start-3 h-[1px]  bg-gray-500 w-full items-center "></div>
            <div className="col-start-1 text-xl pt-2">Total General</div>
            <div className="col-start-3 place-self-center text-xl pt-2">{deposito.income -((deposito.income*deposito.tarifa)/100)} BOB</div>
            </div>
                </div>


            </div>

        </div>

    }

        {/* <span className="text-lg font-medium mt-5   ">Archivos adjuntos</span> */}

        </div>
    )
}

export default Deposito;