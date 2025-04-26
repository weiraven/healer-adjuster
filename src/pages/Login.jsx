import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';

function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const { signIn }              = useAuth();
  const nav                      = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await signIn(email, password);
    if (error) setError(error.message);
    else nav('/static');
  };

  return (
    <div className="page page--auth">
      <h2>Log In</h2>
      {error && <p className="form-error">{error}</p>}
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email" required
            value={email}
            onChange={e=>setEmail(e.target.value)}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password" required
            value={password}
            onChange={e=>setPassword(e.target.value)}
            className="form-input"
          />
        </div>
        <button type="submit" className="button button--primary">
          Log In
        </button>
        <p className="auth-switch">
        Need an account? <Link to="/signup">Sign Up</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;