// import { initializeApp } from "firebase/app";
// import { getMessaging } from "firebase/messaging";
importScripts("https://www.gstatic.com/firebasejs/8.3.2/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.3.2/firebase-messaging.js");


const firebaseConfig = {
    apiKey: "AIzaSyAV5pUxeO6lpWGWDpSe48Wx6Trv2a0Q6Y8",
    authDomain: "regate-288a2.firebaseapp.com",
    projectId: "regate-288a2",
    storageBucket: "regate-288a2.appspot.com",
    messagingSenderId: "563502574525",
    appId: "1:563502574525:web:5bd189167c6f21175a80d4",
    measurementId: "G-YR0PB57CF9"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();

  messaging.onBackgroundMessage(function(payload) {
    console.log("Received background message ", payload);
 
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
    };
 
    self.registration.showNotification(notificationTitle, notificationOptions);
  });

//   const analytics = getAnalytics(app);

// const messaging = firebase.messaging();

// messaging.setBackgroundMessageHandler((payload) => {
//   console.log(
//     "[firebase-messaging-sw.js] Received background message ",
//     payload
//   );
//   const notificationTitle = "Background Message Title";
//   const notificationOptions = {
//     body: "Background Message body.",
//     icon: "/firebase-logo.png",
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });