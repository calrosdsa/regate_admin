import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UiState } from "../models/ui";
import { ChartDataResponse, ChartState, FilterChartData, NameValueData } from "@/core/type/chart";
import { TypeOfChart, TypeOfDate } from "@/core/type/enums";



const chartState:DataSlice=  {
    instalaciones:[],
    reservas:[]
}


const dataSlice = createSlice({
    name:"data",
    initialState:chartState,
    reducers:{
        setInstalaciones(state,action:PayloadAction<Instalacion[]>){
            state.instalaciones = action.payload
        },
        setReservas(state,action:PayloadAction<Reserva[]>){
            state.reservas = action.payload
        },
        updateReservas(state,action:PayloadAction<Reserva>){
            const n = state.reservas.map(item=>{
                if(item.id == action.payload.id){
                    action.payload.instalacion_name = item.instalacion_name
                    item = action.payload
                    // item.instalacion_name = canchaName
                }
                return item
            })
            state.reservas = n
        }

        // openSidebar(state,action:PayloadAction<boolean>){
        //     state.openSidebar = action.payload
        // }
    }
})


export const dataActions = dataSlice.actions

export default dataSlice