'use client';
import { useState, useMemo, useEffect, useCallback } from 'react';
import CountUp from '@/components/ui/CountUp';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { authHeaders, API_BASE } from '@/lib/authutils';

// ─── API Types (from PlayersPage) ────────────────────────────────────────────

interface ApiUser {
  id: string;
  fname: string | null;
  lname: string | null;
  email: string;
  photoUrl: string | null;
  elo: number;
  phone: string | null;
  district: string | null;
  state: string | null;
  latitude: number | null;
  longitude: number | null;
  isBanned: boolean;
  createdAt: string;
  updatedAt: string;
  isVerified: boolean;
  userName: string;
  dateOfBirth: string | null;
}

interface ApiResponse {
  success: boolean;
  data: {
    data: ApiUser[];
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
  message: string;
}

// ─── Roster shape (what RosterTable renders) ─────────────────────────────────

interface RosterEntry {
  rank: number;
  name: string;
  handle: string;
  region: string;
  score: number;   // mapped from elo
  wins: number;    // not in API → 0
  delta: number;   // not in API → 0
  status: 'live' | 'active' | 'inactive';
}

interface RosterStat {
  count: number;
  label: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const FILTERS = ['All', 'NA', 'EU', 'APAC'];
const PLAYERS_URL = `${API_BASE}/users`;

/**
 * Derive a best-effort region from district/state strings.
 * Indian users → APAC; everything else → unknown → show as APAC fallback.
 */
function deriveRegion(district: string | null, state: string | null): string {
  // All users coming from the Corpse Arena India backend are APAC.
  // If you later add NA/EU users you can extend this mapping.
  if (district || state) return 'APAC';
  return 'APAC';
}

function mapApiUserToRosterEntry(u: ApiUser, index: number): RosterEntry {
  const nameParts = [u.fname, u.lname].filter(Boolean);
  const name = nameParts.length ? nameParts.join(' ') : u.userName;

  let status: RosterEntry['status'] = 'inactive';
  if (u.isBanned) {
    status = 'inactive';
  } else if (u.isVerified) {
    // Treat the top-ranked verified player as "live", rest as "active"
    status = index === 0 ? 'live' : 'active';
  } else {
    status = 'active';
  }

  return {
    rank: index + 1,
    name,
    handle: `@${u.userName}`,
    region: deriveRegion(u.district, u.state),
    score: u.elo ?? 0,
    wins: 0,    // field not returned by API
    delta: 0,   // field not returned by API
    status,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

const FILTERS_DISPLAY = FILTERS;

export default function RosterTable() {
  // ── Breakpoint ──────────────────────────────────────────────────────────────
  const bp = useBreakpoint();
  const isMobile = bp === 'mobile';
  const isTablet = bp === 'tablet';
  const px = isMobile ? '24px' : isTablet ? '40px' : '80px';

  // ── API state ────────────────────────────────────────────────────────────────
  const [allEntries, setAllEntries] = useState<RosterEntry[]>([]);
  const [rosterStats, setRosterStats] = useState<RosterStat[]>([
    { count: 0, label: 'Total Players' },
    { count: 0, label: 'Verified' },
    { count: 0, label: 'Active' },
    { count: 0, label: 'Banned' },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Filter / search state ────────────────────────────────────────────────────
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  // ── Fetch ALL players (paginate through all pages) ───────────────────────────
  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // First request to get totalPages
      const firstRes = await fetch(
        `${PLAYERS_URL}?page=1&limit=100`,
        { headers: authHeaders() }
      );
      if (!firstRes.ok) throw new Error(`Server error: ${firstRes.status}`);
      const firstJson: ApiResponse = await firstRes.json();
      if (!firstJson.success) throw new Error(firstJson.message || 'Fetch failed');

      const { totalPages, totalCount } = firstJson.data;
      let users: ApiUser[] = [...firstJson.data.data];

      // Fetch remaining pages in parallel
      if (totalPages > 1) {
        const pageNums = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);
        const rest = await Promise.all(
          pageNums.map(p =>
            fetch(`${PLAYERS_URL}?page=${p}&limit=100`, { headers: authHeaders() })
              .then(r => r.json() as Promise<ApiResponse>)
              .then(j => j.data.data)
          )
        );
        users = users.concat(...rest);
      }

      // Sort descending by ELO so rank #1 = highest ELO
      users.sort((a, b) => (b.elo ?? 0) - (a.elo ?? 0));

      const entries = users.map(mapApiUserToRosterEntry);
      setAllEntries(entries);

      // Build stats from full dataset
      const verified = users.filter(u => u.isVerified).length;
      const active = users.filter(u => !u.isBanned).length;
      const banned = users.filter(u => u.isBanned).length;

      setRosterStats([
        { count: totalCount, label: 'Total Players' },
        { count: verified,   label: 'Verified'      },
        { count: active,     label: 'Active'         },
        { count: banned,     label: 'Banned'         },
      ]);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Client-side filter + search ──────────────────────────────────────────────
  const data = useMemo(() => {
    return allEntries.filter(r => {
      const matchRegion = filter === 'All' || r.region === filter;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.handle.toLowerCase().includes(q);
      return matchRegion && matchSearch;
    });
  }, [allEntries, search, filter]);

  // ── Styles ───────────────────────────────────────────────────────────────────
  const inputStyle: React.CSSProperties = {
    background: 'var(--g100)',
    border: '1px solid var(--g200)',
    color: 'var(--white)',
    fontFamily: 'var(--font-ui)',
    fontSize: '13px',
    padding: '10px 14px',
    outline: 'none',
    width: isMobile ? '100%' : '240px',
    borderRadius: 0,
  };

  const rankIcons = ['①', '②', '③'];

  const statusStyle = (status: string): React.CSSProperties => {
    if (status === 'live')
      return { background: 'var(--red)', color: '#fff', border: 'none' };
    if (status === 'active')
      return { background: 'transparent', color: '#2ECC71', border: '1px solid #2ECC71' };
    return { background: 'transparent', color: 'var(--g500)', border: '1px solid var(--g300)' };
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <section style={{ padding: `140px ${px} 60px` }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>

        {/* Header */}
        <div style={{
          display: 'flex',
          flexDirection: isMobile || isTablet ? 'column' : 'row',
          alignItems: isMobile || isTablet ? 'flex-start' : 'flex-end',
          justifyContent: 'space-between',
          marginBottom: '40px',
          gap: '24px',
        }}>
          <div>
            <div
              className="reveal"
              style={{
                fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--red)',
                letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '16px',
              }}
            >
              season 1 · Live standings
            </div>
            <h1
              className="reveal delay-1"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(44px,7vw,88px)',
                color: 'var(--white)',
                textTransform: 'uppercase',
                letterSpacing: '-0.02em',
                lineHeight: 0.92,
              }}
            >
              GLOBAL<br />ROSTER
            </h1>
          </div>

          {/* Search + Filters */}
          <div
            className="reveal"
            style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              gap: '2px',
              alignItems: 'stretch',
              width: isMobile ? '100%' : 'auto',
              flexWrap: 'wrap',
            }}
          >
            <input
              type="text"
              placeholder="Search competitors…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={inputStyle}
              onFocus={e => { e.currentTarget.style.borderColor = 'var(--red)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = 'var(--g200)'; }}
            />
            <div style={{ display: 'flex', gap: '2px', flexWrap: 'wrap' }}>
              {FILTERS_DISPLAY.map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    background: filter === f ? 'var(--red)' : 'var(--g100)',
                    border: `1px solid ${filter === f ? 'var(--red)' : 'var(--g200)'}`,
                    color: filter === f ? '#fff' : 'var(--g500)',
                    fontFamily: 'var(--font-mono)', fontSize: '10px',
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    padding: '10px 14px', cursor: 'none', transition: 'all 150ms',
                    flex: isMobile ? 1 : 'none',
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
          gap: '2px',
          marginBottom: '32px',
        }}>
          {rosterStats.map((stat, i) => (
            <div
              key={i}
              style={{
                background: 'var(--g100)', border: '1px solid var(--g200)',
                padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: '3px',
              }}
            >
              <CountUp
                target={stat.count}
                style={{
                  fontFamily: 'var(--font-display)', fontSize: '32px',
                  color: i === 0 ? 'var(--red)' : 'var(--white)', lineHeight: 1,
                }}
              />
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '9px',
                color: 'var(--g400)', letterSpacing: '0.1em', textTransform: 'uppercase',
              }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '80px 0', color: 'var(--g400)',
            fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.1em',
          }}>
            LOADING ROSTER…
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', padding: '60px 0', gap: '16px',
          }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '11px',
              color: 'var(--red)', letterSpacing: '0.1em',
            }}>
              No players
            </span>
            {/* <button
              onClick={fetchAll}
              style={{
                background: 'var(--g100)', border: '1px solid var(--g300)',
                color: 'var(--white)', fontFamily: 'var(--font-mono)',
                fontSize: '10px', padding: '8px 20px', cursor: 'pointer',
                letterSpacing: '0.1em', textTransform: 'uppercase',
              }}
            >
              RETRY
            </button> */}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && data.length === 0 && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '80px 0', color: 'var(--g400)',
            fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.1em',
          }}>
            NO COMPETITORS FOUND
          </div>
        )}

        {/* Table — horizontally scrollable on mobile */}
        {!loading && !error && data.length > 0 && (
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table style={{
              width: '100%', borderCollapse: 'collapse',
              minWidth: isMobile ? '600px' : 'auto',
            }}>
              <thead>
                <tr>
                  {(
                    ['Rank', '', 'Competitor', 'ELO', 'Wins', !isMobile ? 'Region' : null, 'Delta', 'Status'] as (string | null)[]
                  ).filter(Boolean).map((h, i) => (
                    <th
                      key={i}
                      style={{
                        fontFamily: 'var(--font-mono)', fontSize: '9px',
                        color: 'var(--g400)', letterSpacing: '0.12em',
                        textTransform: 'uppercase', textAlign: 'left',
                        padding: '10px 12px', borderBottom: '1px solid var(--g300)',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map(r => (
                  <tr
                    key={r.rank}
                    style={{ transition: 'background 150ms', cursor: 'none' }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLTableRowElement)
                        .querySelectorAll('td')
                        .forEach(td => { td.style.background = 'var(--g100)'; });
                      const nameEl = (e.currentTarget as HTMLTableRowElement)
                        .querySelector<HTMLElement>('.rt-name');
                      if (nameEl) nameEl.style.color = 'var(--red)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLTableRowElement)
                        .querySelectorAll('td')
                        .forEach(td => { td.style.background = ''; });
                      const nameEl = (e.currentTarget as HTMLTableRowElement)
                        .querySelector<HTMLElement>('.rt-name');
                      if (nameEl) nameEl.style.color = 'var(--white)';
                    }}
                  >
                    {/* Rank */}
                    <td style={{ padding: '12px', borderBottom: '1px solid var(--g200)', verticalAlign: 'middle' }}>
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: '12px',
                        color: r.rank <= 3 ? 'var(--red)' : 'var(--g400)',
                      }}>
                        {r.rank <= 3 ? rankIcons[r.rank - 1] : `#${r.rank}`}
                      </span>
                    </td>

                    {/* Avatar */}
                    <td style={{ padding: '12px', borderBottom: '1px solid var(--g200)', verticalAlign: 'middle' }}>
                      <div style={{
                        width: '32px', height: '32px',
                        background: 'var(--g200)', border: '1px solid var(--g300)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'var(--font-display)', fontSize: '16px', color: 'var(--g400)',
                      }}>
                        {r.name[0]?.toUpperCase() ?? '?'}
                      </div>
                    </td>

                    {/* Competitor name + handle */}
                    <td style={{ padding: '12px', borderBottom: '1px solid var(--g200)', verticalAlign: 'middle' }}>
                      <div
                        className="rt-name"
                        style={{
                          fontFamily: 'var(--font-ui)', fontSize: '14px',
                          color: 'var(--white)', transition: 'color 150ms', whiteSpace: 'nowrap',
                        }}
                      >
                        {r.name}
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--g400)' }}>
                        {r.handle}
                      </div>
                    </td>

                    {/* ELO (score) */}
                    <td style={{ padding: '12px', borderBottom: '1px solid var(--g200)', verticalAlign: 'middle' }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--white)' }}>
                        {r.score.toLocaleString()}
                      </span>
                    </td>

                    {/* Wins */}
                    <td style={{ padding: '12px', borderBottom: '1px solid var(--g200)', verticalAlign: 'middle' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--g500)' }}>
                        {r.wins}
                      </span>
                    </td>

                    {/* Region (hidden on mobile) */}
                    {!isMobile && (
                      <td style={{ padding: '12px', borderBottom: '1px solid var(--g200)', verticalAlign: 'middle' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--g500)' }}>
                          {r.region}
                        </span>
                      </td>
                    )}

                    {/* Delta */}
                    <td style={{ padding: '12px', borderBottom: '1px solid var(--g200)', verticalAlign: 'middle' }}>
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: '11px',
                        color: r.delta > 0 ? '#2ECC71' : r.delta < 0 ? 'var(--red)' : 'var(--g500)',
                      }}>
                        {r.delta > 0 ? `+${r.delta}` : r.delta === 0 ? '—' : r.delta}
                      </span>
                    </td>

                    {/* Status badge */}
                    <td style={{ padding: '12px', borderBottom: '1px solid var(--g200)', verticalAlign: 'middle' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        fontFamily: 'var(--font-mono)', fontSize: '9px',
                        letterSpacing: '0.08em', textTransform: 'uppercase',
                        padding: '3px 9px', borderRadius: '999px',
                        ...statusStyle(r.status),
                      }}>
                        {r.status === 'live' && (
                          <span style={{
                            width: '5px', height: '5px', background: '#fff',
                            borderRadius: '50%', animation: 'blink 1s infinite',
                            display: 'inline-block',
                          }} />
                        )}
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}