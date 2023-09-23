import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Route, Switch } from 'wouter';
import HeaderPage from './components/HeaderPage';
import OnlyAuthenticated from './components/OnlyAuthenticated';
import RedirectAuthenticated from './components/RedirectAuthenticated';
import UserLoginForm from './components/UserLoginForm';
import CardsPage from './pages/CardsPage';
import MainPage from './pages/MainPage';
import SignUpPage from './pages/SignUpPage';
import StoresPage from './pages/StoresPage';
import AuthenticationProvider from './providers/AuthenticationProvider';
import CardsProvider from './providers/CardsProvider';
import ExpensesProvider from './providers/ExpensesProvider';
import StoresProvider from './providers/StoresProvider';
import SubscriptionsProvider from './providers/SubscriptionsProvider';

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <AuthenticationProvider>
        <HeaderPage>
          <Switch>
            <Route path="/signup">
              <RedirectAuthenticated>
                <SignUpPage />
              </RedirectAuthenticated>
            </Route>
            <Route>
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
            </Route>
          </Switch>
        </HeaderPage>
      </AuthenticationProvider>
    </LocalizationProvider>
  );
}

export default App;
