import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import firebaseConfig from './firebaseConfig';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const functions = getFunctions(app);

if (import.meta.env.MODE === 'development') {
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectFunctionsEmulator(functions, 'localhost', 5001);
  connectAuthEmulator(auth, 'http://localhost:9099');
}

export { app, db, functions, auth };
