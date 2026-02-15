/**
 * Firebase Configuration
 * Initialize Firebase App, Auth, and Firestore
 */

// Firebase configuration - REPLACE WITH YOUR OWN CONFIG
const firebaseConfig = {
    apiKey: "AIzaSyDKvM77iEsX1vprP01btM69HL2vc-WrcOk",
    authDomain: "deltacompounding.firebaseapp.com",
    projectId: "deltacompounding",
    storageBucket: "deltacompounding.firebasestorage.app",
    messagingSenderId: "116540147149",
    appId: "1:116540147149:web:9528748db27f36159d3084"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize services
const auth = firebase.auth();
const firestore = firebase.firestore();

// Enable offline persistence for Firestore
firestore.enablePersistence({ synchronizeTabs: true })
    .catch((err) => {
        if (err.code === 'failed-precondition') {
            // Multiple tabs open, persistence can only be enabled in one tab at a time
            console.warn('Firestore persistence failed: Multiple tabs open');
        } else if (err.code === 'unimplemented') {
            // The current browser does not support persistence
            console.warn('Firestore persistence not supported by browser');
        }
    });

console.log('Firebase initialized');
