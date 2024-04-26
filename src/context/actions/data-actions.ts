import { AnyAction, ThunkAction } from "@reduxjs/toolkit"
import { RootState } from "../store"
import { chatActions } from "../slices/chatSlice"
import { uiActions } from "../slices/uiSlice"
import { GetInstalaciones } from "@/core/repository/instalacion"
import { dataActions } from "../slices/dataSlice"


export const fetchInstalaciones  = (uuid:string,onStart?:()=>void,onEnd?:()=>void) :ThunkAction<void,RootState,undefined,AnyAction> =>{
    return async(dispatch,getState)=>{
        try{
            const instalaciones = getState().data.instalaciones
            if(onStart != undefined){
                onStart()
            }
            if(instalaciones.length == 0){
              dispatch(uiActions.setFetchLoading(true))
              const res:Instalacion[] = await GetInstalaciones(uuid)
              dispatch(dataActions.setInstalaciones(res))
              dispatch(uiActions.setFetchLoading(false))
            }
            if(onEnd != undefined){
                onEnd()
            }
        }catch(err){
            dispatch(uiActions.setFetchLoading(false))
        }
    }
}