import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useEffect, useState } from 'react';
import { Route, Switch } from 'wouter';
import HeaderPage from './components/HeaderPage';
import OnlyAuthenticated from './components/OnlyAuthenticated';
import UserLoginForm from './components/UserLoginForm';
import { init } from './firebase';
import FirebaseFunctions from './firebase/functions';
import CardsPage from './pages/CardsPage';
import MainPage from './pages/MainPage';
import StoresPage from './pages/StoresPage';
import AuthenticationProvider from './providers/AuthenticationProvider';
import CardsProvider from './providers/CardsProvider';
import ExpensesProvider from './providers/ExpensesProvider';
import StoresProvider from './providers/StoresProvider';
import SubscriptionsProvider from './providers/SubscriptionsProvider';

function App() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    init();
    FirebaseFunctions.init();

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
                  <CardsProvider>
                    <StoresProvider>
                      <Switch>
                        <Route path="/">
                          <MainPage />
                        </Route>
                        <Route path="/cards">
                          <CardsPage />
                        </Route>
                        <Route path="/stores">
                          <StoresPage />
                        </Route>
                      </Switch>
                    </StoresProvider>
                  </CardsProvider>
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
