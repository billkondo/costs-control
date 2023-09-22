import { getFirestore } from 'firebase-admin/firestore';
import { app } from '../firebase';

export const db = getFirestore(app);
