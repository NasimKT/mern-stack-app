import React, { useState } from 'react';
import './AdminLoginForm.css'; // You can create a CSS file for styling
import AdminDashboard from './AdminDashboard'; // Import the AdminDashboard component

function AdminLoginForm() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false); // Add a state variable to track login status

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username || formData.username.trim() === '') {
      newErrors.username = 'Username is required';
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch('http://localhost:5000/api/adminlogin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        if (response.status === 200) {
          alert('Admin login successful');
          setIsAdminLoggedIn(true); // Set login status to true
        } else if (response.status === 401) {
          alert('Invalid admin credentials');
          // Display an error message to the admin
        } else {
          alert('Admin login failed');
          // Display an error message to the admin
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  // Conditionally render the AdminDashboard if login is successful
  if (isAdminLoggedIn) {
    return (
      <>
        <AdminDashboard />
        {/* Hide the "Switch to User" button when the admin dashboard is rendered */}
      </>
    );
  }

  return (
    <div className="admin-login-form">
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
          />
          {errors.username && <span className="error">{errors.username}</span>}
        </div>
        <div className="form-group">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>
        <button type="submit">Admin Login</button>
      </form>
    </div>
  );
}

export default AdminLoginForm;
