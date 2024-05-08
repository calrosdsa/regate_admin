import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UiState } from "../models/ui";
import { ReporteId } from "@/core/type/enums";



const uiState:UiState=  {
    fetchLoading:false,
    innerLoading:false,
    loaded:false,
    loaderDialog:false,
    openSidebar:false,
    ongoingDownloadProcess:[],
    mode:"light"
}


const uiSlice = createSlice({
    name:"ui",
    initialState:uiState,
    reducers:{
        setMode(state,action:PayloadAction<'light' | 'dark'>){
            localStorage.setItem("mode",action.payload)
            state.mode = action.payload
        },
        setInnerLoading(state,action:PayloadAction<boolean>){
            state.innerLoading = action.payload
        },
        setFetchLoading(state,action:PayloadAction<boolean>){
            state.fetchLoading = action.payload
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
        removeOngoingProcessFromQueue(state,action:PayloadAction<number>){
            const ongoingDownloads = state.ongoingDownloadProcess.filter(item=>item != action.payload)
            state.ongoingDownloadProcess = ongoingDownloads
        }
    }
})


export const uiActions = uiSlice.actions

export default uiSlice