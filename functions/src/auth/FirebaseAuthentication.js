import * as firebase from 'firebase-admin';
import * as functions from 'firebase-functions/v2';

/**
 * @param {UserLogin} userLogin
 * @returns {Promise<import('firebase-admin/auth').UserRecord>}
 */
const createUser = async (userLogin) => {
  try {
    const auth = firebase.auth();
    const { email, password, name, timezone } = userLogin;
    const user = await auth.createUser({
      email,
      password,
      displayName: name,
    });
    await auth.setCustomUserClaims(user.uid, { timezone });

    return user;
  } catch (error) {
    if (isFirebaseError(error)) {
      // @ts-ignore
      const code = error.errorInfo.code;

      /** @type {string[]} */
      const emailAlreadyExists = ['auth/email-already-exists'];

      /** @type {string[]} */
      const invalidEmailOrPassword = [
        'auth/invalid-password',
        'auth/invalid-email',
      ];

      if (emailAlreadyExists.includes(code)) {
        throw new functions.https.HttpsError(
          'invalid-argument',
          'Email is already taken'
        );
      }

      if (invalidEmailOrPassword.includes(code)) {
        throw new functions.https.HttpsError(
          'invalid-argument',
          'Invalid email or password'
        );
      }
    }

    throw new functions.https.HttpsError(
      'unknown',
      'It was not possible to create account'
    );
  }
};

/**
 * @param {unknown} error
 */
const isFirebaseError = (error) => {
  // @ts-ignore
  return error.errorInfo && error.errorInfo.code;
};

const FirebaseAuthentication = {
  createUser,
};

export default FirebaseAuthentication;
