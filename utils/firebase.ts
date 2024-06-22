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
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};
// const firebaseConfig = {
//   apiKey: 'AIzaSyC9WRh3cb9FyMzrNFltS9fRQ3AevPRwH_M',
//   authDomain: 'mental-workload-app.firebaseapp.com',
//   projectId: 'mental-workload-app',
//   storageBucket: 'mental-workload-app.appspot.com',
//   messagingSenderId: '259742826474',
//   appId: '1:259742826474:web:b6df8b883334a61ae7fc93',
//   measurementId: 'G-RB7BJBH9KR',
// };

// Initialize Firebase
export const firebase = initializeApp(firebaseConfig);
initializeAuth(firebase, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const analytics = getAnalytics(firebase);
export const auth = getAuth(firebase);
export const db = getFirestore(firebase);
