import { useEffect, useState } from 'react';
import CurrentMonthExpense from './components/CurrentMonthExpense';
import ExpenseForm from './components/ExpenseForm';
import HeaderPage from './components/HeaderPage';
import LatestExpensesList from './components/LatestExpensesList';
import OnlyAuthenticated from './components/OnlyAuthenticated';
import SubscriptionForm from './components/SubscriptionForm';
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
    <AuthenticationProvider>
      <HeaderPage>
        <UserLoginForm />

        <OnlyAuthenticated>
          <div style={{ padding: '1rem' }}>
            <ExpensesProvider>
              <CurrentMonthExpense />
              <SubscriptionForm />
              <ExpenseForm />
              <LatestExpensesList />
              <SubscriptionsList />
            </ExpensesProvider>
          </div>
        </OnlyAuthenticated>
      </HeaderPage>
    </AuthenticationProvider>
  );
}

export default App;
