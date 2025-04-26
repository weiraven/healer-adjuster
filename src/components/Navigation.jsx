import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { supabase } from '../client';

function Navigation() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [myStaticId, setMyStaticId] = useState(null);

  useEffect(() => {
    if (!user) {
      setMyStaticId(null);
      return;
    }

    supabase
      .from('statics')
      .select('id')
      .eq('created_by', user.id)
      .single()
      .then(({ data, error }) => {
        if (data && !error) setMyStaticId(data.id);
      });
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <>
      <nav className="app-nav">
        <Link className="nav-link" to="/">Home</Link>
        <Link className="nav-link" to="/static">View Statics</Link>

        {user ? (
          <>
            <Link className="nav-link" to="/static/new">
              Create Static
            </Link>

            {/* If you already own a static, show a direct link */}
            {myStaticId && (
              <Link className="nav-link" to={`/static/${myStaticId}`}>
                My Static
              </Link>
            )}

            <Link
              to="#"
              className="nav-link"
              onClick={e => {
                e.preventDefault();
                handleLogout();
              }}
            >
              Log Out
            </Link>
          </>
        ) : (
          <>
            <Link className="nav-link" to="/login">Log In</Link>
            <Link className="nav-link" to="/signup">Sign Up</Link>
          </>
        )}
      </nav>

      {/* Peeking Cactuar */}
      <img
      src="/images/cactuarShook.png"
      alt="Cactuar peeking"
      className="sidebar-peek"
      />
    </>
  );
}

export default Navigation;
