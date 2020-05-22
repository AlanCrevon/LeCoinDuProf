importScripts('https://www.gstatic.com/firebasejs/7.6.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.6.0/firebase-messaging.js');
firebase.initializeApp({
  apiKey: 'AIzaSyC8zYfkXXcJRhE-fnFs3EVmuHyN2MXEUPk',
  authDomain: 'lecoinduprof-v2-dev.firebaseapp.com',
  databaseURL: 'https://lecoinduprof-v2-dev.firebaseio.com',
  projectId: 'lecoinduprof-v2-dev',
  storageBucket: 'lecoinduprof-v2-dev.appspot.com',
  messagingSenderId: '86601526918',
  appId: '1:86601526918:web:c089e31d32a308326e6b07'
});
const messaging = firebase.messaging();
