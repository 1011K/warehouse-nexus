import { useState } from 'react';
import WarehouseScene from './WarehouseScene';
import type { ZoneHighlight, AgentPos } from './WarehouseScene';
import './Chapter5.css';

type PickStrategy = 'zone' | 'batch' | 'wave';

export default function Chapter5() {
  const [strategy, setStrategy] = useState<PickStrategy>('zone');

  const highlights: ZoneHighlight[] = strategy === 'zone' ? [
    { zone: 'storage', tone: 'blue' },
    { zone: 'picking', tone: 'cyan' }
  ] : strategy === 'batch' ? [
    { zone: 'storage', tone: 'green' },
    { zone: 'picking', tone: 'green' }
  ] : [
    { zone: 'storage', tone: 'amber' },
    { zone: 'asrs', tone: 'amber' },
    { zone: 'picking', tone: 'amber' },
    { zone: 'packing', tone: 'green' }
  ];

  const route: [number, number][] = strategy === 'zone'
    ? [[250, 200], [350, 200], [450, 200], [670, 130]]
    : strategy === 'batch'
    ? [[220, 100], [350, 350], [480, 150], [670, 130]]
    : [[280, 180], [580, 180], [670, 130]];

  const agents: AgentPos[] = strategy === 'zone' ? [
    { x: 270, y: 200, label: 'Zone A Picker', color: '#1d6ff0', icon: '👷' },
    { x: 420, y: 200, label: 'Zone B Picker', color: '#0891b2', icon: '👷' },
    { x: 670, y: 130, label: 'Pick Tote', color: '#059669', icon: '📦' }
  ] : strategy === 'batch' ? [
    { x: 350, y: 350, label: 'Batch Cart (6 Orders)', color: '#059669', icon: '🛒', pulsing: true }
  ] : [
    { x: 280, y: 180, label: 'Wave 1 (Storage)', color: '#d97706', icon: '⚡', pulsing: true },
    { x: 580, y: 180, label: 'Wave 2 (AS/RS)', color: '#d97706', icon: '⚡', pulsing: true },
    { x: 670, y: 130, label: 'Wave Convergence', color: '#059669', icon: '📦' }
  ];

  const kpis = strategy === 'zone' ? {
    travelDistance: 120, pickTime: 48, queueLength: 6,
  } : strategy === 'batch' ? {
    travelDistance: 95, pickTime: 32, throughput: 168,
  } : {
    travelDistance: 110, pickTime: 24, throughput: 185,
  };

  return (
    <section className="chapter ch5">
      <div className="ch5__header">
        <p className="chapter-eyebrow">Scene 5 · Order Picking Strategies</p>
        <h1 className="chapter-title">Zone, Batch &amp; Wave Picking Routing</h1>
        <p className="chapter-subtitle">
          Picking accounts for over 50% of warehouse operating costs. Watch how worker routing and order grouping alter physical worker routes through storage aisles.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
        <button className={`btn btn--sm ${strategy === 'zone' ? 'btn--primary' : ''}`} onClick={() => setStrategy('zone')}>
          🗂 Zone Picking (Fixed Area Handoff)
        </button>
        <button className={`btn btn--sm ${strategy === 'batch' ? 'btn--primary' : ''}`} onClick={() => setStrategy('batch')}>
          📦 Batch Picking (Multi-Order Cart)
        </button>
        <button className={`btn btn--sm ${strategy === 'wave' ? 'btn--primary' : ''}`} onClick={() => setStrategy('wave')}>
          🌊 Wave Picking (Coordinated Release)
        </button>
      </div>

      <div className="ch5__body">
        <div className="ch5__scene-wrap" style={{ flex: 1, minHeight: '380px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)', background: '#f9f8f5' }}>
          <WarehouseScene
            highlights={highlights}
            route={route}
            routeTone={strategy === 'zone' ? 'blue' : strategy === 'batch' ? 'green' : 'amber'}
            agents={agents}
            kpiOverlay={kpis}
            focusedZone="picking"
          />
        </div>

        <div className="ch5__right">
          <div className="explain-box">
            <h3 style={{ color: 'var(--navy)' }}>{strategy === 'zone' ? 'ZONE PICKING' : strategy === 'batch' ? 'BATCH PICKING' : 'WAVE PICKING'}</h3>
            <p style={{ fontSize: '13px', lineHeight: 1.55 }}>
              {strategy === 'zone' ? 'Pickers specialize in small zones to minimize overall walking.' : strategy === 'batch' ? 'Eliminates repetitive travel through the same aisle for multiple separate orders.' : 'Coordinates picker release with carrier freight departure schedules.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}