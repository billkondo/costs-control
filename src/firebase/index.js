import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import firebaseConfig from './firebaseConfig';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';

/** @type {import('firebase/app').FirebaseApp} */
let app;

/** @type {import('firebase/firestore').Firestore} */
let db;

/** @type {import('firebase/auth').Auth} */
let auth;

/** @type {import('firebase/functions').Functions} */
let functions;

const init = () => {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  functions = getFunctions(app);
  auth = getAuth(app);

  if (import.meta.env.MODE === 'development') {
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectFunctionsEmulator(functions, 'localhost', 5001);
    connectAuthEmulator(auth, 'http://localhost:9099');
  }
};

export { init, app, db, functions, auth };
