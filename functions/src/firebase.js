import { cert, initializeApp } from 'firebase-admin/app';
import FirebaseConfig from '../FirebaseConfig';
import getMode from './utils/getMode';

const firebaseConfig = FirebaseConfig[getMode()];

if (!firebaseConfig) {
  throw new Error('Firebase Admin was not configured correctly');
}

export const app = initializeApp({
  // @ts-ignore
  credential: cert(firebaseConfig),
});
