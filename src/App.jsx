import { Box, Grid } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useEffect, useState } from 'react';
import AddExpenseButton from './components/AddExpenseButton';
import AddSubscriptionButton from './components/AddSubscriptionButton';
import CurrentMonthExpense from './components/CurrentMonthExpense';
import HeaderPage from './components/HeaderPage';
import LatestExpensesList from './components/LatestExpensesList';
import OnlyAuthenticated from './components/OnlyAuthenticated';
import SubscriptionsList from './components/SubscriptionsList';
import UserLoginForm from './components/UserLoginForm';
import { init } from './firebase';
import AuthenticationProvider from './providers/AuthenticationProvider';
import ExpensesProvider from './providers/ExpensesProvider';

function App() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    init();

    setInitialized(true);
  }, []);

  if (!initialized) {
    return null;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <AuthenticationProvider>
        <HeaderPage>
          <UserLoginForm />
          <OnlyAuthenticated>
            <div style={{ padding: '1rem' }}>
              <ExpensesProvider>
                <Grid
                  container
                  justifyContent="center"
                  sx={{ position: 'relative' }}
                >
                  <Grid item>
                    <CurrentMonthExpense />
                  </Grid>
                  <Box
                    sx={{
                      position: 'absolute',
                      right: 0,
                      top: -40,
                      gap: 1,
                      display: 'flex',
                    }}
                  >
                    <AddExpenseButton />
                    <AddSubscriptionButton />
                  </Box>
                </Grid>
                <LatestExpensesList />
                <SubscriptionsList />
              </ExpensesProvider>
            </div>
          </OnlyAuthenticated>
        </HeaderPage>
      </AuthenticationProvider>
    </LocalizationProvider>
  );
}

export default App;
