import { LoadingButton } from '@mui/lab';
import { Box, Grid, Typography } from '@mui/material';
import { FirebaseError } from 'firebase/app';
import { useState } from 'react';
import { Link } from 'wouter';
import ErrorMessage from '../components/ErrorMessage';
import GoogleButton from '../components/GoogleButton';
import OrDivider from '../components/OrDivider';
import FilledInput from '../components/common/FilledInput';
import { loginWithEmailAndPassword } from '../firebase/auth';
import FirebaseFunctions from '../firebase/functions';

const SignUpPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errorName, setErrorName] = useState('');

  const onSubmit = async () => {
    try {
      setError('');
      setErrorName('');

      if (!name) {
        return setErrorName('Name should not be empty');
      }

      setLoading(true);

      await FirebaseFunctions.Auth.addUser({
        email,
        name,
        password,
      });
      await loginWithEmailAndPassword(email, password);
    } catch (error) {
      const setUnknownError = () => {
        setError('It was not possible to create account');
      };

      if (error instanceof FirebaseError) {
        const { message } = error;

        setError(message);
      } else {
        setUnknownError();
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
        <Typography variant="h6">Sign Up</Typography>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            rowGap: '2rem',
            width: '100%',
          }}
        >
          <FilledInput
            id="signup-name"
            label="Name"
            onChange={(event) => {
              const newName = event.target.value;

              setName(newName);
            }}
            errorText={errorName}
          />
          <FilledInput
            id="signup-email"
            label="Email"
            onChange={(event) => {
              const newEmail = event.target.value;

              setEmail(newEmail);
            }}
          />
          <FilledInput
            id="signup-password"
            label="Password"
            password
            onChange={(event) => {
              const newPassword = event.target.value;

              setPassword(newPassword);
            }}
          />
          <LoadingButton
            onClick={onSubmit}
            variant="contained"
            loading={loading}
            sx={{ textTransform: 'none', marginTop: 3 }}
          >
            Create account
          </LoadingButton>
        </div>
        <Box sx={{ marginTop: -3 }}>
          <ErrorMessage>{error}</ErrorMessage>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, marginTop: -1 }}>
          <Typography variant="body1">{`Have an account?`}</Typography>
          <Link href="login" style={{ textDecoration: 'none' }}>
            Login
          </Link>
        </Box>
        <OrDivider />
        <GoogleButton signUp />
      </Grid>
    </Grid>
  );
};

export default SignUpPage;
