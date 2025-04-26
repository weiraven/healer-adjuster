import React, { useState }      from 'react';
import { useNavigate, Link }    from 'react-router-dom';
import { supabase }             from '../client';

export default function SignUp() {
  const [email, setEmail]       = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const navigate                = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password
    });

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    const user = signUpData.user;
    if (!user) {
      setError('Unexpected error signing up.');
      return;
    }

    const { error: profileError } = await supabase
      .from('users')
      .insert([{ id: user.id, username }]);

    if (profileError) {
      setError(profileError.message);
      return;
    }

    navigate('/login');
  };

  return (
    <div className="page page--auth">
      <h2>Sign Up</h2>
      {error && <p className="form-error">{error}</p>}
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            required
            className="form-input"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            required
            className="form-input"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            required
            className="form-input"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="button button--primary">
          Create Account
        </button>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </form>
    </div>
  );
}
