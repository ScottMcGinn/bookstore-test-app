import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import RegisterPage from './RegisterPage';
import './LoginPage.css';

function LoginPage() {
  const { login, loading, error } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [localError, setLocalError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setLocalError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username.trim()) {
      setLocalError('Username is required');
      return;
    }
    
    if (!formData.password.trim()) {
      setLocalError('Password is required');
      return;
    }

    try {
      await login(formData.username, formData.password);
    } catch (err) {
      setLocalError(err.message);
    }
  };

  const demoAccounts = [
    { username: 'admin', password: 'admin123', role: 'Admin', description: 'Full system access, manage books and staff' },
    { username: 'staff', password: 'staff123', role: 'Store Staff', description: 'Manage books and view analytics' },
    { username: 'customer', password: 'customer123', role: 'Customer', description: 'Browse books and make purchases' }
  ];

  if (showRegister) {
    return <RegisterPage onBackToLogin={() => setShowRegister(false)} />;
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>📚 Bookstore</h1>
            <p className="login-subtitle">Test Automation Practice App</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form" aria-label="User login form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username"
                disabled={loading}
                aria-label="Username input"
                aria-invalid={!!localError || !!error}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                disabled={loading}
                aria-label="Password input"
                aria-invalid={!!localError || !!error}
              />
            </div>

            {(localError || error) && (
              <div className="error-message" role="alert">
                {localError || error}
              </div>
            )}

            <button 
              type="submit" 
              className="btn-login"
              disabled={loading}
              aria-label="Click to login"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="login-footer">
            <p className="register-prompt">
              For testing a new Customer can be added by clicking
              <button 
                type="button"
                className="link-button"
                onClick={() => setShowRegister(true)}
                aria-label="Register new account"
              >
                here
              </button>
            </p>
          </div>

          <div className="demo-info">
            <h3>Demo Accounts</h3>
            <p className="demo-description">Use these credentials to test different user roles:</p>
            <div className="demo-accounts">
              {demoAccounts.map((account) => (
                <div key={account.username} className="demo-account">
                  <div className="demo-role">{account.role}</div>
                  <div className="demo-credentials">
                    <small><strong>Username:</strong> {account.username}</small>
                    <small><strong>Password:</strong> {account.password}</small>
                  </div>
                  <div className="demo-description-small">{account.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
