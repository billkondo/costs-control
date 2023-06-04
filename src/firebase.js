import { initializeApp } from 'firebase/app';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import firebaseConfig from './firebaseConfig';

/** @type {import('firebase/app').FirebaseApp} */
let app;

/** @type {import('firebase/firestore').Firestore} */
let db;

const init = () => {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);

  if (import.meta.env.MODE === 'development') {
    connectFirestoreEmulator(db, 'localhost', 8080);
  }
};

export { init, app, db };
