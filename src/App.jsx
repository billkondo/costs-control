import { useEffect, useState } from 'react';
import './App.css';
import CurrentMonthExpense from './components/CurrentMonthExpense';
import ExpenseForm from './components/ExpenseForm';
import LatestExpensesList from './components/LatestExpensesList';
import OnlyAuthenticated from './components/OnlyAuthenticated';
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
      <div>
        <UserLoginForm />

        <OnlyAuthenticated>
          <ExpensesProvider>
            <CurrentMonthExpense />
            <ExpenseForm />
            <LatestExpensesList />
          </ExpensesProvider>
        </OnlyAuthenticated>
      </div>
    </AuthenticationProvider>
  );
}

export default App;
