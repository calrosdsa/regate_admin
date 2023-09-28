import Loader from "@/components/util/loaders/Loader";
import moment from "moment";


const Deposito = ({deposito,loading}:{
    deposito:Deposito | null
    loading:boolean
}) =>{

    return(
        <div className="w-full">


            <div className="text-lg font-medium bg-gray-200 w-full p-2">Información general sobre el depósito</div>
            {loading &&
            <Loader
            className="flex justify-center mt-10"
            />
        }
            {deposito != null &&

            <div className="grid sm:grid-cols-2 p-2 sm:p-4   gap-6 border-[1px] shadow-lg bg-white">

            <div className="grid">
            <span className=" subtitle">Asunto del depósito</span>
            <span className="text-sm">{deposito.gloss}</span>
            </div>

            <div className="grid">
            <span className=" subtitle">Hora aproximada de la transacción</span>
            <span className="text-sm">{moment(deposito.created_at).utc().format("lll")}</span>
            </div>

            <div className="grid gap-3">
            <span className=" subtitle">Balance</span>
            <div className="grid gird-cols-3 p-1">
                <span className="col-start-1">Ingresos</span>
            <span className="text-sm col-start-3  place-self-center">{deposito.income} {deposito.currency_abb}</span>
            <span className="col-start-1">Tarifa</span>
            <span className="col-start-2">{deposito.tarifa}%</span>
            <span className="text-sm col-start-3 place-self-center">-  {(deposito.income*deposito.tarifa)/100} {deposito.currency_abb}</span>
            <div className="col-start-3 h-[1px]  bg-gray-500 w-full"></div>
            <div className="col-start-1">Total</div>
            <div className="col-start-3 place-self-center text-sm">{deposito.income -((deposito.income*deposito.tarifa)/100)} BOB</div>
            </div>
            </div>

            </div>

    }

        {/* <span className="text-lg font-medium mt-5   ">Archivos adjuntos</span> */}

        </div>
    )
}

export default Deposito;