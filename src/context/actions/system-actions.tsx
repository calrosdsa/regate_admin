import { AnyAction, ThunkAction } from "@reduxjs/toolkit"
import { RootState } from "../store"
import axios, { Canceler } from "axios"
import { uiActions } from "../slices/uiSlice"
import { ReporteId, UserEstado, UserRol } from "@/core/type/enums"
import { GetEstablecimientos } from "@/core/repository/establecimiento"
import { accountActions } from "../slices/accountSlice"
import { adminRoutes, rootEstablecimiento } from "@/core/util/routes"
import { Id, toast } from "react-toastify"
import { redirectToLogin } from "."
import { API_URL, unexpectedError } from "../config"
import moment from "moment"
import { GetInfoText, InfoTextId } from "@/core/repository/core/system"
import { systemActions } from "../slices/systemSlice"


export const getInfoText = (idTextInfo:InfoTextId) :ThunkAction<void,RootState,undefined,AnyAction> =>{
    return async(dispatch,getState)=>{
        try{
            const systemState = getState().system
            if(systemState.openInfoBar){
                dispatch(systemActions.setLoadingInfoText(true))
                dispatch(systemActions.setInfoText(undefined))
                const res:InfoText = await GetInfoText(idTextInfo)
                dispatch(systemActions.setInfoText(res))
                dispatch(systemActions.setLoadingInfoText(false))
            }
        }catch(err:any){
            dispatch(systemActions.setLoadingInfoText(false))
            console.log(err)
        }
    }
}
