import { httpsCallable } from 'firebase/functions';
import { functions } from '..';

/** @type {FunctionCall<AddUserRequest, void>} */
const addUserFunction = httpsCallable(functions, 'addUser');

/**
 * @param {UserLogin} user
 */
const addUser = async (user) => {
  await addUserFunction(user);
};

const Auth = {
  addUser,
};

export default Auth;
