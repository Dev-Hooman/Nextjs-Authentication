

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getRemoteConfig, isSupported } from 'firebase/remote-config';
import { getAnalytics, isSupported as isSupportedAnalytics } from "firebase/analytics";

// Configure Firebase.
const firebaseConfig = {
    apiKey: "AIzaSyD38OjtSNhiNFFVpeaCnRpc2dzc-GFUpWY",
    authDomain: "expense-tracker-d9631.firebaseapp.com",
    projectId: "expense-tracker-d9631",
    storageBucket: "expense-tracker-d9631.appspot.com",
    messagingSenderId: "44715995123",
    appId: "1:44715995123:web:b1914ccaa15caae6152c86",
    measurementId: "G-7ELXQC10DM"
  };

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);