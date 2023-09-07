import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UiState } from "../models/ui";

// const user = localStorage.getItem("user")
// const userD:User | null =user != null? JSON.parse(user) :null
const accountState:AccountState =  {
    user:null,
    establecimientos:[]
}

const accountSlice = createSlice({
    name:"account",
    initialState:accountState,
    reducers:{
        setUser(state,action:PayloadAction<User>){
            state.user = action.payload
        },
        setEstablecimientos(state,action:PayloadAction<EstablecimientoUser[]>){
            state.establecimientos = action.payload
        }
    }
})


export const accountActions = accountSlice.actions

export default accountSlice