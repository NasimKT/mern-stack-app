import React, { useState } from 'react';
import RegistrationForm from './RegistrationForm';
import SignInForm from './SignInForm';
import AdminLoginForm from './AdminLoginForm';
import AdminDashboard from './AdminDashboard';
import './App.css';

function App() {
  const [currentForm, setCurrentForm] = useState('registration');
  const [isAdminForm, setIsAdminForm] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const toggleForm = () => {
    setCurrentForm(currentForm === 'registration' ? 'signin' : 'registration');
    setIsAdminForm(false);
  };

  const toggleAdminForm = () => {
    setCurrentForm('adminlogin');
    setIsAdminForm(true);
  };

  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true);
  };

  return (
    <div className="App">
      {isAdminLoggedIn ? (
        <AdminDashboard />
      ) : (
        <>
          {isAdminForm ? (
            <AdminLoginForm onAdminLogin={handleAdminLogin} />
          ) : (
            // Render the appropriate form based on currentForm
            renderForm(currentForm)
          )}
          {!isAdminForm && !isAdminLoggedIn && (
            <div className="form-toggle">
              <button onClick={toggleForm}>
                {currentForm === 'registration' ? 'Sign In' : 'Register'}
              </button>
              <button onClick={toggleAdminForm}>Admin Login</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function renderForm(formType) {
  if (formType === 'registration') {
    return (
      <RegistrationForm
        onRegistrationSuccess={() => {
          // You can add logic here to handle registration success if needed.
          alert('Registration successful');
        }}
      />
    );
  } else if (formType === 'signin') {
    return (
      <SignInForm
        onSignInSuccess={() => {
          // You can add logic here to handle sign-in success if needed.
          alert('Sign-in successful');
        }}
      />
    );
  } else if (formType === 'adminlogin') {
    return <AdminLoginForm />;
  } else {
    return null;
  }
}

export default App;
