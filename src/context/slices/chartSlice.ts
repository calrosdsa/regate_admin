import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UiState } from "../models/ui";
import { TypeOfChart, TypeOfDate } from "@/data/model/types/enums";



const chartState:ChartState=  {
    data:[],
    typeOfChart:TypeOfChart.line,
    filterData:{
        start_date:undefined,
        end_date:undefined,
        type_date:TypeOfDate.day,
        establecimiento_id:undefined,
        uuid:undefined
    },
    response:undefined,
    loading:false,
    allowedCharts:[],
    closeDialog:false
}


const chartSlice = createSlice({
    name:"chart",
    initialState:chartState,
    reducers:{
        setData(state,action:PayloadAction<NameValueData[]>){
            state.data = action.payload
        },
        setCloseDialog(state,action:PayloadAction<boolean>){
            state.closeDialog= action.payload
        },
        setDataResponse(state,action:PayloadAction<ChartDataResponse>){
            state.response = action.payload
        },
        setTypeOfChart(state,action:PayloadAction<TypeOfChart>){
            state.typeOfChart = action.payload
        },
        setFilterData(state,action:PayloadAction<FilterChartData>){
            // state.filterData
            state.filterData = action.payload
        },
        setChartLoading(state,action:PayloadAction<boolean>){
            state.loading = action.payload
        },
        setAllowedCharts(state,action:PayloadAction<TypeOfDate[]>){
            state.allowedCharts = action.payload
        }
        // openSidebar(state,action:PayloadAction<boolean>){
        //     state.openSidebar = action.payload
        // }
    }
})


export const chartActions = chartSlice.actions

export default chartSlice