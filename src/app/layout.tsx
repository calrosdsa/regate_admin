"use client"
import './globals.css'
import '../style/index.css'
import { Inter } from 'next/font/google'
import { Providers } from './provider'
import LoaderDialog from '@/components/util/loaders/LoaderDialog';
import { useAppDispatch, useAppSelector } from '@/context/reduxHooks';

import { useEffect, useRef, useState } from 'react'
// import { firebaseConfig } from '@/core/util/firebase-messaging-sw.js'
import { initializeApp } from "firebase/app";
import { getMessaging, getToken,onMessage} from "firebase/messaging";

import { firebaseConfig } from '@/core/util/firebase'
import { getUser } from '@/context/actions/account-actions'
import moment from 'moment'
import 'moment/locale/es'
import { WS_URL } from '@/context/config'
import { PayloadType, WsAccountPayload } from '@/core/type/notification'
import { toast } from 'react-toastify'
import { initDb, insertMessage } from '@/context/db'
import { chatActions } from '@/context/slices/chatSlice'
import { Parent } from './parent'
// import { messaging } from '@/core/util/firebase'

// export const metadata = {
//   title: 'Create Next App',
//   description: 'Generated by create next app',
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  
  
  
  const GetToken = () =>{
    const firebaseConfig = {

      apiKey: "AIzaSyAV5pUxeO6lpWGWDpSe48Wx6Trv2a0Q6Y8",
    
      authDomain: "regate-288a2.firebaseapp.com",
    
      projectId: "regate-288a2",
    
      storageBucket: "regate-288a2.appspot.com",
    
      messagingSenderId: "563502574525",
    
      appId: "1:563502574525:web:5bd189167c6f21175a80d4",
    
      measurementId: "G-YR0PB57CF9"
    
    };
    const app = initializeApp(firebaseConfig);
    const messaging = getMessaging(app);
    getToken(messaging, {vapidKey: "BPYD4I2TJYp_hZrDx1XNwbkfluF_e7OkXzhkmsjxi8leMjGBetWVlO2My13poePVmU1EYdNTERgasv4oca-jCXk"}).then((currentToken) => {
      if (currentToken) {
        localStorage.setItem("_fcm",currentToken)
        console.log(currentToken)
        // Send the token to your server and update the UI if necessary
        // ...
      } else {
        console.log('No registration token available. Request permission to generate one.');
      }
    }).catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
    });
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
    });
  }
  function requestPermission() {
    console.log('Requesting permission...');
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        console.log('Notification permission granted.');
      }
    })
  }



  useEffect(()=>{
    // if ("serviceWorker" in navigator) {
    //   navigator.serviceWorker.register("/firebase-messaging-sw.js").then(
    //     (registration) => {
    //       console.log("Service worker registration succeeded:", registration);
    //     },
    //     (error) => {
    //       console.error(`Service worker registration failed: ${error}`);
    //     },
    //   );  
    // } else {
    //   console.error("Service workers are not supported.");
    // }
    // requestPermission()
    // GetToken()
    moment.locale("es")

    
  },[])
  

  return (
    <html lang="en">
      <head>
              <link rel="manifest" href="/manifest/manifest.json" />
              <link rel="apple-touch-icon" href="/manifest/icon-192x192.png" />
              <meta name="theme-color" content="#042940" />
      </head>
      <Providers>
      <body className='bg-gray-50'>
        <>
        {/* <button onClick={()=>getTokenFcm()}>
          GET TOKEN
        </button> */}
        <Parent>
        {children}
        </Parent>
        </>
        </body>
      </Providers>
    </html>
  )
}
