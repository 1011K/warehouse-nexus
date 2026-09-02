import { useState } from 'react';
import Warehouse3DScene from './Warehouse3DScene';
import type { Agent3D } from './Warehouse3DScene';
import { TECHNOLOGIES } from '../data/technologies';
import './Chapter6.css';

type AutoTab = 'transformation' | 'agv-vs-amr' | 'asrs-hero';

export default function Chapter6() {
  const [tab, setTab] = useState<AutoTab>('transformation');
  const [smartLevel, setSmartLevel] = useState<number>(3);
  const [agvObstacle, setAgvObstacle] = useState(false);
  const [asrsStep, setAsrsStep] = useState(0);

  const activeTechs = TECHNOLOGIES.slice(0, Math.max(1, smartLevel * 2));

  const agvRoute: [number, number, number][] = agvObstacle
    ? [[-12, 0, 0], [-2, 0, 0]] // STOPS at obstacle
    : [[-12, 0, 0], [4, 0, 0], [18, 0, -4]];

  const amrRoute: [number, number, number][] = agvObstacle
    ? [[-12, 0, 0], [-12, 0, -10], [12, 0, -10], [18, 0, -4]] // REROUTES dynamically
    : [[-12, 0, 0], [4, 0, 0], [18, 0, -4]];

  const agents: Agent3D[] = tab === 'agv-vs-amr' ? [
    { id: 'agv-unit', x: agvObstacle ? -2 : 18, y: 0, z: agvObstacle ? 0 : -4, type: 'agv', color: agvObstacle ? '#dc2626' : '#1d6ff0', label: 'AGV (Fixed Path)', stopped: agvObstacle },
    { id: 'amr-unit', x: agvObstacle ? 12 : 18, y: 0, z: agvObstacle ? -10 : -4, type: 'amr', color: '#059669', label: 'AMR (Dynamic Reroute)' }
  ] : tab === 'asrs-hero' ? [
    { id: 'asrs-crane', x: 12, y: asrsStep >= 2 ? 6 : 1, z: asrsStep >= 2 ? 0 : -4, type: 'crane', color: '#059669', label: asrsStep >= 3 ? 'Tote BX-4492 Discharged' : 'ASRS-1 Crane' }
  ] : [
    { id: 'amr-fleet', x: 4, y: 0, z: 0, type: 'amr', color: '#059669', label: 'AMR Fleet Active' }
  ];

  return (
    <section className="chapter ch6">
      <div className="ch6__header">
        <p className="chapter-eyebrow">Scene 6 · Automation &amp; AS/RS</p>
        <h1 className="chapter-title">Warehouse Automation &amp; AS/RS</h1>
        <p className="chapter-subtitle">
          Watch traditional manual paper operations transform into smart automation. Compare <strong>AGV (fixed-route) vs. AMR (dynamic obstacle rerouting)</strong> and execute a high-bay <strong>AS/RS tote retrieval</strong>.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
        <button className={`btn btn--sm ${tab === 'transformation' ? 'btn--primary' : ''}`} onClick={() => setTab('transformation')}>
          1 · Traditional → Smart Slider
        </button>
        <button className={`btn btn--sm ${tab === 'agv-vs-amr' ? 'btn--primary' : ''}`} onClick={() => setTab('agv-vs-amr')}>
          2 · AGV vs AMR Obstacle Test
        </button>
        <button className={`btn btn--sm ${tab === 'asrs-hero' ? 'btn--primary' : ''}`} onClick={() => setTab('asrs-hero')}>
          3 · AS/RS Automated Crane Hero
        </button>
      </div>

      <div className="ch6__body">
        <div className="ch6__scene-wrap" style={{ flex: 1, minHeight: '380px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}>
          <Warehouse3DScene
            cameraPreset={tab === 'asrs-hero' ? 'asrs' : 'overview'}
            agents={agents}
            routePath={tab === 'agv-vs-amr' ? (agvObstacle ? amrRoute : agvRoute) : undefined}
            routeColor={agvObstacle ? '#059669' : '#1d6ff0'}
            storyTitle={tab === 'agv-vs-amr' ? (agvObstacle ? 'Obstacle Placed: AGV Stops vs AMR Reroutes' : 'Standard Clear Path') : tab === 'asrs-hero' ? 'AS/RS Automated Tote Retrieval' : `Smart Automation Level ${smartLevel}`}
            storyDetail={tab === 'agv-vs-amr' ? (agvObstacle ? 'AGV stops at obstacle (fixed path). AMR detects block and reroutes dynamically!' : 'Both follow standard path when clear.') : tab === 'asrs-hero' ? 'ASRS-1 Crane locates Tote BX-4492 in high-bay rack and discharges to conveyor.' : 'Active tech: WMS, RFID, IoT, AGV, AMR, AS/RS.'}
          />
        </div>

        <div className="ch6__right">
          {tab === 'transformation' && (
            <div className="explain-box">
              <h3 style={{ color: 'var(--navy)' }}>TRADITIONAL → SMART TRANSFORM</h3>
              <div style={{ margin: '14px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="mono" style={{ fontSize: '11px', color: 'var(--text-3)' }}>MANUAL</span>
                <input type="range" min={1} max={5} value={smartLevel} onChange={e => setSmartLevel(Number(e.target.value))} style={{ flex: 1, accentColor: 'var(--green)' }}/>
                <span className="mono" style={{ fontSize: '11px', color: 'var(--green)', fontWeight: 700 }}>SMART (LVL {smartLevel})</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {activeTechs.map(t => (
                  <span key={t.id} className="chip chip--green">{t.abbr} — {t.name}</span>
                ))}
              </div>
            </div>
          )}

          {tab === 'agv-vs-amr' && (
            <div className="explain-box">
              <h3 style={{ color: 'var(--navy)' }}>AGV vs. AMR OBSTACLE DEMO</h3>
              <button className={`btn btn--sm ${agvObstacle ? 'btn--danger' : 'btn--blue'}`} onClick={() => setAgvObstacle(!agvObstacle)} style={{ width: '100%', marginBottom: '12px' }}>
                {agvObstacle ? '⚠️ Obstacle Placed in Path' : 'Place Obstacle in Path'}
              </button>
            </div>
          )}

          {tab === 'asrs-hero' && (
            <div className="explain-box">
              <h3 style={{ color: 'var(--navy)' }}>AS/RS AUTOMATED RETRIEVAL</h3>
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <button className="btn btn--sm btn--blue" onClick={() => setAsrsStep(s => Math.min(3, s + 1))} disabled={asrsStep >= 3}>
                  Execute Crane Step →
                </button>
                <button className="btn btn--sm btn--ghost" onClick={() => setAsrsStep(0)}>
                  Reset Crane
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}