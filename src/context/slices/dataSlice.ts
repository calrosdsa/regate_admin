import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UiState } from "../models/ui";
import { ChartDataResponse, ChartState, FilterChartData, NameValueData } from "@/core/type/chart";
import { TypeOfChart, TypeOfDate } from "@/core/type/enums";



const chartState:DataSlice=  {
    instalaciones:[],
}


const dataSlice = createSlice({
    name:"data",
    initialState:chartState,
    reducers:{
        setInstalaciones(state,action:PayloadAction<Instalacion[]>){
            state.instalaciones = action.payload
        },
        // openSidebar(state,action:PayloadAction<boolean>){
        //     state.openSidebar = action.payload
        // }
    }
})


export const dataActions = dataSlice.actions

export default dataSlice