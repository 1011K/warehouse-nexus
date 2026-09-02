import { useState } from 'react';
import Warehouse3DScene from './Warehouse3DScene';
import type { Agent3D } from './Warehouse3DScene';
import './Chapter5.css';

type PickStrategy = 'zone' | 'batch' | 'wave';

export default function Chapter5() {
  const [strategy, setStrategy] = useState<PickStrategy>('zone');

  const agents: Agent3D[] = strategy === 'zone' ? [
    { id: 'z1-worker', x: -5, y: 0, z: 0, type: 'amr', color: '#1d6ff0', label: 'Zone A Picker' },
    { id: 'z2-worker', x: 4, y: 0, z: 0, type: 'amr', color: '#0891b2', label: 'Zone B Picker' },
  ] : strategy === 'batch' ? [
    { id: 'batch-cart', x: 0, y: 0, z: 2, type: 'amr', color: '#059669', label: 'Batch Cart (6 Orders)' }
  ] : [
    { id: 'wave1', x: -5, y: 0, z: -4, type: 'amr', color: '#d97706', label: 'Wave 1 (Storage)' },
    { id: 'wave2', x: 12, y: 0, z: 0, type: 'crane', color: '#d97706', label: 'Wave 2 (AS/RS)' },
    { id: 'wave3', x: 18, y: 0, z: -4, type: 'amr', color: '#059669', label: 'Wave Convergence' }
  ];

  const routePath: [number, number, number][] | undefined = strategy === 'zone'
    ? [[-12, 0, 0], [-5, 0, 0], [4, 0, 0], [18, 0, -4]]
    : strategy === 'batch'
    ? [[-12, 0, -8], [-5, 0, 8], [4, 0, -8], [18, 0, -4]]
    : [[-5, 0, -4], [12, 0, 0], [18, 0, -4]];

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
        <p className="chapter-eyebrow">Scene 5 · 3D Order Picking Strategies</p>
        <h1 className="chapter-title">Zone, Batch &amp; Wave Picking Routing</h1>
        <p className="chapter-subtitle">
          Picking accounts for over 50% of warehouse operating costs. Watch how worker routing and order grouping alter physical worker routes through 3D storage aisles.
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
        <div className="ch5__scene-wrap" style={{ flex: 1, minHeight: '400px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}>
          <Warehouse3DScene
            isActive={true}
            cameraPreset="picking"
            agents={agents}
            routePath={routePath}
            routeColor={strategy === 'zone' ? '#1d6ff0' : strategy === 'batch' ? '#059669' : '#d97706'}
            kpiOverlay={kpis}
            storyTitle={strategy === 'zone' ? 'Zone Picking (Fixed Area)' : strategy === 'batch' ? 'Batch Picking (Consolidated Cart)' : 'Wave Picking (Scheduled Release)'}
            storyDetail={strategy === 'zone' ? 'Pickers remain in assigned 3D zones; orders pass via conveyor.' : (strategy === 'batch' ? 'One picker collects items for 6 orders in a single consolidated trip.' : 'All zones and AS/RS cranes pick simultaneously, converging at packing.')}
          />
        </div>

        <div className="ch5__right">
          <div className="explain-box">
            <h3 style={{ color: 'var(--navy)' }}>{strategy === 'zone' ? 'ZONE PICKING' : strategy === 'batch' ? 'BATCH PICKING' : 'WAVE PICKING'}</h3>
            <p style={{ fontSize: '13px', lineHeight: 1.55 }}>
              {strategy === 'zone' ? 'Pickers specialize in small 3D zones to minimize overall walking.' : strategy === 'batch' ? 'Eliminates repetitive travel through the same aisle for multiple separate orders.' : 'Coordinates picker release with carrier freight departure schedules.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}