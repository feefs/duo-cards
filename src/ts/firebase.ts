import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyA7RC7k_Qb3Bs2wvRTDQCf0ARN0qapPork',
  authDomain: 'duo-cards.firebaseapp.com',
  projectId: 'duo-cards',
  storageBucket: 'duo-cards.appspot.com',
  messagingSenderId: '1065170188826',
  appId: '1:1065170188826:web:fff3089d9deb25f9556fa3',
  measurementId: 'G-88GXM9KV83',
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
