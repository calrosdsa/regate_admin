import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UiState } from "../models/ui";
import { ReporteId } from "@/data/model/types/enums";



const systemState:SystemState=  {
    infoText:undefined,
    openInfoBar:false,
    loadingInfoText:false
}


const systemSlice = createSlice({
    name:"system",
    initialState:systemState,
    reducers:{
        setInfoText(state,action:PayloadAction<InfoText | undefined>){
            state.infoText = action.payload
        },
        setOpenInfoBar(state,action:PayloadAction<boolean>){
            state.openInfoBar = action.payload
        },
        setLoadingInfoText(state,action:PayloadAction<boolean>){
            state.loadingInfoText = action.payload
        },
    }
})


export const systemActions = systemSlice.actions

export default systemSlice