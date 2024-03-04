"use client"

import Loading from "@/components/util/loaders/Loading";
import { getEstablecimientosUser } from "@/context/actions/account-actions";
import { LOCAL_URL } from "@/context/config";
import { useAppDispatch, useAppSelector } from "@/context/reduxHooks";
import useEffectOnce from "@/core/util/hooks/useEffectOnce";
import { rootEstablecimiento } from "@/core/util/routes";
import Link from "next/link";

const Page = ({params}:{
    params:{uuid:string}
}) => {
    const dispatch = useAppDispatch()
    const establecimientos = useAppSelector(state=>state.account.establecimientos)
    const uiState = useAppSelector(state=>state.ui)
    useEffectOnce(()=>{
        if(establecimientos.length == 0){
            dispatch(getEstablecimientosUser())
        }
    })
    return (
        <div className='sm:w-[400px] bg-gray-50 p-2 py-10 rounded-lg'>
            <span className="text-lg subtitle">Establecimientos</span>

            <Loading
            loading={uiState.innerLoading}
            className="py-5"
            />
            <div className="grid gap-y-2 mt-2">
            {(establecimientos.length == 0 && !uiState.innerLoading) ?
                <div className="flex flex-col justify-center mt-10">
                <span className="title">No tienes establecimientos para administrar</span>

                <div className="w-full flex justify-center mt-2">
               
                    <Link className="text-button w-min whitespace-nowrap noSelect"
                     href={`${LOCAL_URL}/auth/login`}>Volver al inicio de sesión</Link>
                </div>

                </div>
                :
                establecimientos.map((item,idx)=>{
                    return(
                            <Link href={`${rootEstablecimiento}/${item.uuid}`} className="card"
                            key={idx}>
                            {item.name}
                            </Link>
                    )
                })}
            </div>
        </div>
    )
}

export default Page;