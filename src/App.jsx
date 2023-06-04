import { useEffect } from 'react';
import './App.css';
import { init } from './firebase';

function App() {
  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <div>React</div>
    </>
  );
}

export default App;
