import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UiState } from "../models/ui";
import { ReporteId } from "@/core/type/enums";



const uiState:UiState=  {
    loading:false,
    innerLoading:false,
    loaded:false,
    loaderDialog:false,
    openSidebar:false,
    ongoingDownloadProcess:[]
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
        },
        openSidebar(state,action:PayloadAction<boolean>){
            state.openSidebar = action.payload
        },
        setOngoingDownloadProcess(state,action:PayloadAction<number[]>){
            state.ongoingDownloadProcess = [...state.ongoingDownloadProcess,...action.payload]
        },
        removeOngoingProcessFromQueue(state,action:PayloadAction<ReporteId>){
            const ongoingDownloads = state.ongoingDownloadProcess.filter(item=>item != action.payload)
            state.ongoingDownloadProcess = ongoingDownloads
        }
    }
})


export const uiActions = uiSlice.actions

export default uiSlice