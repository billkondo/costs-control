import { useContext } from 'react';
import { AuthenticationContext } from '../providers/AuthenticationProvider';

/**
 * @typedef {object} FormTarget
 * @property {HTMLInputElement} email
 * @property {HTMLInputElement} password
 */

const UserLoginForm = () => {
  const { authenticated, loginWithEmailAndPassword } = useContext(
    AuthenticationContext
  );

  /**
   * @param {import('react').SyntheticEvent} event
   */
  const onSubmit = async (event) => {
    event.preventDefault();

    /** @type {EventTarget & FormTarget} */
    const target = event.target;

    const email = target.email.value;
    const password = target.password.value;

    await loginWithEmailAndPassword(email, password);
  };

  if (authenticated) {
    return null;
  }

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="user-email">Email</label>
      <input name="email" type="email" id="user-email"></input>
      <label htmlFor="user-passowrd">Password</label>
      <input name="password" type="password" id="user-password"></input>
      <input type="submit" value="Submit" />
    </form>
  );
};

export default UserLoginForm;
