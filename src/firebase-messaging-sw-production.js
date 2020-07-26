importScripts('https://www.gstatic.com/firebasejs/7.6.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.6.0/firebase-messaging.js');
firebase.initializeApp({
  apiKey: 'AIzaSyCNwUuZI6LUNktZ3UinDYh_XJ6L-R9qkkY',
  authDomain: 'auth.lecoinduprof.com',
  databaseURL: 'https://lecoinduprof-v2-prod.firebaseio.com',
  projectId: 'lecoinduprof-v2-prod',
  storageBucket: 'lecoinduprof-v2-prod.appspot.com',
  messagingSenderId: '821584137043',
  appId: '1:821584137043:web:5c086ed17968debf14afa6',
  measurementId: 'G-P30MF7RXXD'
});
const messaging = firebase.messaging();
