// Firebase Service Worker pour les notifications push
// Ce fichier doit être à la racine du domaine pour fonctionner correctement

importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js');

// Initialisation de Firebase
firebase.initializeApp({
  apiKey: "AIzaSyAZZr7XkBq-cWtxh3DOrzDnAxtX5XTVWVY",
  authDomain: "oystercult-9e7b0.firebaseapp.com",
  projectId: "oystercult-9e7b0",
  storageBucket: "oystercult-9e7b0.appspot.com",
  messagingSenderId: "1016908868176",
  appId: "1:1016908868176:web:a6c453d95aa66b9c9cc45a",
  measurementId: "G-L6WZZZN0P6"
});

const messaging = firebase.messaging();

// Gestion des notifications en arrière-plan
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Message reçu en arrière-plan:', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/OYSTERCULT/logo192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
