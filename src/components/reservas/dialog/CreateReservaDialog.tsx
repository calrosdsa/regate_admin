import ButtonSubmit from "@/components/util/button/ButtonSubmit";
import DialogHeader from "@/components/util/dialog/DialogHeader";
import DialogLayout from "@/components/util/dialog/DialogLayout";
import CommonImage from "@/components/util/image/CommonImage";
import InputWithIcon from "@/components/util/input/InputWithIcon";
import { useAppSelector } from "@/context/reduxHooks";
import { CreateReserva } from "@/core/repository/reservas";
import { getFullName } from "@/core/util";
import ReactCountryFlag from "react-country-flag"
import moment from "moment";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import SearchInput from "@/components/util/input/SearchInput";
import SearchUserDialog from "./SearchUserDialog";


type CupoRequest = {
    cupos:CupoR[]
    total_price:number
    paid:number
    end_time:string
    instalacion_id:number
    establecimiento_id:number
    establecimiento_uuid:string
    user_empresa:UserEmpresa
}
const CreateReservaDialog = ({open,close,instalacion,reservaCupos,refresh,uuid}:{
    open:boolean
    close:()=>void
    uuid:string
    instalacion:Instalacion
    reservaCupos:CupoReserva[]
    refresh:()=>void
}) => {
    const establecimientosUser = useAppSelector(state=>state.account.establecimientos)
    const [loading,setLoading] = useState(false)
    const [totalPrice,setTotalPrice] = useState(0)
    const [userEmpresa,setUserEmpresa] = useState<null | UserEmpresa>(null)
    const [error,setError] = useState("")

    const [openSearchUserDialog,setOpenSearchUserDialog] = useState(false)
    const [orderedCupo,setOrderedCupos] = useState<CupoReserva[]>([])
    const [formData,setFormData] = useState({
        paid:"",
        name:"",
        phone_number:"",
    })
    const {paid,name,phone_number} = formData
    const onChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData,
            [e.target.name]:e.target.value
        })
    }

    const onSubmit = async(e:React.FormEvent<HTMLFormElement>) => {
        try{
            e.preventDefault()
            setLoading(true)
            if(Number(paid)> totalPrice){
                setError("El importe pagado no debe superar el total de la reserva.")
                setLoading(false)
                return
            }
            const cupos:CupoR[] = reservaCupos.map(item=>{
                return {
                    start_date:item.time,
                    instalacion_id:instalacion.id,
                    precio:item.precio
                }
            })
            
            const requestData:CupoRequest = {
                cupos:cupos,
                instalacion_id:instalacion.id,
                total_price:totalPrice,
                paid:Number(formData.paid),
                end_time:moment(cupos[cupos.length - 1].start_date).utc().add(30,'minutes').toISOString(),
                establecimiento_id:establecimientosUser.find(item=>item.uuid == uuid)?.id || 0,
                establecimiento_uuid:uuid,
                user_empresa:{
                    id:userEmpresa?.id || 0,
                    phone_number:phone_number,
                    name:name
                }
            }
            console.log(requestData,"REQUEST DATA")
            const res = await CreateReserva(JSON.stringify(requestData))
            toast.success("Se ha creado exitosamente la reserva")
            refresh()
            close()
            setLoading(false)
            console.log(res)
        }catch(err){
            setLoading(false)
            console.log(err)
        }
    }
    useEffect(()=>{
        setFormData({
            ...formData,
            paid:totalPrice.toString()
        })
    },[totalPrice])
    useEffect(()=>{
        if(totalPrice == 0){
            setTotalPrice(reservaCupos.map(item=>item.precio).reduce((prev,curr)=>prev + curr) )
        }
        if(orderedCupo.length == 0){
            const newCupos = reservaCupos.sort((left,right)=>{
                return moment.utc(left.time).diff(moment.utc(right.time))
            })
            // console.log(newCupos,"ordered")
            setOrderedCupos(newCupos)
        }
    },[])
    return(
        <>
        {openSearchUserDialog &&
        <SearchUserDialog
        open={openSearchUserDialog}
        close={()=>setOpenSearchUserDialog(false)}
        selectUserEmpresa={(user)=>{
            setFormData({
                ...formData,
                name:user.name,
                phone_number:user.phone_number  
            })
            setUserEmpresa(user)
            setOpenSearchUserDialog(false)
        }}
        />
        }
     <DialogLayout
     allowFullScreen={true}
     className="max-w-lg"
      open={open} close={close} title="Crear reserva">
        <div className='rounded-lg bg-white overflow-auto max-w-xl'>
            <div className="p-2 ">
                    <div className="flex space-x-3">
                    <CommonImage
                        src={instalacion.portada}
                        h={100}
                        w={170}
                        className="rounded-lg"
                        />
                        <span className="text-sm font-semibold">{instalacion.name}</span>
                    </div>
                        <div className="grid">
                        <div className="grid sm:flex sm:justify-between sm:items-center sm:space-x-10 border-b-[1px] py-2">
                            <span className="label">Precio de la reserva</span>
                            <span className="text-xs ">{totalPrice}</span>
                        </div>
                        {orderedCupo.length > 0 &&
                        <div className="grid sm:flex sm:justify-between sm:items-center sm:space-x-10 border-b-[1px] py-2">
                            <span className="label">Fecha y hora de la reserva</span>
                            <span className="text-xs ">
                            {moment.utc(orderedCupo[0].time).format("ll")} de {' '}
                                {moment.utc(orderedCupo[0].time).format("LT")} a {' '}
                                {moment.utc(orderedCupo[orderedCupo.length -1].time).add(30,'minutes').format("LT")} 
                            </span>
                        </div>
                        }
                    </div>
            </div>
              <div onClick={()=>setOpenSearchUserDialog(true)}
                className="button flex space-x-2 mt-2 w-min whitespace-nowrap">
                    <span>Agregar usuario ya registrado</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} 
                    stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
            </svg>
                    </div>
        <form onSubmit={onSubmit}>
            <InputWithIcon
            type="tel"
            label="Monto pagado"
            value={formData.paid}
            name="paid"
            error={error}
            onChange={onChange}
            /> 
            <InputWithIcon
            type="tel"
            label="Nombre Completo"
            value={formData.name}
            name="name"
            error={error}
            onChange={onChange}
            />

           <InputWithIcon
            type="tel"
            label="Número de teléfono."
            value={formData.phone_number}
            name="phone_number"
            className="mb-5"
            error={error}
            onChange={onChange}
            />
             
            <ButtonSubmit
            loading={loading}
            title="Crear Reserva"
            />
        </form>
         </div>   
     </DialogLayout>
    </>
    )
}

export default CreateReservaDialog;