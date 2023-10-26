import { AnyAction, ThunkAction } from "@reduxjs/toolkit"
import { RootState } from "../store"
import axios from "axios"
import { uiActions } from "../slices/uiSlice"
import { UserEstado, UserRol } from "@/core/type/enums"
import { GetEstablecimientos } from "@/core/repository/establecimiento"
import { accountActions } from "../slices/accountSlice"
import { adminRoutes, rootEstablecimiento } from "@/core/util/routes"
import { toast } from "react-toastify"
import { redirectToLogin } from "."
import { unexpectedError } from "../config"



export const getUser  = () :ThunkAction<void,RootState,undefined,AnyAction> =>{
    return async(dispatch)=>{
        try{
            const userLocal = localStorage.getItem("user")
            if(userLocal!= null){
                const user:User = JSON.parse(userLocal)
                dispatch(accountActions.setUser(user))
            }
        }catch(err){
            console.log(err)
        }
    }
}

export const logout  = () :ThunkAction<void,RootState,undefined,AnyAction> =>{
    return async()=>{
        try{
            console.log("STATUS LOGOUT")
            const res = await fetch("../../api/account/auth/logout")
            console.log(res.status)
            if(res.ok){
                redirectToLogin()
            }
        }catch(err){
            console.log(err)
        }
    }
}

export const login = (email:string,password:string) :ThunkAction<void,RootState,undefined,AnyAction> =>{
    return async(dispatch)=>{
        try{
            console.log(password,email)
            const fcm_token = localStorage.getItem("_fcm")
            dispatch(uiActions.setInnerLoading(true))
            const res = await fetch(`../api`,{
                 method:"POST",
                 body:JSON.stringify({email,password,fcm_token})
            })
            console.log(res.status)
            // console.log(await res.json())
            const data =await res.json()
            switch(res.status){
                case 200:
                    localStorage.setItem("user",JSON.stringify(data.user))
                    dispatch(uiActions.setInnerLoading(false))
                    console.log(data.user.rol)
                    switch(data.user.estado){
                        case UserEstado.DISABLED:
                            toast.info("Le informamos que su cuenta ha sido deshabilitada. Como resultado, no podrá iniciar sesión en este momento.")
                            return     
                        case UserEstado.DELETED:
                            toast.info("Le informamos que su cuenta ha sido eliminada. Como resultado, no podrá iniciar sesión.")
                            return    
                    }
                    // if(data.user.estado == UserEstado.DISABLED)
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
                    // if(typeof window != undefined){
                    //     const urlParams = new URLSearchParams(window.location.search);
                    //     const redirect = urlParams.get('redirect');
                    //     if(redirect != null){
                    //         window.location.replace(redirect as string)
                    //     }
                    // }
                   dispatch(uiActions.setInnerLoading(false))
                   break;
                case 400:
                    console.log(data)
                    toast.error(data.message)
                    break;
                default:
                    toast.error(unexpectedError)
                    console.log("FAIL")
            }
            dispatch(uiActions.setInnerLoading(false))
        }catch(e){
            toast.error(unexpectedError)
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
            if(res.status == 401){
                redirectToLogin()
            }
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
            console.log("get establecimientos")
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
