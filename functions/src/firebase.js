import { cert, initializeApp } from 'firebase-admin/app';
import serviceAccount from '../serviceAccount.json';

export const app = initializeApp({
  // @ts-ignore
  credential: cert(serviceAccount),
});
