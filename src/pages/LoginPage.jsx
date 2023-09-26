import { LoadingButton } from '@mui/lab';
import { Box, Grid, Typography } from '@mui/material';
import { FirebaseError } from 'firebase/app';
import { useState } from 'react';
import { Link } from 'wouter';
import ErrorMessage from '../components/ErrorMessage';
import GoogleButton from '../components/GoogleButton';
import OrDivider from '../components/OrDivider';
import FilledInput from '../components/common/FilledInput';
import useAuthentication from '../providers/useAuthentication';

/**
 * @typedef {object} FormTarget
 * @property {HTMLInputElement} email
 * @property {HTMLInputElement} password
 */

const LoginPage = () => {
  const { loginWithEmailAndPassword } = useAuthentication();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async () => {
    try {
      setLoading(true);
      setError('');

      await loginWithEmailAndPassword(email, password);
    } catch (error) {
      const setUnkownError = () => {
        setError('It was not possible to login');
      };

      if (error instanceof FirebaseError) {
        const { code } = error;

        /** @type {string[]} */
        const invalidEmailOrPasswordErrors = [
          'auth/user-not-found',
          'auth/invalid-password',
          'auth/invalid-email',
          'auth/missing-password',
        ];

        if (invalidEmailOrPasswordErrors.includes(code)) {
          setError('Invalid email or password');
        } else {
          setUnkownError();
        }
      } else {
        setUnkownError();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container justifyContent="center">
      <Grid
        item
        xs={12}
        sm={10}
        md={4}
        sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}
      >
        <Typography variant="h6">Login</Typography>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            rowGap: '2rem',
            width: '100%',
          }}
        >
          <FilledInput
            id="user-email"
            label="Email"
            email
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <FilledInput
            id="user-password"
            label="Password"
            password
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <LoadingButton
            loading={loading}
            variant="contained"
            onClick={onSubmit}
            sx={{ textTransform: 'none', marginTop: 3 }}
          >
            Submit
          </LoadingButton>
        </div>
        <Box sx={{ marginTop: -3 }}>
          <ErrorMessage>{error}</ErrorMessage>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, marginTop: -1 }}>
          <Typography variant="body1">{`Don't have an account?`}</Typography>
          <Link href="signup" style={{ textDecoration: 'none' }}>
            Sign up
          </Link>
        </Box>
        <OrDivider />
        <GoogleButton />
      </Grid>
    </Grid>
  );
};

export default LoginPage;
