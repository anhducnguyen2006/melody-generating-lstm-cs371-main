const PIPELINE = [
  {
    num: '01',
    icon: '📦',
    title: 'Data Acquisition',
    color: '#6366f1',
    body: (
      <>
        <p>
          Two datasets were used. The <strong>MAESTRO v3.0.0</strong> dataset provides
          high-quality MIDI recordings of professional classical performances —
          we extracted Frédéric Chopin's works (102 unique pieces) using the
          composer metadata CSV. The <strong>Deutschl</strong> dataset contains
          5,365 traditional German folk songs encoded in Kern notation
          (<code>.krn</code> files), organized into 12 stylistic subcategories.
        </p>
        <p>
          Files were split into <code>train</code>, <code>validation</code>, and{' '}
          <code>test</code> sets following the original MAESTRO metadata splits.
        </p>
      </>
    ),
  },
  {
    num: '02',
    icon: '🔄',
    title: 'Format Conversion',
    color: '#3b82f6',
    body: (
      <>
        <p>
          Deutschl <code>.krn</code> files were converted to MIDI using{' '}
          <code>music21</code>'s built-in Kern parser via <code>krn_to_midi.py</code>.
          MAESTRO files were already in MIDI format and needed only relocation
          into the dataset directory.
        </p>
        <p>
          Multithreading (<code>ThreadPoolExecutor</code>) was used for
          batch conversion of all 1,700+ folk songs to keep preprocessing
          time manageable.
        </p>
      </>
    ),
  },
  {
    num: '03',
    icon: '🎼',
    title: 'Melody Extraction',
    color: '#10b981',
    body: (
      <>
        <p>
          Full piano MIDI files contain multiple simultaneous voices (left and
          right hand). To get a single melodic line we apply a{' '}
          <strong>right-hand heuristic</strong>:
        </p>
        <p>
          1. Flatten all parts into a single time-ordered event stream using
          <code>music21</code>.<br />
          2. Group note candidates by onset time (offset in quarter lengths).<br />
          3. Prefer pitches ≥ C4 (MIDI 60) as a proxy for the right-hand register.<br />
          4. Among candidates, pick the note that <strong>minimizes pitch jump</strong>{' '}
          from the previous melody note (ties broken by higher pitch).<br />
          5. Insert <code>Rest</code> events for any temporal gaps to preserve phrasing.
        </p>
        <p>
          Global context (tempo marks, time signatures, key signatures) is
          copied from the source score so that exported melodies maintain
          correct musical context.
        </p>
      </>
    ),
  },
  {
    num: '04',
    icon: '🔢',
    title: 'Tokenization',
    color: '#f59e0b',
    body: (
      <>
        <p>
          Each melody MIDI is converted to a flat sequence of string tokens
          at a resolution of <code>TIME_STEP = 0.25</code> quarter lengths
          (i.e., 16th note granularity):
        </p>
        <p>
          • <code>"60"</code> … <code>"84"</code> — MIDI pitch numbers for active notes<br />
          • <code>"r"</code> — rest (silence)<br />
          • <code>"_"</code> — duration continuation (hold current note/rest for one more step)<br />
          • <code>"/"</code> — file delimiter (separates pieces in the training stream)
        </p>
        <p>
          This yields a vocabulary of <strong>41 tokens</strong> covering pitches
          45–84, rest, continuation, and delimiter. Files are concatenated
          into one long token stream per split; the mapping is saved as a
          JSON lookup table for generation.
        </p>
      </>
    ),
  },
  {
    num: '05',
    icon: '🧠',
    title: 'LSTM Architecture',
    color: '#8b5cf6',
    body: (
      <>
        <table className="arch-table">
          <thead>
            <tr><th>Layer</th><th>Config</th><th>Output Shape</th></tr>
          </thead>
          <tbody>
            {[
              ['Input',    'One-hot encoded tokens',        '[64, 41]'],
              ['LSTM 1',   '256 units, return_sequences=True', '[64, 256]'],
              ['Dropout',  '0.2',                           '[64, 256]'],
              ['LSTM 2',   '256 units',                     '[256]'],
              ['Dense',    '41 units, softmax activation',  '[41]'],
            ].map(([l, c, o]) => (
              <tr key={l}>
                <td><code>{l}</code></td>
                <td style={{ color: 'var(--text-2)' }}>{c}</td>
                <td><code>{o}</code></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: 12, fontSize: 14, color: 'var(--text-2)', lineHeight: 1.7 }}>
          Optimizer: <code>Adam(lr=0.001)</code> · Loss: <code>sparse_categorical_crossentropy</code><br />
          Sequence length: 64 tokens · Batch size: 128 · Training with{' '}
          <code>EarlyStopping</code> and <code>ReduceLROnPlateau</code> callbacks.
        </div>
      </>
    ),
  },
  {
    num: '06',
    icon: '✨',
    title: 'Melody Generation',
    color: '#06b6d4',
    body: (
      <>
        <p>
          Generation is fully autoregressive: given a seed of up to 64 tokens
          (taken from the test set), the model predicts one token at a time.
          Each prediction is sampled using <strong>temperature scaling</strong>:
        </p>
        <p>
          <code>dist = softmax(log(p) / T)</code>
        </p>
        <p>
          Lower temperature (<code>T = 0.3</code>) produces safer, more
          repetitive melodies. Higher temperature (<code>T = 0.8</code>)
          introduces more variety but risks incoherence. Generation stops
          after 300 steps or when the model produces a <code>"/"</code>{' '}
          delimiter token. The integer token stream is decoded back to
          MIDI via music21 and written to disk.
        </p>
      </>
    ),
  },
];

export default function Methodology() {
  return (
    <div className="page">
      <div className="page-hero">
        <div className="page-tag">⚙️ Pipeline</div>
        <h1 className="page-title">How It Works</h1>
        <p className="page-subtitle">
          End-to-end pipeline from raw MIDI files to AI-generated melodies —
          six stages, two datasets, one trained model.
        </p>
      </div>

      <div className="pipeline-steps">
        {PIPELINE.map((step, i) => (
          <div className="pipeline-step" key={step.num}>
            <div className="pipeline-connector">
              <div
                className="pipeline-dot"
                style={{ background: step.color + '22', border: `2px solid ${step.color}` }}
              >
                <span style={{ fontSize: 18 }}>{step.icon}</span>
              </div>
              {i < PIPELINE.length - 1 && <div className="pipeline-line" />}
            </div>
            <div className="pipeline-content">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, marginTop: 8 }}>
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: 11,
                    fontWeight: 700,
                    color: step.color,
                    background: step.color + '18',
                    padding: '2px 8px',
                    borderRadius: 4,
                  }}
                >
                  STEP {step.num}
                </span>
                <span className="pipeline-title" style={{ margin: 0 }}>
                  {step.title}
                </span>
              </div>
              <div className="pipeline-body card">{step.body}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="divider" />

      <div style={{ marginBottom: 32 }}>
        <h2 className="section-title">Two Datasets, Two Styles</h2>
        <p className="section-sub">Training on contrasting datasets reveals what the model actually learns</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 24 }}>🎻</span>
              <span style={{ fontWeight: 700, fontSize: 16 }}>Chopin / MAESTRO</span>
              <span className="badge badge-purple">Classical</span>
            </div>
            <ul style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 2, paddingLeft: 18 }}>
              <li>102 unique Chopin pieces</li>
              <li>Complex chromatic harmonies</li>
              <li>Longer note durations &amp; rubato</li>
              <li>Rich ornamentation patterns</li>
              <li>Romantic-era phrasing arcs</li>
            </ul>
          </div>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 24 }}>🪗</span>
              <span style={{ fontWeight: 700, fontSize: 16 }}>Deutschl Folklore</span>
              <span className="badge badge-green">Folk</span>
            </div>
            <ul style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 2, paddingLeft: 18 }}>
              <li>5,365 folk songs (1,700 as MIDI)</li>
              <li>Simple diatonic melodies</li>
              <li>Short, repetitive phrases</li>
              <li>Consistent rhythmic patterns</li>
              <li>Narrow pitch range</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
