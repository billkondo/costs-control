import { Button, Grid, TextField } from '@mui/material';
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
    // @ts-ignore
    const target = event.target;

    const email = target.email.value;
    const password = target.password.value;

    await loginWithEmailAndPassword(email, password);
  };

  if (authenticated) {
    return null;
  }

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} sm={10} md={4}>
        <form
          noValidate
          onSubmit={onSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            rowGap: '1rem',
            width: '100%',
          }}
        >
          <TextField id="user-email" label="Email" name="email" type="email" />
          <TextField
            id="user-password"
            label="Password"
            name="password"
            type="password"
          />
          <Button type="submit" variant="contained">
            Submit
          </Button>
        </form>
      </Grid>
    </Grid>
  );
};

export default UserLoginForm;
