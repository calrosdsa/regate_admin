import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UiState } from "../models/ui";



const uiState:UiState=  {
    loading:false,
    innerLoading:false,
    loaded:false,
    loaderDialog:false
}


const uiSlice = createSlice({
    name:"ui",
    initialState:uiState,
    reducers:{
        setInnerLoading(state,action:PayloadAction<boolean>){
            state.innerLoading = action.payload
        },
        setLoaded(state,action:PayloadAction<boolean>){
            state.loaded = action.payload
        },
        setLoaderDialog(state,action:PayloadAction<boolean>){
            state.loaderDialog = action.payload
        }
    }
})


export const uiActions = uiSlice.actions

export default uiSlice