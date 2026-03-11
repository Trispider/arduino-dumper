// ============================================================================
// AUTH SERVICE
// File: src/authService.js
// All Firebase authentication logic lives here.
// ============================================================================

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';

// ============================================================================
// HOW STUDENT ID → EMAIL WORKS
// ----------------------------------------------------------------------------
// Firebase Authentication uses EMAIL + PASSWORD.
// Students log in with a Student ID (e.g. "STU001") and a password.
//
// We store each student's email in Firestore under:
//   Collection: "students"
//   Document:   "STU001"
//   Fields:     { email: "stu001@tesca.edu", name: "John Doe", ... }
//
// On login, we look up the email from Firestore using the Student ID,
// then pass that email to Firebase signInWithEmailAndPassword().
//
// ALTERNATIVELY (simpler, no Firestore needed):
// You can just build the email directly from the Student ID:
//   email = studentId.toLowerCase() + "@yourdomain.com"
// If all your student emails follow that pattern, skip the Firestore lookup.
// ============================================================================

const STUDENT_EMAIL_DOMAIN = '@tesca.edu'; // Change to your domain

// ---- Option A: Direct email construction (no Firestore needed) ----
const buildEmailFromStudentId = (studentId) => {
  return studentId.toLowerCase() + STUDENT_EMAIL_DOMAIN;
};

// ---- Option B: Firestore lookup (flexible, use if emails vary) ----
const getEmailFromFirestore = async (studentId) => {
  const ref = doc(db, 'students', studentId.toUpperCase());
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error('auth/user-not-found');
  return snap.data().email;
};

// ============================================================================
// LOGIN
// Call this from your LoginPage component.
// Set rememberMe=true to persist login across browser sessions.
// ============================================================================
export const loginWithStudentId = async (studentId, password, rememberMe = false) => {
  // Set persistence based on "Remember Me" checkbox
  const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
  await setPersistence(auth, persistence);

  // --- Choose ONE of the two options below ---

  // Option A: Build email directly (simpler)
  const email = buildEmailFromStudentId(studentId);

  // Option B: Look up email from Firestore (uncomment if needed)
  // const email = await getEmailFromFirestore(studentId);

  // Sign in with Firebase
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

// ============================================================================
// LOGOUT
// ============================================================================
export const logout = async () => {
  await signOut(auth);
};

// ============================================================================
// AUTH STATE LISTENER
// Pass a callback → called with (user) when auth state changes.
// user is null when logged out, Firebase User object when logged in.
// Returns unsubscribe function — call it to stop listening.
// ============================================================================
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// ============================================================================
// PARSE FIREBASE ERROR CODES → HUMAN READABLE
// ============================================================================
export const parseAuthError = (error) => {
  const code = error?.code || error?.message || '';
  const map = {
    'auth/user-not-found':        'Student ID not found. Please check your ID.',
    'auth/wrong-password':        'Incorrect password. Please try again.',
    'auth/invalid-credential':    'Invalid Student ID or password.',
    'auth/invalid-email':         'Invalid Student ID format.',
    'auth/too-many-requests':     'Too many failed attempts. Try again later.',
    'auth/network-request-failed':'Network error. Check your connection.',
    'auth/user-disabled':         'This account has been disabled. Contact your instructor.',
  };
  for (const key of Object.keys(map)) {
    if (code.includes(key)) return map[key];
  }
  return 'Login failed. Please try again or contact your instructor.';
};