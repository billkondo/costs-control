import { Button, Divider, Grid, Typography } from '@mui/material';
import { useState } from 'react';
import { Link } from 'wouter';
import getUserTimezone from '../../common/getUserTimezone';
import FilledInput from '../components/common/FilledInput';
import { loginWithEmailAndPassword } from '../firebase/auth';
import FirebaseFunctions from '../firebase/functions';

const SignUpPage = () => {
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async () => {
    try {
      setLoading(true);

      await FirebaseFunctions.Auth.addUser({
        email,
        name,
        password,
        timezone: getUserTimezone(),
      });

      await loginWithEmailAndPassword(email, password);
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
          <Button
            onClick={onSubmit}
            variant="contained"
            disabled={loading}
            sx={{ textTransform: 'none', marginTop: 3 }}
          >
            Create account
          </Button>
        </div>
        <Divider />
        <div style={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
          <Typography variant="body1">{`Have an account?`}</Typography>
          <Link href="login" style={{ textDecoration: 'none' }}>
            Login
          </Link>
        </div>
      </Grid>
    </Grid>
  );
};

export default SignUpPage;
