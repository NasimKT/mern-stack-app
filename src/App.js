import React, { useState } from 'react';
import RegistrationForm from './RegistrationForm';
import SignInForm from './SignInForm';
import './App.css';

function App() {
  const [showRegistration, setShowRegistration] = useState(true);

  const toggleForm = () => {
    setShowRegistration(!showRegistration);
  };

  return (
    <div className="App">
      <div className="form-toggle">
        <button onClick={toggleForm}>
          {showRegistration ? 'Sign In' : 'Register'}
        </button>
      </div>
      {showRegistration ? <RegistrationForm /> : <SignInForm />}
    </div>
  );
}

export default App;
