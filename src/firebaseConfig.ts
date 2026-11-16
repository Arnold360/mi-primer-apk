// src/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDwCtjWMOQmvS7NDvCwtzg-K4VjNR_-_jQ",
  authDomain: "mibodegaapp-eb2f2.firebaseapp.com",
  projectId: "mibodegaapp-eb2f2",
  storageBucket: "mibodegaapp-eb2f2.firebasestorage.app",
  messagingSenderId: "693377181993",
  appId: "1:693377181993:web:e927aa5332ac49493d6f38",
  measurementId: "G-5JCD2BHEM6"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Inicializamos la base de datos Firestore
export const db = getFirestore(app);
