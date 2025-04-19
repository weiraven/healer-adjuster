import React from 'react';

function Welcome() {
    return (
      <div className="page page--welcome">
      <header className="welcome-header">
        <h1 className="welcome-title">Healer Adjuster</h1>
      </header>

      <section className="welcome-content">
        <h3 className="welcome-subtitle">FFXIV raid coordination perfected at your healer's expense.</h3>
        <img
            src="/images/healer-sip.png"
            alt="Marberry"
            className="welcome-image"
          />
        <p>Use the side navigation panel to get started.</p>
      </section>
    </div>
    );
  }

export default Welcome;