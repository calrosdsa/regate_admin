import { AnyAction, ThunkAction } from "@reduxjs/toolkit"
import { RootState } from "../store"
import axios from "axios"
import { uiActions } from "../slices/uiSlice"



export const login = (email:string,password:string) :ThunkAction<void,RootState,undefined,AnyAction> =>{
    return async(dispatch)=>{
        try{
            dispatch(uiActions.setInnerLoading(true))
            // const res = await axios.post("/auth/api/login",{email,password})
            const res = await axios.post("../api",{email,password})
            dispatch(uiActions.setInnerLoading(false))
            // console.log(res.data)
            console.log(res.data)
        }catch(e){
            dispatch(uiActions.setInnerLoading(false))
            console.log(e)
        }
    }
}