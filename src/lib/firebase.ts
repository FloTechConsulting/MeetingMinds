import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyASq3D3aqE3s3btLByc9qBIOYLunHX5hnY",
  authDomain: "flotech-ec621.firebaseapp.com",
  projectId: "flotech-ec621",
  storageBucket: "flotech-ec621.firebasestorage.app",
  messagingSenderId: "230547277917",
  appId: "1:230547277917:web:06f2b256bd05f6725ba5b4",
  measurementId: "G-PTXWLZZ9ZX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;