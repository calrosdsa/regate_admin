import { AnyAction, ThunkAction } from "@reduxjs/toolkit"
import { RootState } from "../store"
import axios from "axios"
import { uiActions } from "../slices/uiSlice"
import { UserRol } from "@/core/type/enums"
import { GetEstablecimientos } from "@/core/repository/establecimiento"
import { accountActions } from "../slices/accountSlice"
import { adminRoutes, rootEstablecimiento } from "@/core/util/routes"



export const login = (email:string,password:string) :ThunkAction<void,RootState,undefined,AnyAction> =>{
    return async(dispatch)=>{
        try{
            dispatch(uiActions.setInnerLoading(true))
            const res = await fetch(`../api`,{
                 method:"POST",
                 body:JSON.stringify({email,password})
            })
             if (!res.ok) {
                 throw new Error('Failed to fetch data')
               }
             const data:LoginResponse =await res.json()
             localStorage.setItem("user",JSON.stringify(data.user))
             dispatch(uiActions.setInnerLoading(false))
             console.log(data.user.rol)
             switch(data.user.rol){
                case UserRol.ADMIN_USER_ROL:
                    window.location.assign(adminRoutes.manage.establecimientos)
                    break;
                case UserRol.CLIENT_USER_ROL:
                    const res = await fetch("../../api/account/establecimientos")
                    const data:EstablecimientoUser[] = await res.json()
                    if(data.length >0){
                        window.location.assign(`${rootEstablecimiento}/${data[0].uuid}`)
                    }
                    break;
             }
            dispatch(uiActions.setInnerLoading(false))
        }catch(e){
            dispatch(uiActions.setInnerLoading(false))
            console.log(e)
        }
    }
}
export const getEstablecimientosUser = () :ThunkAction<void,RootState,undefined,AnyAction> =>{
    return async(dispatch)=>{
        try{
            dispatch(uiActions.setInnerLoading(true))
            const res = await fetch("../../api/account/establecimientos")
            const data:EstablecimientoUser[] = await res.json()
            dispatch(accountActions.setEstablecimientos(data))
            dispatch(uiActions.setInnerLoading(false))
        }catch(e){
            dispatch(uiActions.setInnerLoading(false))
            console.log(e)
        }
    }
}

export const getEstablecimientos = () :ThunkAction<void,RootState,undefined,AnyAction> =>{
    return async(dispatch)=>{
        try{
            dispatch(uiActions.setInnerLoading(true))
            const data:EstablecimientoData[] = await GetEstablecimientos()
            console.log(data,"establecmimentos")
            // dispatch(accountActions.setEstablecimientos(data))
            dispatch(uiActions.setInnerLoading(false))
        }catch(e){
            dispatch(uiActions.setInnerLoading(false))
            console.log(e)
        }
    }
}
