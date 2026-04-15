import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserSessionPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA_KOBxwroEc6qbSbfIrb-kfTeQm2812Ik",
  authDomain: "resellers-90507.firebaseapp.com",
  projectId: "resellers-90507",
  storageBucket: "resellers-90507.firebasestorage.app",
  messagingSenderId: "407063416894",
  appId: "1:407063416894:web:06855b7af6337b8dc3c16f",
  measurementId: "G-3T6MMDJBRW"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Fix IndexedDB errors in iframes/certain browsers
setPersistence(auth, browserSessionPersistence).catch(console.error);

export const db = getFirestore(app, "exertion");
