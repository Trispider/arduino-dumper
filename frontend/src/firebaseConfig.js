// ============================================================================
// FIREBASE CONFIGURATION
// File: src/firebaseConfig.js
// ============================================================================
// SETUP STEPS:
//  1. Go to https://console.firebase.google.com
//  2. Create a project (or open existing one)
//  3. Go to Project Settings → General → Your Apps → Add Web App
//  4. Copy the firebaseConfig object and paste below
//  5. In Firebase Console → Authentication → Sign-in method → Enable "Email/Password"
//  6. In Firebase Console → Firestore Database → Create database (for student records)
// ============================================================================

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA7tGPbSlB-UyRfGmfbDCYkJIfn6TWyYzc",
  authDomain: "enterprise-app-mgmt.firebaseapp.com",
  projectId: "enterprise-app-mgmt",
  storageBucket: "enterprise-app-mgmt.firebasestorage.app",
  messagingSenderId: "184126602948",
  appId: "1:184126602948:web:826cebf9f67b2e71641391"
};

// Initialize Firebase
const app  = initializeApp(firebaseConfig);

// Auth instance
export const auth = getAuth(app);

// Firestore instance (for student ID → email lookup)
export const db = getFirestore(app);

export default app;