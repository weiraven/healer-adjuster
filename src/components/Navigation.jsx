import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';

function Navigation() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <nav className="app-nav">
      <Link className="nav-link" to="/">Home</Link>

      {user ? (
        <>
          <Link className="nav-link" to="/character/new">Add Character</Link>
          <Link className="nav-link" to="/static">My Static</Link>
          <button
            className="nav-link nav-button"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </>
      ) : (
        <>
          <Link className="nav-link" to="/login">Log In</Link>
          <Link className="nav-link" to="/signup">Sign Up</Link>
        </>
      )}
    </nav>
  );
}


export default Navigation;
