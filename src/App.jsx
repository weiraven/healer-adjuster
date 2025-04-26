import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './auth/AuthProvider';
import Navigation from './components/Navigation';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import CreateStatic from './pages/CreateStatic';
import CreateCharacter from './pages/CreateCharacter';
import CharacterProfile from './pages/CharacterProfile';
import EditCharacter from './pages/EditCharacter';
import EditStatic from './pages/EditStatic';
import StaticOverview from './pages/StaticOverview';
import StaticDetail from './pages/StaticDetail';
import RaidSchedule from './pages/RaidSchedule';
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
            {/* public pages */}
            <Route path="/" element={<Welcome />} />
            <Route path="/static" element={<StaticOverview />} />
            <Route path="/static/:id" element={<StaticDetail />} />
            <Route path="/character/:id" element={<CharacterProfile />} />
            <Route path="/schedule/:staticId" element={<RaidSchedule />} />

            {/* auth pages */}
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />

            {/* auth-only pages */}
            <Route path="/static/new" element={<Private><CreateStatic /></Private>} />
            <Route path="/static/:id/edit" element={ <Private> <EditStatic /> </Private>} />
            <Route path="/static/:staticId/character/new" element={ <Private> <CreateCharacter /> </Private> } />
            <Route path="/character/:id/edit" element={ <Private> <EditCharacter /> </Private> } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;