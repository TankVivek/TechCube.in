importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyAJhsnL_Vwwu4Qj8fZvO9RW9SD8O1tWbUk",
  authDomain: "techcube-99abf.firebaseapp.com",
  projectId: "techcube-99abf",
  storageBucket: "techcube-99abf.firebasestorage.app",
  messagingSenderId: "814216803952",
  appId: "1:814216803952:web:b6cd67c0d7283e67f0e6b5",
  measurementId: "G-PYE4J9VXSD"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Background message received: ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo-square.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
