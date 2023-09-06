import {configureStore} from '@reduxjs/toolkit';
import uiSlice from './slices/uiSlice';
import accountSlice from './slices/accountSlice';

const store = configureStore(
    {
        reducer:{
            ui:uiSlice.reducer,
            account:accountSlice.reducer,
        }
    }
)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store