import type React from 'react';
import { ZONES, AISLE_C, QUARANTINE_ZONE, type ZoneId, type LiveKpiData, BASE_KPIS } from '../data/simulation';

export type ZoneTone = 'blue' | 'green' | 'amber' | 'red' | 'cyan' | 'default';

export interface ZoneHighlight {
  zone: ZoneId;
  tone: ZoneTone;
}

export interface AgentPos {
  x: number;
  y: number;
  label?: string;
  color?: string;
  stopped?: boolean;
  pulsing?: boolean;
  icon?: string;
}

interface WarehouseSceneProps {
  highlights?: ZoneHighlight[];
  route?: [number, number][];
  routeTone?: 'blue' | 'green' | 'red' | 'cyan' | 'amber';
  altRoute?: [number, number][];
  altRouteTone?: 'blue' | 'green' | 'red' | 'cyan' | 'amber';
  showAisleC?: boolean;
  aisleCBlocked?: boolean;
  showQuarantine?: boolean;
  showConveyor?: boolean;
  agents?: AgentPos[];
  obstaclePt?: [number, number];
  focusedZone?: ZoneId | null;
  isDigitalTwin?: boolean;
  kpiOverlay?: Partial<LiveKpiData>;
  onZoneClick?: (id: ZoneId) => void;
  interactiveZones?: boolean;
  dimUnhighlighted?: boolean;
  overlay?: React.ReactNode;
  className?: string;
}

const TONE_FILL: Record<ZoneTone, string> = {
  blue:    'rgba(29,111,240,0.18)',
  green:   'rgba(5,150,105,0.18)',
  amber:   'rgba(217,119,6,0.18)',
  red:     'rgba(220,38,38,0.18)',
  cyan:    'rgba(8,145,178,0.18)',
  default: 'transparent',
};

const TONE_STROKE: Record<ZoneTone, string> = {
  blue:    '#1d6ff0',
  green:   '#059669',
  amber:   '#d97706',
  red:     '#dc2626',
  cyan:    '#0891b2',
  default: '#d0cdc4',
};

const ROUTE_STROKE: Record<string, string> = {
  amber: '#d97706',
  blue:  '#1d6ff0',
  green: '#059669',
  red:   '#dc2626',
  cyan:  '#0891b2',
};

function pathD(pts: [number, number][]): string {
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ');
}

export default function WarehouseScene({
  highlights = [],
  route,
  routeTone = 'blue',
  altRoute,
  altRouteTone = 'green',
  showAisleC = false,
  aisleCBlocked = false,
  showQuarantine = false,
  showConveyor = true,
  agents = [],
  obstaclePt,
  focusedZone = null,
  isDigitalTwin = false,
  kpiOverlay,
  onZoneClick,
  interactiveZones = false,
  dimUnhighlighted = false,
  overlay,
  className = '',
}: WarehouseSceneProps) {
  const hlMap = new Map(highlights.map(h => [h.zone, h.tone]));
  const kpis: LiveKpiData = { ...BASE_KPIS, ...kpiOverlay };

  // Calculate viewBox zoom transformation based on focusedZone
  let viewBox = "0 0 1000 500";
  if (focusedZone === 'receiving')  viewBox = "0 10 320 480";
  if (focusedZone === 'storage')    viewBox = "170 10 350 480";
  if (focusedZone === 'asrs')       viewBox = "480 10 240 480";
  if (focusedZone === 'picking')   viewBox = "640 10 260 260";
  if (focusedZone === 'packing')   viewBox = "640 240 260 260";
  if (focusedZone === 'dispatch')  viewBox = "780 10 220 480";

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <svg
        viewBox={viewBox}
        className={`wh-scene ${className}`}
        role="img"
        aria-label="Warehouse isometric visualization"
        style={{
          width: '100%',
          height: '100%',
          transition: 'viewBox 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          filter: isDigitalTwin ? 'brightness(0.92) contrast(1.05)' : 'none',
        }}
      >
        <defs>
          <pattern id="whGrid" width="25" height="25" patternUnits="userSpaceOnUse">
            <path d="M 25 0 L 0 0 0 25" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="0.8"/>
          </pattern>
          <pattern id="dtGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(8,145,178,0.12)" strokeWidth="0.8"/>
          </pattern>

          {(['blue','green','red','cyan'] as const).map(t => (
            <marker key={t} id={`arrow-${t}`} markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
              <path d="M0,0 L7,3.5 L0,8 Z" fill={ROUTE_STROKE[t]} />
            </marker>
          ))}

          <filter id="zoneShadow" x="-5%" y="-5%" width="110%" height="115%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.09"/>
          </filter>

          <linearGradient id="asrsGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(5,150,105,0.25)"/>
            <stop offset="100%" stopColor="rgba(5,150,105,0.05)"/>
          </linearGradient>
        </defs>

        {/* Base floor */}
        <rect x="0" y="0" width="1000" height="500" fill="#f9f8f5"/>
        <rect x="0" y="0" width="1000" height="500" fill="url(#whGrid)"/>

        {/* Digital Twin Sensor Grid Overlay */}
        {isDigitalTwin && (
          <rect x="0" y="0" width="1000" height="500" fill="url(#dtGrid)" opacity="0.85"/>
        )}

        {/* Conveyor Belt System */}
        {showConveyor && (
          <g opacity="0.6">
            <path
              d="M 735 235 L 735 265 M 735 460 L 830 460 L 830 250"
              fill="none"
              stroke="#4a5168"
              strokeWidth="4"
              strokeDasharray="6 4"
              style={{ animation: 'conveyorMove 0.8s linear infinite' }}
            />
            <text x="740" y="250" fontSize="8" fontFamily="monospace" fill="#8a8f9e">CONVEYOR</text>
          </g>
        )}

        {/* Zones */}
        {ZONES.map(z => {
          const tone = hlMap.get(z.id) ?? 'default';
          const dim = dimUnhighlighted && hlMap.size > 0 && !hlMap.has(z.id);
          const fill  = TONE_FILL[tone] !== 'transparent' ? TONE_FILL[tone] : z.fill;
          const stroke = TONE_STROKE[tone] !== '#d0cdc4' ? TONE_STROKE[tone] : z.stroke;

          return (
            <g
              key={z.id}
              className={interactiveZones ? 'wh-zone-interactive' : ''}
              onClick={() => onZoneClick?.(z.id)}
              style={{ cursor: interactiveZones ? 'pointer' : 'default', transition: 'opacity 0.3s' }}
              opacity={dim ? 0.25 : 1}
            >
              {/* Main Zone Slab */}
              <rect
                x={z.x} y={z.y} width={z.w} height={z.h}
                rx="6"
                fill={fill}
                stroke={stroke}
                strokeWidth={hlMap.has(z.id) ? 2.5 : 1.2}
                filter="url(#zoneShadow)"
              />

              {/* Isometric Depth Top Face */}
              <rect
                x={z.x} y={z.y} width={z.w} height={10}
                rx="6" fill={stroke} opacity={0.25}
              />

              {/* Zone Label */}
              <text
                x={z.x + z.w / 2}
                y={z.y + z.h - 12}
                textAnchor="middle"
                fontFamily="'IBM Plex Mono', monospace"
                fontSize="10"
                fontWeight="700"
                letterSpacing="1.5"
                fill={TONE_STROKE[tone]}
                opacity={0.9}
              >
                {z.label}
              </text>

              {/* Storage Racks 3D-effect */}
              {z.id === 'storage' && [1,2,3,4,5].map(i => (
                <g key={i} opacity="0.65">
                  <rect
                    x={z.x + 18} y={z.y + 25 + i * 65}
                    width={z.w - 36} height="16"
                    rx="2" fill="#ffffff" stroke={stroke} strokeWidth="1"
                  />
                  <line
                    x1={z.x + 18} y1={z.y + 33 + i * 65}
                    x2={z.x + z.w - 18} y2={z.y + 33 + i * 65}
                    stroke={stroke} strokeWidth="0.8" strokeDasharray="3 3"
                  />
                </g>
              ))}

              {/* AS/RS Automated System Crane Tracks */}
              {z.id === 'asrs' && (
                <g>
                  <rect x={z.x + 10} y={z.y + 15} width={z.w - 20} height={z.h - 30} rx="4" fill="url(#asrsGrad)"/>
                  <line x1={z.x + z.w/2} y1={z.y + 20} x2={z.x + z.w/2} y2={z.y + z.h - 20}
                    stroke={stroke} strokeWidth="2.5" strokeDasharray="8 4"/>
                  {/* AS/RS Crane Carriage */}
                  <rect x={z.x + z.w/2 - 16} y={z.y + 120} width="32" height="18"
                    rx="3" fill={stroke} opacity="0.85"/>
                  <text x={z.x + z.w/2} y={z.y + 132} textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#ffffff" fontWeight="700">ASRS-1</text>
                </g>
              )}

              {/* Packing Table */}
              {z.id === 'packing' && (
                <g opacity="0.75">
                  <rect x={z.x + 15} y={z.y + z.h/2 - 25} width={z.w - 30} height="50" rx="4" fill="#ffffff" stroke={stroke} strokeWidth="1.2"/>
                  <text x={z.x + z.w/2} y={z.y + z.h/2 + 5} textAnchor="middle" fontSize="9" fontFamily="monospace" fill={stroke} fontWeight="600">PACK BENCH</text>
                </g>
              )}

              {/* Receiving Dock Docks & Trucks */}
              {z.id === 'receiving' && (
                <g>
                  {[1,2,3].map(i => (
                    <line key={i} x1={z.x + 8} y1={z.y + 50 + i * 95} x2={z.x + z.w - 8} y2={z.y + 50 + i * 95} stroke={stroke} strokeWidth="1" strokeDasharray="4 4" opacity="0.4"/>
                  ))}
                  {/* Truck 1 */}
                  <g opacity="0.85">
                    <rect x={z.x - 30} y={z.y + 140} width="32" height="55" rx="3" fill="#1a1f2e"/>
                    <rect x={z.x - 48} y={z.y + 148} width="20" height="38" rx="3" fill="#353e54"/>
                    <circle cx={z.x - 38} cy={z.y + 200} r="5" fill="#1a1f2e"/>
                    <circle cx={z.x - 14} cy={z.y + 200} r="5" fill="#1a1f2e"/>
                    <text x={z.x - 38} y={z.y + 170} fontSize="8" fontFamily="monospace" fill="#ffffff">TRK-1</text>
                  </g>
                </g>
              )}

              {/* Dispatch Dock & Outbound Truck */}
              {z.id === 'dispatch' && (
                <g opacity="0.85">
                  <rect x={z.x + z.w - 2} y={z.y + 140} width="32" height="55" rx="3" fill="#1a1f2e"/>
                  <rect x={z.x + z.w + 26} y={z.y + 148} width="20" height="38" rx="3" fill="#353e54"/>
                  <circle cx={z.x + z.w + 10} cy={z.y + 200} r="5" fill="#1a1f2e"/>
                  <circle cx={z.x + z.w + 34} cy={z.y + 200} r="5" fill="#1a1f2e"/>
                  <text x={z.x + z.w + 10} y={z.y + 170} fontSize="8" fontFamily="monospace" fill="#ffffff">OUT-1</text>
                </g>
              )}
            </g>
          );
        })}

        {/* Quarantine Zone */}
        {showQuarantine && (
          <g>
            <rect
              x={QUARANTINE_ZONE.x} y={QUARANTINE_ZONE.y}
              width={QUARANTINE_ZONE.w} height={QUARANTINE_ZONE.h}
              rx="4" fill="rgba(220,38,38,0.12)" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="4 3"
            />
            <text x={QUARANTINE_ZONE.x + QUARANTINE_ZONE.w/2} y={QUARANTINE_ZONE.y + 24} textAnchor="middle" fontSize="14">☣️</text>
            <text x={QUARANTINE_ZONE.x + QUARANTINE_ZONE.w/2} y={QUARANTINE_ZONE.y + 44} textAnchor="middle" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#dc2626">QUARANTINE</text>
          </g>
        )}

        {/* Aisle C overlay */}
        {showAisleC && (
          <g>
            <rect
              x={AISLE_C.x} y={AISLE_C.y} width={AISLE_C.w} height={AISLE_C.h}
              fill={aisleCBlocked ? 'rgba(220,38,38,0.12)' : 'rgba(8,145,178,0.08)'}
              stroke={aisleCBlocked ? '#dc2626' : '#0891b2'}
              strokeWidth={aisleCBlocked ? 2 : 1}
              strokeDasharray={aisleCBlocked ? 'none' : '4 3'}
            />
            <text
              x={AISLE_C.x + AISLE_C.w / 2} y={AISLE_C.y - 8}
              textAnchor="middle"
              fontFamily="'IBM Plex Mono', monospace"
              fontSize="10" fontWeight="700" letterSpacing="1"
              fill={aisleCBlocked ? '#dc2626' : '#0891b2'}
            >
              AISLE C
            </text>
            {aisleCBlocked && (
              <>
                <text x={AISLE_C.x + AISLE_C.w / 2} y={AISLE_C.y + AISLE_C.h / 2 + 10} textAnchor="middle" fontSize="24">⚠️</text>
                <text x={AISLE_C.x + AISLE_C.w / 2} y={AISLE_C.y + AISLE_C.h / 2 + 34} textAnchor="middle" fontFamily="'IBM Plex Mono', monospace" fontSize="8" fontWeight="600" letterSpacing="1" fill="#dc2626">BLOCKED</text>
              </>
            )}
          </g>
        )}

        {/* Obstacle marker */}
        {obstaclePt && (
          <g>
            <circle cx={obstaclePt[0]} cy={obstaclePt[1]} r="14" fill="#dc2626" opacity="0.15"/>
            <circle cx={obstaclePt[0]} cy={obstaclePt[1]} r="9" fill="#dc2626"/>
            <text x={obstaclePt[0]} y={obstaclePt[1]+4} textAnchor="middle" fontSize="11" fill="white" fontWeight="700">!</text>
          </g>
        )}

        {/* Primary route */}
        {route && (
          <path
            d={pathD(route)}
            fill="none"
            stroke={ROUTE_STROKE[routeTone]}
            strokeWidth="2.5"
            strokeDasharray="8 5"
            strokeLinecap="round"
            markerEnd={`url(#arrow-${routeTone})`}
            style={{ animation: 'dashFlow 1.2s linear infinite' }}
          />
        )}

        {/* Alt (rerouted) route */}
        {altRoute && (
          <path
            d={pathD(altRoute)}
            fill="none"
            stroke={ROUTE_STROKE[altRouteTone]}
            strokeWidth="2.5"
            strokeDasharray="8 5"
            strokeLinecap="round"
            markerEnd={`url(#arrow-${altRouteTone})`}
            style={{ animation: 'dashFlow 1.2s linear infinite' }}
          />
        )}

        {/* Agents & Mobile Equipment */}
        {agents.map((a, i) => {
          const col = a.color ?? '#1d6ff0';
          return (
            <g key={i}>
              {a.pulsing && (
                <circle cx={a.x} cy={a.y} r="20" fill={col} opacity="0.15">
                  <animate attributeName="r" from="14" to="26" dur="1.4s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" from="0.25" to="0" dur="1.4s" repeatCount="indefinite"/>
                </circle>
              )}
              <circle
                cx={a.x} cy={a.y} r="11"
                fill={a.stopped ? '#fff' : col}
                stroke={col}
                strokeWidth={a.stopped ? 2.5 : 1.5}
              />
              <text x={a.x} y={a.y + 4} textAnchor="middle" fontSize="10" fill={a.stopped ? col : '#fff'} fontWeight="700">
                {a.icon ? a.icon : a.stopped ? '■' : 'A'}
              </text>
              {a.label && (
                <text
                  x={a.x} y={a.y - 16}
                  textAnchor="middle"
                  fontFamily="'IBM Plex Mono', monospace"
                  fontSize="9" fontWeight="700"
                  fill={col}
                >
                  {a.label}
                </text>
              )}
            </g>
          );
        })}

        {overlay}

        <style>{`
          @keyframes dashFlow { to { stroke-dashoffset: -26; } }
          @keyframes conveyorMove { to { stroke-dashoffset: -20; } }
          .wh-zone-interactive:hover rect:first-child { opacity: 0.85; }
        `}</style>
      </svg>

      {/* Live KPI HUD Overlay on upper right of screen */}
      <div style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        display: 'flex',
        gap: '8px',
        background: 'rgba(255,255,255,0.92)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: '6px 12px',
        boxShadow: 'var(--shadow-sm)',
        backdropFilter: 'blur(4px)',
        zIndex: 20,
        pointerEvents: 'none',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
          <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--text-3)', fontWeight: 700 }}>DIST</span>
          <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--navy)' }}>{kpis.travelDistance}m</span>
        </div>
        <div style={{ width: '1px', background: 'var(--border)' }}/>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
          <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--text-3)', fontWeight: 700 }}>PICK TIME</span>
          <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--navy)' }}>{kpis.pickTime}s</span>
        </div>
        <div style={{ width: '1px', background: 'var(--border)' }}/>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
          <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--text-3)', fontWeight: 700 }}>QUEUE</span>
          <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: kpis.queueLength > 10 ? 'var(--red)' : 'var(--navy)' }}>{kpis.queueLength}</span>
        </div>
        <div style={{ width: '1px', background: 'var(--border)' }}/>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
          <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--text-3)', fontWeight: 700 }}>THROUGHPUT</span>
          <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--green)' }}>{kpis.throughput}/h</span>
        </div>
        <div style={{ marginLeft: '6px', alignSelf: 'center' }}>
          <span className="chip chip--cyan" style={{ fontSize: '8px', padding: '2px 5px' }}>ILLUSTRATIVE SIMULATION</span>
        </div>
      </div>
    </div>
  );
}