// Import the functions you need from the SDKs you need
// import firebaseAdmin from 'firebase-admin';
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
} from '@firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyC9WRh3cb9FyMzrNFltS9fRQ3AevPRwH_M',
  authDomain: 'mental-workload-app.firebaseapp.com',
  projectId: 'mental-workload-app',
  storageBucket: 'mental-workload-app.appspot.com',
  messagingSenderId: '259742826474',
  appId: '1:259742826474:web:b6df8b883334a61ae7fc93',
  measurementId: 'G-RB7BJBH9KR',
};

// Initialize Firebase
export const firebase = initializeApp(firebaseConfig);
initializeAuth(firebase, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const analytics = getAnalytics(firebase);
export const auth = getAuth(firebase);
export const db = getFirestore(firebase);
