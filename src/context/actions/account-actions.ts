import { AnyAction, ThunkAction } from "@reduxjs/toolkit"
import { RootState } from "../store"
import axios from "axios"
import { uiActions } from "../slices/uiSlice"
import { HttpStatusCode, UserEstado, UserRol } from "@/core/type/enums"
import { GetEstablecimientos } from "@/core/repository/establecimiento"
import { accountActions } from "../slices/accountSlice"
import { adminRoutes, rootEstablecimiento } from "@/core/util/routes"
import { toast } from "react-toastify"
import { redirectToLogin } from "."
import { LOCAL_URL, unexpectedError } from "../config"



export const getUser  = () :ThunkAction<void,RootState,undefined,AnyAction> =>{
    return async(dispatch)=>{
        try{
            const userLocal = localStorage.getItem("user")
            if(userLocal!= null){
                const user:User = JSON.parse(userLocal)
                dispatch(accountActions.setUser(user))
            }
        }catch(err){
        }
    }
}

export const logout  = () :ThunkAction<void,RootState,undefined,AnyAction> =>{
    return async()=>{
        try{
            const res = await fetch(`${LOCAL_URL}/api/account/auth/logout`)
            if(res.ok){
                redirectToLogin()
            }
        }catch(err){
        }
    }
}

export const login = (email:string,password:string) :ThunkAction<void,RootState,undefined,AnyAction> =>{
    return async(dispatch)=>{
        try{
            const fcm_token = localStorage.getItem("_fcm")
            dispatch(uiActions.setInnerLoading(true))
            const res = await fetch(`../api`,{
                 method:"POST",
                 body:JSON.stringify({email,password,fcm_token})
            })
            const data =await res.json()
            console.log(data)
            switch(res.status){
                case 200:
                    localStorage.setItem("user",JSON.stringify(data.user))
                    dispatch(uiActions.setInnerLoading(false))
                    switch(data.user.estado){
                        case UserEstado.DISABLED:
                            toast.info("Le informamos que su cuenta ha sido deshabilitada. Como resultado, no podrá iniciar sesión en este momento.")
                            return     
                        case UserEstado.DELETED:
                            toast.info("Le informamos que su cuenta ha sido eliminada. Como resultado, no podrá iniciar sesión.")
                            return    
                    }

                    switch(data.user.rol){
                       case UserRol.ADMIN_USER_ROL:
                           window.location.assign(adminRoutes.manage.establecimientos)
                           break;
                       case UserRol.CLIENT_USER_ROL:
                           const res = await fetch(`/api/account/establecimientos`)
                           const data:EstablecimientoUser[] = await res.json()
                           console.log("ESTABLECIMEINTOS",data)
                           if(data.length == 1){
                               window.location.assign(`${rootEstablecimiento}/${data[0].uuid}`)
                           }
                           if(data.length > 1) {
                                window.location.replace(`/auth/establecimientos`)
                           }
                           break;
                    }
                   dispatch(uiActions.setInnerLoading(false))
                   break;
                case 400:
                    toast.error(data.message)
                    break;
                default:
                    toast.error(unexpectedError)
            }
            dispatch(uiActions.setInnerLoading(false))
        }catch(e){
            toast.error(unexpectedError)
            dispatch(uiActions.setInnerLoading(false))
        }
    }
}
export const getEstablecimientosUser = (uuid:string="") :ThunkAction<void,RootState,undefined,AnyAction> =>{
    return async(dispatch)=>{
        try{
            dispatch(uiActions.setInnerLoading(true))
            console.log("CURRENT_UUID",uuid)
            const res = await fetch(`${LOCAL_URL}/api/account/establecimientos?uuid=${uuid}`)
            switch(res.status){
                case HttpStatusCode.Unauthorized:
                    redirectToLogin()
                    break;
                    case HttpStatusCode.Ok:
                        const data:EstablecimientoUser[] = await res.json()
                        console.log("DATA ESTABLECIOMIENTOS",data)
                        dispatch(accountActions.setEstablecimientos(data))
                    break;    
            }
            dispatch(uiActions.setInnerLoading(false))
          
        }catch(e){
            dispatch(uiActions.setInnerLoading(false))
        }
    }
}

export const getEstablecimientos = () :ThunkAction<void,RootState,undefined,AnyAction> =>{
    return async(dispatch)=>{
        try{
            dispatch(uiActions.setInnerLoading(true))
            const data:EstablecimientoData[] = await GetEstablecimientos()
            
            dispatch(uiActions.setInnerLoading(false))
        }catch(e){
            dispatch(uiActions.setInnerLoading(false))
        }
    }
}
