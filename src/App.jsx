import { Box, Grid } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useEffect, useState } from 'react';
import AddExpenseButton from './components/AddExpenseButton';
import AddSubscriptionButton from './components/AddSubscriptionButton';
import CurrentMonthExpense from './components/CurrentMonthExpense';
import CurrentMonthExpensesList from './components/CurrentMonthExpensesList';
import CurrentMonthSubscriptionsList from './components/CurrentMonthSubscriptionsList';
import HeaderPage from './components/HeaderPage';
import OnlyAuthenticated from './components/OnlyAuthenticated';
import UserLoginForm from './components/UserLoginForm';
import { init } from './firebase';
import AuthenticationProvider from './providers/AuthenticationProvider';
import ExpensesProvider from './providers/ExpensesProvider';
import SubscriptionsProvider from './providers/SubscriptionsProvider';

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
              <SubscriptionsProvider>
                <ExpensesProvider>
                  <Box
                    sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}
                  >
                    <Box
                      sx={{
                        position: 'relative',
                        display: 'flex',
                        justifyContent: 'center',
                      }}
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
                    </Box>
                    <Box sx={{ display: 'flex', gap: 4 }}>
                      <Grid item xs={12} md={4}>
                        <CurrentMonthExpensesList />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <CurrentMonthSubscriptionsList />
                      </Grid>
                    </Box>
                  </Box>
                </ExpensesProvider>
              </SubscriptionsProvider>
            </div>
          </OnlyAuthenticated>
        </HeaderPage>
      </AuthenticationProvider>
    </LocalizationProvider>
  );
}

export default App;
