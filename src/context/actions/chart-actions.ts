import { AnyAction, ThunkAction } from "@reduxjs/toolkit"
import { RootState } from "../store"
import { chartActions } from "../slices/chartSlice"
import { ChartDataResponse, FilterChartData, NameValueData } from "@/core/type/chart"
import { GetChartData, GetReservasHoursAverage, GetReservasHoursData } from "@/core/repository/chart"

export const getReservasHoursAverage  = (data:FilterChartData) :ThunkAction<void,RootState,undefined,AnyAction> =>{
    return async(dispatch)=>{
        try{
            dispatch(chartActions.setChartLoading(true))
            const res:NameValueData[] = await GetReservasHoursAverage(data)
            dispatch(chartActions.setData(res))
            dispatch(chartActions.setChartLoading(false))
        }catch(err){
            dispatch(chartActions.setChartLoading(false))
            console.log(err)
        }
    }
}

export const getReservasHoursData  = (data:FilterChartData) :ThunkAction<void,RootState,undefined,AnyAction> =>{
    return async(dispatch)=>{
        try{
            dispatch(chartActions.setChartLoading(true))
            const res:NameValueData[] = await GetReservasHoursData(data)
            dispatch(chartActions.setData(res))
            dispatch(chartActions.setChartLoading(false))
        }catch(err){
            dispatch(chartActions.setChartLoading(false))
            console.log(err)
        }
    }
}

export const getChartData  = (data:FilterChartData) :ThunkAction<void,RootState,undefined,AnyAction> =>{
    return async(dispatch)=>{
        try{
            dispatch(chartActions.setChartLoading(true))
            const res:ChartDataResponse = await GetChartData(data)
            dispatch(chartActions.setDataResponse(res))
            dispatch(chartActions.setChartLoading(false))
        }catch(err){
            dispatch(chartActions.setChartLoading(false))
            console.log(err)
        }
    }
}