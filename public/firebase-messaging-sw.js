importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');




firebase.initializeApp({
    apiKey: "AIzaSyAV5pUxeO6lpWGWDpSe48Wx6Trv2a0Q6Y8",
  
    authDomain: "regate-288a2.firebaseapp.com",
  
    projectId: "regate-288a2",
  
    storageBucket: "regate-288a2.appspot.com",
  
    messagingSenderId: "563502574525",
  
    appId: "1:563502574525:web:5bd189167c6f21175a80d4",
  
    measurementId: "G-YR0PB57CF9"
});
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log(
      '[firebase-messaging-sw.js] Received background message ',
      payload
    );
    const notificationTitle = payload.data.title;
    const notificationOptions = {
      body: payload.data.payload,
      icon:`/images/logo.png`
    };  
    self.registration.showNotification(notificationTitle, notificationOptions);
    localStorage.setItem("payload",payload)
  });