import { useEffect, useState } from 'react';
import './App.css';
import UserLoginForm from './components/UserLoginForm';
import { init } from './firebase';
import AuthenticationProvider from './providers/AuthenticationProvider';

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
      </div>
    </AuthenticationProvider>
  );
}

export default App;
