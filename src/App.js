import React, { useState } from 'react';
import RegistrationForm from './RegistrationForm';
import SignInForm from './SignInForm';
import AdminLoginForm from './AdminLoginForm';
import AdminDashboard from './AdminDashboard';
import CustomerDashboard from './CustomerDashboard'; // Import the CustomerDashboard component
import './App.css';

function App() {
  const [currentForm, setCurrentForm] = useState('registration');
  const [isAdminForm, setIsAdminForm] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState(false); // Add state for customer login

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

  const handleCustomerLogin = () => {
    setIsCustomerLoggedIn(true);
  };

  return (
    <div className="App">
      {isAdminLoggedIn ? (
        <AdminDashboard />
      ) : (
        <>
          {isCustomerLoggedIn ? (
            <CustomerDashboard /> // Render CustomerDashboard for customer login
          ) : (
            <>
              {isAdminForm ? (
                <AdminLoginForm onAdminLogin={handleAdminLogin} />
              ) : (
                // Render the appropriate form based on currentForm
                renderForm(currentForm, handleCustomerLogin) // Pass handleCustomerLogin as a prop
              )}
              {!isAdminForm && !isAdminLoggedIn && (
                <div className="form-toggle">
                  <button onClick={toggleForm}>
                    {currentForm === 'registration' ? 'Sign In' : 'Register'}
                  </button>
                  <button style={{ background: 'black' }} onClick={toggleAdminForm}>Admin Login</button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

function renderForm(formType, handleCustomerLogin) {
  if (formType === 'registration') {
    return (
      <RegistrationForm
        onRegistrationSuccess={() => {
          // You can add logic here to handle registration success if needed.
          alert('Registration successful');
          handleCustomerLogin(); // Call handleCustomerLogin after successful registration
        }}
      />
    );
  } else if (formType === 'signin') {
    return (
      <SignInForm
        onSignInSuccess={handleCustomerLogin} // Handle customer login after sign-in
      />
    );
  } else if (formType === 'adminlogin') {
    return <AdminLoginForm />;
  } else {
    return null;
  }
}

export default App;
