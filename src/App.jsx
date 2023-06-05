import { useEffect, useState } from 'react';
import './App.css';
import ExpenseForm from './components/ExpenseForm';
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

        <ExpensesProvider>
          <ExpenseForm />
        </ExpensesProvider>
      </div>
    </AuthenticationProvider>
  );
}

export default App;
