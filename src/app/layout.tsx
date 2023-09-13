"use client"
import './globals.css'
import '../style/index.css'
import { Inter } from 'next/font/google'
import { Providers } from './provider'
import LoaderDialog from '@/components/util/loaders/LoaderDialog';
import { useAppDispatch, useAppSelector } from '@/context/reduxHooks';
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { useEffect } from 'react'
// import { firebaseConfig } from '@/core/util/firebase-messaging-sw.js'
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from '@/core/util/firebase'
import { getUser } from '@/context/actions/account-actions'
import moment from 'moment'
import 'moment/locale/es'
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
  const getTokenFcm = () =>{
    const messaging  = getMessaging()
    getToken(messaging, { vapidKey: 'rcaO8ig-n5sc6fQX8woX8QYWpKlEnDj0z36qm_I3I84' }).then((currentToken) => {
      if (currentToken) {
        console.log(currentToken,"TOKEN FCM")
      } else {
        console.log('No registration token available. Request permission to generate one.');
      }
    }).catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
      // ...
    });


  }

  // const requestPermission = () => {
  //   console.log('Requesting permission...')
  //   Notification.requestPermission().then((permission) => {
  //     if (permission === 'granted') {
  //       console.log('Notification permission granted.');
  //     }
  //     })
  //   }

  //   useEffect(()=>{
  //     initializeApp(firebaseConfig);
  //     // initializeApp(firebaseConfig);
  //     // getTokenFcm()
  //     // navigator.serviceWorker.register('/firebase-messaging-sw.js')
  //     requestPermission()
  //   },[])
  useEffect(()=>{
    moment.locale("es")
  },[])
  

  return (
    <html lang="en">
      <Providers>
      <body className='bg-gray-50'>
        {/* <button onClick={()=>getTokenFcm()}>
          GET TOKEN
        </button> */}
        {children}
        </body>
      </Providers>
    </html>
  )
}
