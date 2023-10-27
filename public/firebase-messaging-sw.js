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
  try {
    const customerData = [
      { ssn: "444-44-4444", name: "Bill", age: 35, email: "bill@company.com" },
      { ssn: "555-55-5555", name: "Donna", age: 32, email: "donna@home.org" },
    ];
    const dbName = "the_name";

    const request = indexedDB.open(dbName, 2);
    
    request.onerror = (event) => {
      // Handle errors.
    };
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
    
      // Create an objectStore to hold information about our customers. We're
      // going to use "ssn" as our key path because it's guaranteed to be
      // unique - or at least that's what I was told during the kickoff meeting.
      const objectStore = db.createObjectStore("customers", { keyPath: "ssn" });
    
      // Create an index to search customers by name. We may have duplicates
      // so we can't use a unique index.
      objectStore.createIndex("name", "name", { unique: false });
    
      // Create an index to search customers by email. We want to ensure that
      // no two customers have the same email, so use a unique index.
      objectStore.createIndex("email", "email", { unique: true });
    
      // Use transaction oncomplete to make sure the objectStore creation is
      // finished before adding data into it.
      objectStore.transaction.oncomplete = (event) => {
        // Store values in the newly created objectStore.
        const customerObjectStore = db
          .transaction("customers", "readwrite")
          .objectStore("customers");
        customerData.forEach((customer) => {
          customerObjectStore.add(customer);
        });
      };
    };
    
      } catch (e) {
          console.log('error', e);
      }


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