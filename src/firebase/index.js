import { initializeApp } from 'firebase/app';
import {
  getAuth,
  connectAuthEmulator,
  GoogleAuthProvider,
} from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import FirebaseConfig from './FirebaseConfig';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';
import getMode from '../utils/getMode';
import getRegion from '../../common/getRegion';

const firebaseConfig = FirebaseConfig[getMode()];

if (!firebaseConfig) {
  throw new Error('Firebase Web was not configured correctly');
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const functions = getFunctions(app, getRegion());

const googleProvider = new GoogleAuthProvider();

if (import.meta.env.MODE === 'development') {
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectFunctionsEmulator(functions, 'localhost', 5001);
  connectAuthEmulator(auth, 'http://localhost:9099');
}

export { app, db, functions, auth, googleProvider };
