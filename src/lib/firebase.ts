import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase web app configuration — SmartEV Web (smartevstation-23664)
const firebaseConfig = {
  apiKey: "AIzaSyCBRNEtB6Q4Hdpdj_ghI-CVXq9E2KMEWVE",
  authDomain: "smartevstation-23664.firebaseapp.com",
  projectId: "smartevstation-23664",
  storageBucket: "smartevstation-23664.firebasestorage.app",
  messagingSenderId: "529380225373",
  appId: "1:529380225373:web:d35bddd13d93c0b0cf38b4",
  measurementId: "G-WFZG0LFTNE",
};

// Always fully configured — keys are hardcoded for this college project
export const isFirebaseConfigured = true;

// Initialize Firebase singleton
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
