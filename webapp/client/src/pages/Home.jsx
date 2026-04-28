import { Link } from 'react-router-dom';

const TEAM = [
  { name: 'Anaya Koirala',         role: 'Leader & Data Pipeline & Model Improvements', initials: 'AK', color: '#3b82f6' },
  { name: 'Andy Nguyen',           role: 'Evaluation & Research',                    initials: 'AN', color: '#7c3aed' },
  { name: 'Sunny Ho',              role: 'Data Pipeline & Preprocessing',             initials: 'SH', color: '#10b981' },
  { name: 'Konstantin Vassilyeva', role: 'Model Training & Evaluation',               initials: 'KV', color: '#f59e0b' },
  { name: 'Bealu Kebede',          role: 'Model Training & Documentation',            initials: 'BK', color: '#ef4444' },
  { name: 'Toai Nguyen Cuoc Cong', role: 'Research & Model Training',                 initials: 'TN', color: '#14b8a6' },
];


export default function Home() {
  return (
    <div className="page">
      {/* Hero */}
      <div className="home-hero">
        <div className="home-hero-content">
          <div className="home-tagline">
            <span>🎼</span> Deep Learning · Music Generation · 4th Hour Project · CS 371
          </div>
          <h1 className="home-title">Music Generation <br></br> using LSTM</h1>
          <p className="home-desc">
            An LSTM-based neural network trained to generate novel melodic
            continuations from two distinct musical datasets — classical Chopin
            piano works and traditional German folk songs.
          </p>
          <Link to="/demo" className="home-cta">
            🎵 Listen to Samples
          </Link>
        </div>
      </div>

      {/* About */}
      <div className="home-section">
        <h2 className="section-title">About the Project</h2>
        <p className="section-sub">What we built and why</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="card">
            <div style={{ fontSize: 28, marginBottom: 12 }}>🎹</div>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Two Training Datasets</div>
            <div style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.7 }}>
              We trained on 102 Chopin pieces from the MAESTRO v3.0.0 dataset
              and over 1,700 German folk songs from the Deutschl dataset — two
              stylistically opposite musical traditions.
            </div>
          </div>
          <div className="card">
            <div style={{ fontSize: 28, marginBottom: 12 }}>🤖</div>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Next-Token LSTM</div>
            <div style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.7 }}>
              Music is tokenized into MIDI pitch numbers, rest symbols, and
              duration continuations. A two-layer LSTM predicts the next token
              autoregressively, conditioned on a seed melody.
            </div>
          </div>
          <div className="card">
            <div style={{ fontSize: 28, marginBottom: 12 }}>🎵</div>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Melody Extraction</div>
            <div style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.7 }}>
              A right-hand heuristic isolates the melodic line from full piano
              scores — preferring pitches ≥ C4 and minimizing pitch jumps to
              produce natural-sounding single-voice melodies.
            </div>
          </div>
          <div className="card">
            <div style={{ fontSize: 28, marginBottom: 12 }}>📈</div>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Progressive Training</div>
            <div style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.7 }}>
              We captured outputs at 3, 30, and 90 epochs, making the model's
              musical learning visible. The demo lets you hear every stage side
              by side.
            </div>
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="home-section">
        <h2 className="section-title">The Team</h2>
        <p className="section-sub">Six contributors, one shared love for weird melodies</p>
        <div className="team-grid">
          {TEAM.map(m => (
            <div className="team-card" key={m.name}>
              <div className="team-avatar" style={{ background: m.color }}>
                {m.initials}
              </div>
              <div>
                <div className="team-name">{m.name}</div>
                <div className="team-role">{m.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation cards */}
      <div className="home-section">
        <h2 className="section-title">Explore</h2>
        <p className="section-sub">What you can do in this demo</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
          {[
            { to: '/methodology', icon: '⚙️', label: 'Methodology', desc: 'Full pipeline walkthrough from raw MIDI to generation' },
            { to: '/demo',        icon: '🎵', label: 'Listen & Demo',    desc: 'Compare dataset samples with AI-generated melodies' },
            { to: '/logs',        icon: '📋', label: 'Contribution Logs',desc: 'Weekly hours and task breakdown per team member' },
          ].map(n => (
            <Link
              key={n.to}
              to={n.to}
              style={{ textDecoration: 'none' }}
            >
              <div className="card" style={{ cursor: 'pointer', height: '100%' }}>
                <div style={{ fontSize: 24, marginBottom: 10 }}>{n.icon}</div>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>{n.label}</div>
                <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6 }}>{n.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
