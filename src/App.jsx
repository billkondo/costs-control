import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useEffect, useState } from 'react';
import { Route, Switch } from 'wouter';
import HeaderPage from './components/HeaderPage';
import OnlyAuthenticated from './components/OnlyAuthenticated';
import UserLoginForm from './components/UserLoginForm';
import { init } from './firebase';
import CardsPage from './pages/CardsPage';
import MainPage from './pages/MainPage';
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
                  <Switch>
                    <Route path="/">
                      <MainPage />
                    </Route>
                    <Route path="/cards">
                      <CardsPage />
                    </Route>
                  </Switch>
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
