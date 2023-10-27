import {configureStore} from '@reduxjs/toolkit';
import uiSlice from './slices/uiSlice';
import accountSlice from './slices/accountSlice';
import chartSlice from './slices/chartSlice';
import systemSlice from './slices/systemSlice';
import chatSlice from './slices/chatSlice';

const store = configureStore(
    {
        reducer:{
            ui:uiSlice.reducer,
            account:accountSlice.reducer,
            chart:chartSlice.reducer,
            system:systemSlice.reducer,
            chat:chatSlice.reducer
        }
    }
)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store