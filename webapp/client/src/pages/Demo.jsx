import { useState, useEffect, useRef } from 'react';

/* ── Helpers ───────────────────────────────────────────────────── */
function seededHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function waveform(name, count = 52) {
  const h = seededHash(name);
  return Array.from({ length: count }, (_, i) => {
    const v =
      Math.abs(Math.sin(h * 0.001 + i * 0.45)) * 0.5 +
      Math.abs(Math.sin(i * 0.18 + h * 0.007)) * 0.35 +
      0.15;
    return Math.min(v, 1);
  });
}

/* ── MIDI player web component wrapper ────────────────────────── */
function MidiPlayerWidget({ src }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current || !src) return;
    ref.current.innerHTML = '';
    const el = document.createElement('midi-player');
    el.setAttribute('src', src);
    el.setAttribute('sound-font', '');
    ref.current.appendChild(el);
    return () => { ref.current && (ref.current.innerHTML = ''); };
  }, [src]);
  return <div ref={ref} />;
}

/* ── Individual track card ─────────────────────────────────────── */
function TrackCard({ track, color, typeLabel }) {
  const [open, setOpen] = useState(false);
  const bars = waveform(track.name);
  const coverBg = `linear-gradient(150deg, ${color}33 0%, ${color}0a 100%)`;
  const icon = typeLabel?.includes('Chopin') ? '🎹'
    : typeLabel?.includes('Folk') ? '🪗'
    : '🤖';

  return (
    <div className="track-card">
      <div className="track-cover" style={{ background: coverBg }}>
        <div className="track-cover-icon">{icon}</div>
        <div className="track-waveform">
          {bars.map((h, i) => (
            <div
              key={i}
              className="wf-bar"
              style={{ height: `${h * 100}%`, background: color + 'bb' }}
            />
          ))}
        </div>
      </div>

      <div className="track-body">
        <div className="track-badges">
          {track.staffPick && (
            <span className="badge badge-green">⭐ Staff Pick</span>
          )}
          {track.funny && (
            <span className="badge badge-amber">😄 Amusing</span>
          )}
        </div>
        <div className="track-name" title={track.name}>{track.name}</div>
        <button
          className="track-open-btn"
          onClick={() => setOpen(v => !v)}
        >
          {open ? '▲ Close Player' : '▶ Play this track'}
        </button>
      </div>

      {open && (
        <div className="track-player-wrap">
          <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 8 }}>
            Playback via Magenta.js · Requires internet for soundfont
          </div>
          <MidiPlayerWidget src={track.url} />
        </div>
      )}
    </div>
  );
}

/* ── Quality dots ──────────────────────────────────────────────── */
function QualityDots({ quality }) {
  const levels = { early: 1, mid: 2, good: 3, chopin: 3 };
  const n = levels[quality] ?? 1;
  return (
    <div className="quality-indicator">
      <div className="quality-dots">
        {[1, 2, 3].map(i => (
          <div key={i} className={`quality-dot${i <= n ? ' filled' : ''}`} />
        ))}
      </div>
      <div className="quality-label">Quality</div>
    </div>
  );
}

/* ── Category section ──────────────────────────────────────────── */
function CategorySection({ cat }) {
  if (!cat.tracks?.length) return (
    <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-3)' }}>
      No tracks found for this category.
    </div>
  );

  return (
    <div>
      <div className="category-header">
        <div className="category-meta">
          <div className="category-title">{cat.label}</div>
          <div className="category-desc">{cat.description}</div>
        </div>
        {cat.type === 'generated' && <QualityDots quality={cat.quality} />}
        {cat.type === 'dataset' && (
          <span
            className="badge"
            style={{ alignSelf: 'flex-start', background: cat.color + '18', color: cat.color }}
          >
            Dataset
          </span>
        )}
      </div>
      <div className="track-grid">
        {cat.tracks.map((track, i) => (
          <TrackCard
            key={i}
            track={track}
            color={cat.color}
            typeLabel={cat.label}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Main Demo page ────────────────────────────────────────────── */
export default function Demo() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [mainTab, setMainTab]       = useState('dataset');
  const [genTab, setGenTab]         = useState('gen-3epochs');
  const [datasetTab, setDatasetTab] = useState('chopin-dataset');

  useEffect(() => {
    fetch('/api/tracks')
      .then(r => r.json())
      .then(data => { setCategories(data); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, []);

  const datasetCats  = categories.filter(c => c.type === 'dataset');
  const generatedCats = categories.filter(c => c.type === 'generated');
  const activeCat = mainTab === 'dataset'
    ? datasetCats.find(c => c.id === datasetTab)
    : generatedCats.find(c => c.id === genTab);

  if (loading) return (
    <div className="page" style={{ textAlign: 'center', paddingTop: 80 }}>
      <div style={{ fontSize: 32, marginBottom: 16 }}>🎵</div>
      <div style={{ color: 'var(--text-2)' }}>Loading tracks…</div>
    </div>
  );

  if (error) return (
    <div className="page" style={{ textAlign: 'center', paddingTop: 80 }}>
      <div style={{ fontSize: 32, marginBottom: 16 }}>⚠️</div>
      <div style={{ color: 'var(--red)' }}>Could not load tracks: {error}</div>
      <div style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 8 }}>
        Make sure the server is running on port 3001.
      </div>
    </div>
  );

  return (
    <div className="page">
      <div className="page-hero">
        <div className="page-tag">🎵 Audio Demo</div>
        <h1 className="page-title">Listen &amp; Compare</h1>
        <p className="page-subtitle">
          Explore dataset samples alongside AI-generated continuations to
          hear how the model learns — or fails to learn — musical structure.
        </p>
      </div>

      {/* Main tabs: Dataset vs Generated */}
      <div className="tab-bar" style={{ marginBottom: 20 }}>
        <button
          className={`tab-btn${mainTab === 'dataset' ? ' active' : ''}`}
          onClick={() => setMainTab('dataset')}
        >
          📁 Dataset Samples
        </button>
        <button
          className={`tab-btn${mainTab === 'generated' ? ' active' : ''}`}
          onClick={() => setMainTab('generated')}
        >
          🤖 AI Generated
        </button>
      </div>

      {/* Dataset sub-tabs */}
      {mainTab === 'dataset' && (
        <>
          <div className="tab-bar" style={{ marginBottom: 28 }}>
            {datasetCats.map(c => (
              <button
                key={c.id}
                className={`tab-btn${datasetTab === c.id ? ' active' : ''}`}
                onClick={() => setDatasetTab(c.id)}
                style={datasetTab !== c.id ? {} : { background: c.color }}
              >
                {c.id === 'chopin-dataset' ? '🎹' : '🪗'} {c.label}
              </button>
            ))}
          </div>
          <div style={{ marginBottom: 12, padding: '12px 16px', background: 'var(--bg-elevated)', borderRadius: 8, border: '1px solid var(--border)' }}>
            <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
              ℹ️ These are the <strong style={{ color: 'var(--text-2)' }}>input melodies</strong> the
              model learned from. Compare them with the generated outputs to hear what it captured.
            </span>
          </div>
          {activeCat && <CategorySection cat={activeCat} />}
        </>
      )}

      {/* Generated sub-tabs */}
      {mainTab === 'generated' && (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4,1fr)',
              gap: 8,
              marginBottom: 28,
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              padding: 6,
              borderRadius: 10,
            }}
          >
            {generatedCats.map(c => (
              <button
                key={c.id}
                className={`tab-btn${genTab === c.id ? ' active' : ''}`}
                onClick={() => setGenTab(c.id)}
                style={genTab === c.id ? { background: c.color } : {}}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Listening guide */}
          <div style={{ marginBottom: 20, padding: '12px 16px', background: 'var(--bg-elevated)', borderRadius: 8, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.8 }}>
              <strong style={{ color: 'var(--text-2)' }}>Listening guide:</strong>{' '}
              <span style={{ color: 'var(--red)' }}>3 epochs</span> — random-sounding, barely musical ·{' '}
              <span style={{ color: 'var(--orange)' }}>30 epochs</span> — rhythm forming, but melodic direction is unstable ·{' '}
              <span style={{ color: 'var(--purple-light)' }}>90 epochs</span> — coherent phrases, folk-song feel ·{' '}
              <span style={{ color: 'var(--blue)' }}>Chopin-trained</span> — longer notes, classical ornaments
            </div>
          </div>

          {activeCat && <CategorySection cat={activeCat} />}
        </>
      )}
    </div>
  );
}
