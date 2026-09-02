import { useState } from 'react';
import Warehouse3DScene from './Warehouse3DScene';
import type { Agent3D } from './Warehouse3DScene';
import { SCENARIOS, type ScenarioDefinition } from '../data/simulation';
import './Chapter7.css';

export default function Chapter7() {
  const [activeScenarioId, setActiveScenarioId] = useState<string>('aisle-blocked');
  const [resolved, setResolved] = useState<boolean>(false);

  const scenario: ScenarioDefinition = SCENARIOS.find(s => s.id === activeScenarioId) || SCENARIOS[0];

  const agents: Agent3D[] = [
    {
      id: 'scen-agent',
      x: scenario.id === 'aisle-blocked' ? (resolved ? 18 : 0) : 0,
      y: 0,
      z: scenario.id === 'aisle-blocked' ? (resolved ? -4 : 0) : 0,
      type: 'amr',
      color: resolved ? '#059669' : '#dc2626',
      label: resolved ? 'WMS Rerouted & Resolved' : scenario.name,
      stopped: !resolved && scenario.id === 'aisle-blocked',
    }
  ];

  const routePath: [number, number, number][] | undefined = scenario.id === 'aisle-blocked'
    ? (resolved ? [[-12, 0, 0], [-12, 0, -10], [12, 0, -10], [18, 0, -4]] : [[-12, 0, 0], [0, 0, 0]])
    : [[-12, 0, 0], [4, 0, 0], [18, 0, -4]];

  return (
    <section className="chapter ch7">
      <div className="ch7__header">
        <p className="chapter-eyebrow">Scene 7 · Digital Twin &amp; Scenario Engine</p>
        <h1 className="chapter-title">Digital Twin Telemetry &amp; Scenarios</h1>
        <p className="chapter-subtitle">
          The <strong>Digital Twin</strong> maps real-time operational data onto the 3D physical warehouse. Trigger real-world disruptions and watch the WMS detect bottlenecks and execute simulated resolutions.
        </p>
      </div>

      <div className="ch7__body">
        <div className="ch7__scene-wrap" style={{ flex: 1, minHeight: '380px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}>
          <Warehouse3DScene
            isDigitalTwin={true}
            cameraPreset="overview"
            agents={agents}
            routePath={routePath}
            routeColor={resolved ? '#059669' : '#dc2626'}
            kpiOverlay={scenario.kpis}
            storyTitle={`${scenario.icon} ${scenario.name} — ${resolved ? 'WMS RESOLVED' : 'DISRUPTION DETECTED'}`}
            storyDetail={resolved ? scenario.resolution : `${scenario.description} ${scenario.impact}`}
          />
        </div>

        <div className="ch7__right">
          <div className="explain-box">
            <h3 style={{ color: 'var(--navy)', marginBottom: '8px' }}>7 OPERATIONAL SCENARIOS</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', marginBottom: '14px' }}>
              {SCENARIOS.map(s => (
                <button
                  key={s.id}
                  className={`btn btn--sm ${activeScenarioId === s.id ? 'btn--primary' : ''}`}
                  onClick={() => { setActiveScenarioId(s.id); setResolved(false); }}
                  style={{ fontSize: '11px', padding: '6px 8px', textAlign: 'left' }}
                >
                  {s.icon} {s.name}
                </button>
              ))}
            </div>

            <button className={`btn btn--sm ${resolved ? 'btn--ghost' : 'btn--blue'}`} onClick={() => setResolved(!resolved)} style={{ width: '100%' }}>
              {resolved ? '↺ Reset Disruption' : '⚡ Execute WMS Optimization & Reroute'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}