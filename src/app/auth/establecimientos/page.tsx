"use client"

import Loading from "@/components/util/loaders/Loading";
import { getEstablecimientosUser } from "@/context/actions/account-actions";
import { LOCAL_URL } from "@/context/config";
import { useAppDispatch, useAppSelector } from "@/context/reduxHooks";
import useEffectOnce from "@/core/util/hooks/useEffectOnce";
import { rootEstablecimiento } from "@/core/util/routes";
import { Button, Paper, Typography } from "@mui/material";
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
        <Paper elevation={2} className='sm:w-[400px]  p-2 py-5 rounded-lg'>
            <Typography variant="h6">Establecimientos</Typography>

            <Loading
            loading={uiState.innerLoading}
            className="py-5"
            />
            <div className="grid gap-y-2 mt-4">
            {(establecimientos.length == 0 && !uiState.innerLoading) ?
                <div className="flex flex-col justify-center mt-4 w-full text-center">
                <Typography variant="subtitle2">No tienes establecimientos para administrar</Typography>

                <div className="w-full flex justify-center mt-5">
                    <Button LinkComponent={Link} href={`${LOCAL_URL}/auth/login`}>
                    Volver al inicio de sesión
                    </Button>
                </div>

                </div>
                :
                establecimientos.map((item,idx)=>{
                    return(
                        <Button key={idx} color="inherit" variant="outlined"
                        LinkComponent={Link} href={`${rootEstablecimiento}/${item.uuid}`}>
                        {item.name}
                        </Button>
                            // <Link href={`${rootEstablecimiento}/${item.uuid}`} className="card"
                            // key={idx}>
                            // {item.name}
                            // </Link>
                    )
                })}
            </div>
        </Paper>
    )
}

export default Page;