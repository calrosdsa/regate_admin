'use client';

import LoaderDialog from "@/components/util/loaders/LoaderDialog";
import { handleIncomeMessages } from "@/context/actions/chat-actions";
import { WS_URL } from "@/context/config";
import { getMessagesChat, insertMessage } from "@/context/db";
import { useAppDispatch, useAppSelector } from "@/context/reduxHooks";
import { chatActions } from "@/context/slices/chatSlice";
import { uiActions } from "@/context/slices/uiSlice";
import store from "@/context/store";
import { PayloadType, WsAccountPayload } from "@/core/type/notification";
import { ThemeProvider } from "@emotion/react";
import { CssBaseline, Paper, createTheme } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


export function Parent({ children }:any) {
  const connection = useRef<WebSocket>();
  const searchParams = useSearchParams();
  const current = new URLSearchParams(Array.from(searchParams.entries()))
  const dispatch = useAppDispatch()
  const {mode,loaderDialog} = useAppSelector(state=>state.ui)

  const theme = useMemo(
    () =>
      createTheme({
        // typography: {
        //   fontFamily: roboto.style.fontFamily,
        // },
        palette:{
          mode,
        //   primary: {
        //     main: 'rgba(79,168,220,0.79)',
        //   },
        //   secondary: {
        //     main: '#f50057',
        //   },
        }
      }),
    [mode],
  );


  useEffect(()=>{
    if(typeof window != "undefined"){
      const m = localStorage.getItem("mode") as 'light' | 'dark' || "light"
      dispatch(uiActions.setMode(m))
    }
  },[])
  

  useEffect(()=>{
    const userLocal = localStorage.getItem("user") 
    const user:User | null = userLocal != null ? JSON.parse(userLocal) : null
    if(user != null) {
      connection.current =  new WebSocket(`${WS_URL}/v1/ws/suscribe/user/admin/?id=${user.id}`)
      connection.current.onmessage = (e) => {
        const data:WsAccountPayload = JSON.parse(e.data)
        switch(data.type){
          case PayloadType.PAYLOAD_GRUPO_MESSAGES:
            dispatch(handleIncomeMessages(data.payload))
            // connection.current?.send("My data")
            break;
        }
        // const payload:MessagePayload = JSON.parse(e.data)
        // switch(payload.type){
        //     case MessageEvent.Message:
        //         const message:ConversationMessage = JSON.parse(payload.payload)
        //         setMessages(e=>[message,...e])
        //         break;

        // }
    };
    connection.current.onclose = () => {
      console.log("WS ONCLOSE")
    };
    }
    return () => {
      console.log("WS CLOSE")  
      connection.current?.close();
    }
  },[])
  return (
    <>
     <AppRouterCacheProvider>
        <ThemeProvider theme={theme}>
        <CssBaseline />
          <Paper elevation={0}>
            <>
            <ToastContainer
              position='bottom-center'
              />
                <LoaderDialog open={loaderDialog}/>
              {children}
            </>
          </Paper>
        </ThemeProvider>
     </AppRouterCacheProvider>
    </>
  );
}