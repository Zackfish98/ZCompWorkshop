// Firebase setup for the signup form (see the submit handler in js/script.js
// for where this actually gets used to save each submission).
//
// This follows the same pattern as the course's Firebase Poll App tutorial
// (Engagement Components/Examples/02 Firebase Poll App/poll-app.js), just
// using Realtime Database writes for form submissions instead of vote counts.
//
// To connect this to a real Firebase project:
//   1. Go to https://console.firebase.google.com and create a free project
//   2. Add a Web app to it, then copy the config object Firebase gives you
//   3. Paste your real values in place of the placeholders below
//   4. In the Firebase Console, create a Realtime Database (test mode is
//      fine to start with — lock down the rules before this goes truly live)
const firebaseConfig = {
  apiKey: "AIzaSyAPzclCmEQXBgGOkevZGuYyM_B7kW-Eo14",
  authDomain: "twostep-e85a2.firebaseapp.com",
  databaseURL: "https://twostep-e85a2-default-rtdb.firebaseio.com",
  projectId: "twostep-e85a2",
  storageBucket: "twostep-e85a2.firebasestorage.app",
  messagingSenderId: "592184844624",
  appId: "1:592184844624:web:3ce5a845fe7bb4a03c8c55"
};

firebase.initializeApp(firebaseConfig);

// Exposed on window so script.js (loaded right after this file) can reach it
window.tscDatabase = firebase.database();

// Small live indicator near the form — mirrors the tutorial's
// "connection-status" element, so it's easy to tell at a glance whether
// the config above is pointed at a real project yet.
const statusEl = document.getElementById('firebase-status');
if (statusEl) {
  window.tscDatabase.ref('.info/connected').on('value', (snapshot) => {
    if (snapshot.val()) {
      statusEl.textContent = 'Connected to Firebase';
      statusEl.classList.add('is-connected');
    } else {
      statusEl.textContent = 'Not connected to Firebase yet';
      statusEl.classList.remove('is-connected');
    }
  });
}
