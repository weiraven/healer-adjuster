import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import CreateCharacter from './pages/CreateCharacter';
import CharacterProfile from './pages/CharacterProfile';
import EditCharacter from './pages/EditCharacter';
import StaticOverview from './pages/StaticOverview';
import './App.css';

function Private({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <aside className="app-sidebar">
          <Navigation />
        </aside>

        <main className="app-content">
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/character/new" element={<CreateCharacter />} />
            <Route path="/character/:id" element={<CharacterProfile />} />
            <Route path="/character/:id/edit" element={<EditCharacter />} />
            <Route path="/static" element={<StaticOverview />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;