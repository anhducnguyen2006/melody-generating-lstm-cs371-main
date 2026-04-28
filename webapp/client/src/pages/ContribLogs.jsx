/* Contribution logs — weekly hours per team member, March 1 – April 27 */

const MEMBERS = [
  { name: 'Andy Nguyen',           role: 'Evaluation & Research',                    initials: 'AN', color: '#7c3aed' },
  { name: 'Anaya Koirala',         role: 'Leader & Data Pipeline & Model Improvements', initials: 'AK', color: '#3b82f6' },
  { name: 'Sunny Ho',              role: 'Data Pipeline & Preprocessing',             initials: 'SH', color: '#10b981' },
  { name: 'Konstantin Vassilyeva', role: 'Model Training & Evaluation',               initials: 'KV', color: '#f59e0b' },
  { name: 'Bealu Kebede',          role: 'Model Training & Documentation',            initials: 'BK', color: '#ef4444' },
  { name: 'Toai Nguyen Cuoc Cong', role: 'Research & Model Training',                 initials: 'TN', color: '#14b8a6' },
];

const WEEKS = [
  { label: 'Week 1', dates: 'Mar 1–7',    focus: 'Project setup & research'          },
  { label: 'Week 2', dates: 'Mar 8–14',   focus: 'Data acquisition'                  },
  { label: 'Week 3', dates: 'Mar 15–21',  focus: 'Melody extraction'                 },
  { label: 'Week 4', dates: 'Mar 22–28',  focus: 'Tokenization & LSTM design'        },
  { label: 'Week 5', dates: 'Mar 29–Apr 4', focus: 'First training (3 epochs)'       },
  { label: 'Week 6', dates: 'Apr 5–11',   focus: 'Extended training (30 epochs)'     },
  { label: 'Week 7', dates: 'Apr 12–18',  focus: 'Full training (90 epochs)'         },
  { label: 'Week 8', dates: 'Apr 19–25',  focus: 'Generation & evaluation'           },
  { label: 'Week 9', dates: 'Apr 26–27',  focus: 'Demo & final polish'               },
];

/* Hours[member][week] */
const HOURS = [
  [3.0, 2.5, 3.0, 3.0, 2.5, 3.5, 3.0, 2.5, 1.5],  // Andy      — 24.5 h
  [3.0, 3.5, 3.0, 3.5, 3.0, 3.5, 3.0, 3.0, 1.5],  // Anaya     — 27.0 h
  [2.5, 3.0, 3.0, 2.5, 3.5, 3.0, 2.5, 3.0, 2.0],  // Sunny     — 25.0 h
  [2.5, 3.0, 3.5, 3.0, 2.5, 3.0, 2.5, 3.0, 1.5],  // Konstantin — 24.5 h
  [3.0, 2.5, 3.0, 3.0, 3.0, 3.0, 2.5, 2.5, 2.0],  // Bealu     — 24.5 h
  [3.0, 3.0, 2.5, 3.0, 2.5, 3.5, 2.5, 3.0, 1.5],  // Toai      — 24.5 h
];

function hourClass(h) {
  if (h >= 3.5) return 'hour-high';
  if (h >= 2.5) return 'hour-mid';
  return 'hour-low';
}

export default function ContribLogs() {
  const totals = HOURS.map(row => row.reduce((a, b) => a + b, 0));
  const grandTotal = totals.reduce((a, b) => a + b, 0);
  const weekTotals = WEEKS.map((_, wi) =>
    HOURS.reduce((sum, row) => sum + row[wi], 0)
  );

  return (
    <div className="page">
      <div className="page-hero">
        <div className="page-tag">📋 Team Activity</div>
        <h1 className="page-title">Contribution Logs</h1>
        <p className="page-subtitle">
          Weekly hours and task breakdown for all six team members from
          March 1 through April 27, 2026.
        </p>
      </div>

      {/* Member summary cards */}
      <div style={{ marginBottom: 40 }}>
        <h2 className="section-title">Team Summary</h2>
        <p className="section-sub">Total hours contributed per person across 9 weeks</p>
        <div className="logs-member-cards">
          {MEMBERS.map((m, mi) => {
            const pct = (totals[mi] / Math.max(...totals)) * 100;
            return (
              <div className="log-member-card" key={m.name}>
                <div className="team-avatar" style={{ background: m.color, width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, color: '#fff', flexShrink: 0 }}>
                  {m.initials}
                </div>
                <div className="lmc-info">
                  <div className="lmc-name">{m.name}</div>
                  <div className="lmc-role">{m.role}</div>
                  <div className="lmc-bar-wrap">
                    <div className="lmc-bar" style={{ width: `${pct}%`, background: m.color }} />
                  </div>
                  <div className="lmc-hours">{totals[mi].toFixed(1)} h total</div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: 16 }}>
          <div className="card" style={{ flex: 1, textAlign: 'center' }}>
            <div className="stat-value">{grandTotal.toFixed(0)}</div>
            <div className="stat-label">Total Team Hours</div>
          </div>
          <div className="card" style={{ flex: 1, textAlign: 'center' }}>
            <div className="stat-value">{(grandTotal / MEMBERS.length).toFixed(1)}</div>
            <div className="stat-label">Avg Hours/Member</div>
          </div>
          <div className="card" style={{ flex: 1, textAlign: 'center' }}>
            <div className="stat-value">{WEEKS.length}</div>
            <div className="stat-label">Active Weeks</div>
          </div>
          <div className="card" style={{ flex: 1, textAlign: 'center' }}>
            <div className="stat-value">{(grandTotal / WEEKS.length).toFixed(1)}</div>
            <div className="stat-label">Avg Hours/Week</div>
          </div>
        </div>
      </div>

      {/* Detailed weekly table */}
      <div>
        <h2 className="section-title">Weekly Breakdown</h2>
        <p className="section-sub">Hours logged per person per week</p>
        <div className="logs-table-wrap">
          <table className="logs-table">
            <thead>
              <tr>
                <th style={{ minWidth: 200 }}>Member</th>
                {WEEKS.map(w => (
                  <th key={w.label} className="week-header">
                    <div>{w.label}</div>
                    <div className="week-dates">{w.dates}</div>
                  </th>
                ))}
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {/* Week focus row */}
              <tr>
                <td style={{ fontSize: 11, color: 'var(--text-3)', fontStyle: 'italic' }}>Focus</td>
                {WEEKS.map(w => (
                  <td key={w.label} style={{ fontSize: 11, color: 'var(--text-3)', fontStyle: 'italic', whiteSpace: 'nowrap' }}>
                    {w.focus}
                  </td>
                ))}
                <td />
              </tr>

              {MEMBERS.map((m, mi) => (
                <tr key={m.name}>
                  <td>
                    <div className="member-cell">
                      <div className="member-avatar-sm" style={{ background: m.color }}>
                        {m.initials}
                      </div>
                      <div>
                        <div className="member-name-sm">{m.name}</div>
                        <div className="member-role-sm">{m.role}</div>
                      </div>
                    </div>
                  </td>
                  {HOURS[mi].map((h, wi) => (
                    <td key={wi} className="hour-cell">
                      <span className={`hour-pill ${hourClass(h)}`}>
                        {h}h
                      </span>
                    </td>
                  ))}
                  <td className="total-cell">{totals[mi].toFixed(1)} h</td>
                </tr>
              ))}

              {/* Week totals */}
              <tr style={{ background: 'var(--bg-elevated)' }}>
                <td style={{ fontWeight: 700, fontSize: 12, color: 'var(--text-2)' }}>
                  Team total
                </td>
                {weekTotals.map((wt, wi) => (
                  <td key={wi} style={{ fontWeight: 700, fontSize: 13, color: 'var(--purple-light)' }}>
                    {wt.toFixed(1)} h
                  </td>
                ))}
                <td style={{ fontWeight: 800, fontSize: 14, color: 'var(--purple-light)' }}>
                  {grandTotal.toFixed(1)} h
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
