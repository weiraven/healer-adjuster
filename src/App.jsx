import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Welcome from './pages/Welcome';
import CreateCharacter from './pages/CreateCharacter';
import CharacterProfile from './pages/CharacterProfile';
import EditCharacter from './pages/EditCharacter';
import StaticOverview from './pages/StaticOverview';
import './App.css';

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