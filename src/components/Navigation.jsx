import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <>
      <nav className="app-nav">
        <Link className="nav-link" to="/">Home</Link>
        <Link className="nav-link" to="/character/new">Add Character</Link>
        <Link className="nav-link" to="/static">My Static</Link>
      </nav>

      <img
        src="/images/cactuarShook.png"
        alt="Cactuar peeking"
        className="sidebar-peek"
      />
    </>
    
  );
}

export default Navigation;