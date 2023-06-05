import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '.';

/**
 * @param {() => void} onLogin
 * @param {() => void} onLogout
 * @returns {import('firebase/auth').Unsubscribe}
 */
export const subscribeToAuthStateChange = (onLogin, onLogout) => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (!user) {
      onLogout();
    } else {
      onLogin();
    }
  });

  return unsubscribe;
};

/**
 * @param {string} email
 * @param {string} password
 */
export const loginWithEmailAndPassword = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  const { user } = userCredential;

  return user;
};
