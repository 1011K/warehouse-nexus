import { useState } from 'react';
import WarehouseScene from './WarehouseScene';
import type { AgentPos } from './WarehouseScene';
import './AIControlCentre.css';

type ControlState = 'before-ai' | 'optimising' | 'after-ai';

export default function AIControlCentre() {
  const [state, setState] = useState<ControlState>('before-ai');
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);
  const [selectedAlert, setSelectedAlert] = useState<'maint' | 'slotting' | 'bottleneck' | null>('slotting');

  const isOptimised = state === 'after-ai';

  // Active Multi-AMR Fleet Data
  const amrAgents: AgentPos[] = isOptimised ? [
    { x: 350, y: 120, label: 'AMR-01 (Route A)', color: '#059669', pulsing: true, icon: '🤖' },
    { x: 580, y: 180, label: 'AMR-02 (AS/RS Out)', color: '#0891b2', pulsing: true, icon: '🤖' },
    { x: 735, y: 130, label: 'AMR-03 (Pick Face)', color: '#059669', pulsing: true, icon: '🤖' },
    { x: 895, y: 200, label: 'AMR-07 (Dispatch)', color: '#059669', pulsing: true, icon: '🤖' },
  ] : [
    { x: 330, y: 280, label: 'AMR-01 (STALLED)', color: '#dc2626', stopped: true, icon: '⚠️' },
    { x: 330, y: 320, label: 'AMR-02 (QUEUED)', color: '#d97706', stopped: true, icon: '🤖' },
    { x: 330, y: 360, label: 'AMR-03 (QUEUED)', color: '#d97706', stopped: true, icon: '🤖' },
    { x: 735, y: 130, label: 'AMR-07 (Idle)', color: '#8a8f9e', icon: '🤖' },
  ];

  const routePath: [number, number][] = isOptimised
    ? [[350, 450], [210, 450], [210, 130], [580, 130], [735, 130]] // Dynamic perimeter route
    : [[350, 450], [350, 300], [350, 280]];                         // Congested Aisle C route

  const kpis = isOptimised ? {
    travelDistance: 139,
    pickTime: 32,
    queueLength: 1,
    cycleTime: '12m 40s',
    inventoryAccuracy: 99.9,
    throughput: 185,
  } : {
    travelDistance: 248,
    pickTime: 76,
    queueLength: 18,
    cycleTime: '28m 15s',
    inventoryAccuracy: 98.1,
    throughput: 104,
  };

  const handleOptimise = () => {
    setState('optimising');
    setTimeout(() => {
      setState('after-ai');
    }, 1800);
  };

  return (
    <section className="chapter ai-control">
      <div className="ai-control__header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p className="chapter-eyebrow">MODE 2 · AI WAREHOUSE CONTROL CENTRE</p>
            <h1 className="chapter-title" style={{ fontSize: '26px' }}>Digital Twin Telemetry &amp; AI Optimisation</h1>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className={`btn btn--sm ${showHeatmap ? 'btn--cyan' : 'btn--ghost'}`}
              onClick={() => setShowHeatmap(!showHeatmap)}
            >
              🔥 {showHeatmap ? 'Heatmap ACTIVE' : 'Toggle Heatmap Overlay'}
            </button>
          </div>
        </div>
      </div>

      <div className="ai-control__body">
        {/* Main 2.5D Persistent Visual World */}
        <div className="ai-control__scene-wrap">
          <WarehouseScene
            highlights={isOptimised ? [{ zone: 'storage', tone: 'green' }, { zone: 'picking', tone: 'green' }] : [{ zone: 'storage', tone: 'red' }]}
            route={routePath}
            routeTone={isOptimised ? 'green' : 'red'}
            showAisleC={true}
            aisleCBlocked={!isOptimised}
            agents={amrAgents}
            isDigitalTwin={true}
            kpiOverlay={kpis}
            overlay={showHeatmap && (
              <g opacity="0.35" pointerEvents="none">
                <circle cx="350" cy="280" r="45" fill="#dc2626"><animate attributeName="r" values="35;55;35" dur="2s" repeatCount="indefinite"/></circle>
                <circle cx="735" cy="130" r="35" fill="#d97706"/>
                <circle cx="240" cy="200" r="30" fill="#059669"/>
              </g>
            )}
          />
        </div>

        {/* AI Control Room Telemetry Panel */}
        <div className="ai-control__panel">
          {/* State Comparison Card */}
          <div className="explain-box" style={{ background: 'var(--surface)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span className="mono" style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-3)' }}>CONTROL ROOM STATE</span>
              <span className={`chip ${isOptimised ? 'chip--green' : 'chip--red'}`}>
                {state === 'before-ai' ? '🔴 BEFORE AI (CONGESTED)' : state === 'optimising' ? '⚡ OPTIMISING VECTORS...' : '🟢 AFTER AI (OPTIMISED)'}
              </span>
            </div>

            <p style={{ fontSize: '12px', margin: '0 0 12px', color: 'var(--text-2)', lineHeight: 1.5 }}>
              {state === 'before-ai'
                ? 'Aisle C bottleneck detected. 3 AMRs stalled, picking travel +78%, queue building.'
                : state === 'optimising'
                ? 'Neural dispatch algorithm re-balancing wave pickers and recalculating AMR perimeter routes...'
                : 'AI optimisation complete! Aisle C bottleneck bypassed, travel time reduced by 44%, throughput +78%.'}
            </p>

            {state === 'before-ai' ? (
              <button className="btn btn--sm btn--blue" style={{ width: '100%' }} onClick={handleOptimise}>
                ⚡ RUN AI OPTIMISATION ALGORITHM
              </button>
            ) : (
              <button className="btn btn--sm btn--ghost" style={{ width: '100%' }} onClick={() => setState('before-ai')}>
                ↺ Reset to Before-AI Baseline
              </button>
            )}
          </div>

          {/* AI Insights & Predictive Maintenance Alerts */}
          <div className="explain-box" style={{ marginTop: '12px' }}>
            <div className="mono" style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', marginBottom: '8px' }}>
              PREDICTIVE AI ALERTS (3)
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <button
                className="btn btn--sm"
                style={{ textAlign: 'left', background: selectedAlert === 'slotting' ? 'var(--blue-dim)' : 'var(--surface-2)', borderColor: selectedAlert === 'slotting' ? 'var(--blue)' : 'var(--border)' }}
                onClick={() => setSelectedAlert('slotting')}
              >
                🤖 <strong>AI Slotting Recommendation</strong>
                <div style={{ fontSize: '11px', color: 'var(--text-2)' }}>Move SKU BX-4492 to Rack S-04-B (-44% distance)</div>
              </button>

              <button
                className="btn btn--sm"
                style={{ textAlign: 'left', background: selectedAlert === 'maint' ? 'var(--amber-dim)' : 'var(--surface-2)', borderColor: selectedAlert === 'maint' ? 'var(--amber)' : 'var(--border)' }}
                onClick={() => setSelectedAlert('maint')}
              >
                ⚙️ <strong>Predictive Maintenance Alert</strong>
                <div style={{ fontSize: '11px', color: 'var(--text-2)' }}>ASRS Crane-1 Bearing Temp 82°C (Service in 4h)</div>
              </button>

              <button
                className="btn btn--sm"
                style={{ textAlign: 'left', background: selectedAlert === 'bottleneck' ? 'var(--red-dim)' : 'var(--surface-2)', borderColor: selectedAlert === 'bottleneck' ? 'var(--red)' : 'var(--border)' }}
                onClick={() => setSelectedAlert('bottleneck')}
              >
                🚦 <strong>Dynamic Congestion Warning</strong>
                <div style={{ fontSize: '11px', color: 'var(--text-2)' }}>Aisle C density &gt; 85%. Rerouting active AMRs.</div>
              </button>
            </div>
          </div>

          {/* Comparative Metrics Table */}
          <div className="explain-box" style={{ marginTop: '12px' }}>
            <div className="mono" style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', marginBottom: '8px' }}>
              BEFORE vs AFTER AI IMPACT
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', fontSize: '11px', textAlign: 'center' }}>
              <div style={{ padding: '6px', background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)' }}>
                <span className="mono" style={{ fontSize: '9px', color: 'var(--text-3)' }}>METRIC</span>
                <div style={{ fontWeight: 700, marginTop: '2px' }}>Avg Distance</div>
                <div style={{ fontWeight: 700, marginTop: '2px' }}>Pick Time</div>
                <div style={{ fontWeight: 700, marginTop: '2px' }}>Throughput</div>
              </div>
              <div style={{ padding: '6px', background: 'var(--red-dim)', borderRadius: 'var(--radius-sm)', color: 'var(--red)' }}>
                <span className="mono" style={{ fontSize: '9px' }}>BEFORE AI</span>
                <div style={{ fontWeight: 700, marginTop: '2px' }}>248m</div>
                <div style={{ fontWeight: 700, marginTop: '2px' }}>76s</div>
                <div style={{ fontWeight: 700, marginTop: '2px' }}>104/h</div>
              </div>
              <div style={{ padding: '6px', background: 'var(--green-dim)', borderRadius: 'var(--radius-sm)', color: 'var(--green)' }}>
                <span className="mono" style={{ fontSize: '9px' }}>AFTER AI</span>
                <div style={{ fontWeight: 700, marginTop: '2px' }}>139m (-44%)</div>
                <div style={{ fontWeight: 700, marginTop: '2px' }}>32s (-58%)</div>
                <div style={{ fontWeight: 700, marginTop: '2px' }}>185/h (+78%)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}