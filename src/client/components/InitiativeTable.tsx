/**
 * InitiativeTable — expandable tree of initiatives → projects → ideas.
 *
 * Task 9  (read layer)  — all fields display-only.
 * Task 11 (write layer) — when onUpdate + saving props are supplied, tier shows
 *                          an <input type="number"> and project/idea priority
 *                          shows a <select>. F-07 is unaffected: these controls
 *                          never appear in the /doc route.
 */
import { useState } from 'react';

// ─── Types (mirrored from server sidecarTypes.ts, read-only on client) ────────

interface IdeaEntry {
  priority: string;
  lifecycle: string;
  lastUpdated: string;
  notes: string;
}

interface ProjectEntry {
  priority: string;
  ideas: Record<string, IdeaEntry>;
}

interface InitiativeEntry {
  tier: number;
  lastWork: string;
  projects: Record<string, ProjectEntry>;
}

export interface DiscoverData {
  version?: number;
  updated?: string;
  initiatives: Record<string, InitiativeEntry>;
}

interface Props {
  data: DiscoverData;
  /** When provided, editable controls are rendered for tier and priority fields. */
  onUpdate?: (path: string, value: unknown) => Promise<void>;
  /** Set of dot-paths currently in flight — used to render unsaved indicators. */
  saving?: Set<string>;
}

// ─── Editable controls ────────────────────────────────────────────────────────

/** Number input for initiative tier. Posts on blur. */
function TierInput({
  initName,
  defaultValue,
  onUpdate,
  saving,
}: {
  initName: string;
  defaultValue: number;
  onUpdate: (path: string, value: unknown) => Promise<void>;
  saving: Set<string>;
}) {
  const [value, setValue] = useState(String(defaultValue));
  const path = `initiatives.${initName}.tier`;
  const isSaving = saving.has(path);

  return (
    <input
      type="number"
      value={value}
      min={0}
      max={99}
      aria-label={`Tier for ${initName}`}
      style={isSaving ? { ...tierInputStyle, ...savingStyle } : tierInputStyle}
      onChange={e => setValue(e.target.value)}
      onBlur={() => {
        const n = parseInt(value, 10);
        if (!isNaN(n)) void onUpdate(path, n);
      }}
    />
  );
}

const PRIORITY_OPTIONS = ['High', 'Medium', 'Low'] as const;

/** Select for project or idea priority. Posts on change. */
function PrioritySelect({
  path,
  defaultValue,
  onUpdate,
  saving,
  ariaLabel,
}: {
  path: string;
  defaultValue: string;
  onUpdate: (path: string, value: unknown) => Promise<void>;
  saving: Set<string>;
  ariaLabel: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const isSaving = saving.has(path);

  return (
    <select
      value={value}
      aria-label={ariaLabel}
      style={isSaving ? { ...selectStyle, ...savingStyle } : selectStyle}
      onChange={e => {
        setValue(e.target.value);
        void onUpdate(path, e.target.value);
      }}
    >
      {PRIORITY_OPTIONS.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function InitiativeTable({ data, onUpdate, saving = new Set() }: Props) {
  const [expandedInits, setExpandedInits] = useState<Set<string>>(new Set());
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());

  function toggleInit(name: string) {
    setExpandedInits(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name); else next.add(name);
      return next;
    });
  }

  function toggleProject(key: string) {
    setExpandedProjects(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }

  const initiatives = Object.entries(data.initiatives ?? {});

  if (initiatives.length === 0) {
    return <p style={emptyStyle}>No initiatives discovered.</p>;
  }

  return (
    <div style={containerStyle}>
      {initiatives.map(([initName, init]) => {
        const isExpanded = expandedInits.has(initName);
        const lastWork = init.lastWork || '—';
        const projectCount = Object.keys(init.projects ?? {}).length;

        return (
          <div key={initName} style={initBlockStyle}>
            {/* ── Initiative row ────────────────────────────────────────── */}
            <div
              role="button"
              tabIndex={0}
              aria-expanded={isExpanded}
              style={initRowStyle}
              onClick={() => toggleInit(initName)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleInit(initName);
                }
              }}
            >
              <span style={caretStyle}>{isExpanded ? '▾' : '▸'}</span>
              {onUpdate ? (
                <span onClick={e => e.stopPropagation()}>
                  <TierInput
                    initName={initName}
                    defaultValue={init.tier}
                    onUpdate={onUpdate}
                    saving={saving}
                  />
                </span>
              ) : (
                <span style={initMetaStyle}>{init.tier}</span>
              )}
              <span style={initNameStyle}>{initName}</span>
              <span style={initMetaStyle}>
                Last work: {lastWork} · {projectCount} project{projectCount !== 1 ? 's' : ''}
              </span>
            </div>

            {/* ── Expanded: project list ────────────────────────────────── */}
            {isExpanded && (
              <div style={indentStyle}>
                {projectCount === 0 ? (
                  <p style={emptyStyle}>No projects.</p>
                ) : (
                  Object.entries(init.projects ?? {}).map(([projName, proj]) => {
                    const projKey = `${initName}/${projName}`;
                    const isProjExpanded = expandedProjects.has(projKey);
                    const ideaCount = Object.keys(proj.ideas ?? {}).length;
                    const projPriorityPath =
                      `initiatives.${initName}.projects.${projName}.priority`;

                    return (
                      <div key={projName} style={projBlockStyle}>
                        {/* ── Project row ───────────────────────────────── */}
                        <div
                          role="button"
                          tabIndex={0}
                          aria-expanded={isProjExpanded}
                          style={projRowStyle}
                          onClick={() => toggleProject(projKey)}
                          onKeyDown={e => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              toggleProject(projKey);
                            }
                          }}
                        >
                          <span style={caretStyle}>{isProjExpanded ? '▾' : '▸'}</span>
                          <span
                            style={projMetaStyle}
                            onClick={e => e.stopPropagation()}
                          >
                            {onUpdate ? (
                              <PrioritySelect
                                path={projPriorityPath}
                                defaultValue={proj.priority}
                                onUpdate={onUpdate}
                                saving={saving}
                                ariaLabel={`Priority for project ${projName}`}
                              />
                            ) : (
                              <PriorityBadge value={proj.priority} />
                            )}
                          </span>
                          <span style={projNameStyle}>{projName}</span>
                          <span style={projMetaStyle}>
                            {ideaCount} idea{ideaCount !== 1 ? 's' : ''}
                          </span>
                        </div>

                        {/* ── Expanded: idea table ───────────────────────── */}
                        {isProjExpanded && (
                          <div style={indentStyle}>
                            {ideaCount === 0 ? (
                              <p style={emptyStyle}>No ideas discovered.</p>
                            ) : (
                              <div style={{ overflowX: 'auto' }}>
                                <table style={tableStyle}>
                                  <thead>
                                    <tr>
                                      <th style={thStyle}>Idea</th>
                                      <th style={thStyle}>Priority</th>
                                      <th style={thStyle}>Lifecycle</th>
                                      <th style={thStyle}>Last Updated</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {Object.entries(proj.ideas ?? {}).map(
                                      ([ideaName, idea], idx) => {
                                        const ideaPriorityPath =
                                          `initiatives.${initName}.projects.${projName}.ideas.${ideaName}.priority`;

                                        return (
                                          <tr
                                            key={ideaName}
                                            style={idx % 2 === 0 ? rowEvenStyle : rowOddStyle}
                                          >
                                            <td style={tdStyle}>{ideaName}</td>
                                            <td style={tdStyle}>
                                              {onUpdate ? (
                                                <PrioritySelect
                                                  path={ideaPriorityPath}
                                                  defaultValue={idea.priority}
                                                  onUpdate={onUpdate}
                                                  saving={saving}
                                                  ariaLabel={`Priority for idea ${ideaName}`}
                                                />
                                              ) : (
                                                <PriorityBadge value={idea.priority} />
                                              )}
                                            </td>
                                            <td style={tdStyle}>
                                              <LifecycleBadge value={idea.lifecycle} />
                                            </td>
                                            <td style={{ ...tdStyle, ...monoStyle }}>
                                              {idea.lastUpdated}
                                            </td>
                                          </tr>
                                        );
                                      },
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Small badges ─────────────────────────────────────────────────────────────

function PriorityBadge({ value }: { value: string }) {
  const color =
    value === 'High' ? '#15803d' :
    value === 'Medium' ? '#0369a1' :
    value === 'Low' ? '#6b7280' :
    '#374151';
  return <span style={{ color, fontWeight: 500 }}>{value}</span>;
}

function LifecycleBadge({ value }: { value: string }) {
  const isReview = value === 'In Review';
  return (
    <span style={{
      color: isReview ? '#b45309' : '#374151',
      fontWeight: isReview ? 600 : 400,
    }}>
      {value}
    </span>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
};

const initBlockStyle: React.CSSProperties = {
  borderLeft: '3px solid #e5e7eb',
  marginBottom: '0.25rem',
};

const initRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'baseline',
  gap: '0.5rem',
  padding: '0.4rem 0.5rem',
  cursor: 'pointer',
  backgroundColor: '#f3f4f6',
  borderRadius: '4px 4px 0 0',
  userSelect: 'none',
};

const projBlockStyle: React.CSSProperties = {
  marginBottom: '0.15rem',
};

const projRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'baseline',
  gap: '0.5rem',
  padding: '0.3rem 0.5rem',
  cursor: 'pointer',
  backgroundColor: '#f9fafb',
  borderRadius: '3px',
  userSelect: 'none',
};

const indentStyle: React.CSSProperties = {
  paddingLeft: '1.25rem',
  paddingTop: '0.25rem',
  paddingBottom: '0.25rem',
};

const caretStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  color: '#6b7280',
  minWidth: '0.75rem',
};

const initNameStyle: React.CSSProperties = {
  fontWeight: 600,
  fontSize: '0.95rem',
  color: '#111827',
};

const initMetaStyle: React.CSSProperties = {
  fontSize: '0.8rem',
  color: '#6b7280',
  display: 'flex',
  alignItems: 'center',
  gap: '0.25rem',
  flexWrap: 'wrap',
};

const projNameStyle: React.CSSProperties = {
  fontWeight: 500,
  fontSize: '0.875rem',
  color: '#374151',
};

const projMetaStyle: React.CSSProperties = {
  fontSize: '0.8rem',
  color: '#6b7280',
  display: 'flex',
  alignItems: 'center',
  gap: '0.25rem',
  flexWrap: 'wrap',
};

const tableStyle: React.CSSProperties = {
  borderCollapse: 'collapse',
  width: '100%',
  fontSize: '0.8rem',
};

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '0.35rem 0.5rem',
  borderBottom: '2px solid #e5e7eb',
  fontWeight: 600,
  color: '#374151',
  whiteSpace: 'nowrap',
};

const tdStyle: React.CSSProperties = {
  padding: '0.3rem 0.5rem',
  borderBottom: '1px solid #f3f4f6',
  verticalAlign: 'top',
};

const rowEvenStyle: React.CSSProperties = {
  backgroundColor: '#fff',
};

const rowOddStyle: React.CSSProperties = {
  backgroundColor: '#fafafa',
};

const monoStyle: React.CSSProperties = {
  fontFamily: 'monospace',
  fontSize: '0.75rem',
  color: '#9ca3af',
};

const emptyStyle: React.CSSProperties = {
  color: '#9ca3af',
  fontStyle: 'italic',
  fontSize: '0.8rem',
  margin: '0.25rem 0',
};

/** Tier number input — compact, inline with meta text. */
const tierInputStyle: React.CSSProperties = {
  width: '3.5rem',
  padding: '0.1rem 0.25rem',
  fontSize: '0.8rem',
  border: '1px solid #d1d5db',
  borderRadius: '3px',
  textAlign: 'center',
  lineHeight: 1.4,
  verticalAlign: 'middle',
  cursor: 'text',
  backgroundColor: '#fff',
};

/** Priority select — compact inline dropdown. */
const selectStyle: React.CSSProperties = {
  padding: '0.1rem 0.2rem',
  fontSize: '0.78rem',
  border: '1px solid #d1d5db',
  borderRadius: '3px',
  backgroundColor: '#fff',
  cursor: 'pointer',
  verticalAlign: 'middle',
  lineHeight: 1.4,
};

/** Overlay style applied when a POST is in flight. */
const savingStyle: React.CSSProperties = {
  outline: '2px solid #f59e0b',
  outlineOffset: '1px',
};
