import { useState } from 'react';
import Warehouse3DScene from './Warehouse3DScene';
import type { Agent3D } from './Warehouse3DScene';
import './Chapter2.css';

type Mode = 'slotting' | 'replenishment';

export default function Chapter2() {
  const [mode, setMode] = useState<Mode>('slotting');
  const [slottingState, setSlottingState] = useState<'bad' | 'optimised'>('bad');
  const [replenStep, setReplenStep] = useState(0);

  const REPLEN_STEPS = [
    { title: '1. Pick Face Threshold Breach', detail: 'SKU BX-4492 pick-face inventory falls to 4 units (Safety Min: 10 units).' },
    { title: '2. WMS Replenishment Task',   detail: 'WMS auto-issues replenishment task for Pallet PLT-204 from Reserve Rack S-04-B.' },
    { title: '3. Reserve Storage Retrieval',  detail: 'Forklift FL-01 retrieves Pallet PLT-204 from high-bay slot S-04-B.' },
    { title: '4. Transit to Pick Face',      detail: 'AMR-01 shuttles Pallet PLT-204 directly to Pick Face B.' },
    { title: '5. Pick Face Refilled',         detail: 'Pick face refilled to 50 units. Customer order picking resumes!' },
  ];

  const agents: Agent3D[] = mode === 'slotting' ? [
    {
      id: 'plt204-slot',
      x: slottingState === 'bad' ? -12 : 4,
      y: 0,
      z: slottingState === 'bad' ? -12 : 4,
      type: 'pallet',
      color: slottingState === 'bad' ? '#dc2626' : '#059669',
      label: slottingState === 'bad' ? 'PLT-204 (Bad Slot)' : 'PLT-204 (Optimised Slot)'
    }
  ] : [
    {
      id: 'plt204-replen',
      x: replenStep >= 3 ? 18 : 4,
      y: 0,
      z: replenStep >= 3 ? -2 : 4,
      type: replenStep >= 3 ? 'pallet' : 'amr',
      color: replenStep >= 4 ? '#059669' : '#d97706',
      label: replenStep >= 4 ? 'Refilled Pick Face' : 'Replenish AMR-01'
    }
  ];

  const routePath: [number, number, number][] | undefined = mode === 'slotting'
    ? (slottingState === 'bad'
        ? [[-12, 0, -12], [-12, 0, 12], [28, 0, 12]]
        : [[4, 0, 4], [18, 0, 4]])
    : (replenStep >= 2 ? [[4, 0, 4], [18, 0, -2]] : undefined);

  const kpis = mode === 'slotting' ? {
    travelDistance: slottingState === 'bad' ? 248 : 139,
    pickTime: slottingState === 'bad' ? 68 : 34,
    throughput: slottingState === 'bad' ? 109 : 156,
  } : {
    queueLength: replenStep < 4 ? 14 : 2,
    pickTime: replenStep < 4 ? 72 : 38,
    throughput: replenStep < 4 ? 98 : 152,
  };

  return (
    <section className="chapter ch2">
      <div className="ch2__header">
        <p className="chapter-eyebrow">Scene 2 · 3D Storage &amp; Replenishment</p>
        <h1 className="chapter-title">ABC Slotting &amp; Pick-Face Replenishment</h1>
        <p className="chapter-subtitle">
          See how storing fast-moving SKU BX-4492 (Pallet PLT-204) near picking cuts travel distance, and watch the WMS automatically trigger pick-face replenishment when stock drops below threshold.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
        <button className={`btn btn--sm ${mode === 'slotting' ? 'btn--primary' : ''}`} onClick={() => setMode('slotting')}>
          1 · Slotting Optimisation Demo
        </button>
        <button className={`btn btn--sm ${mode === 'replenishment' ? 'btn--primary' : ''}`} onClick={() => setMode('replenishment')}>
          2 · Auto-Replenishment Flow
        </button>
      </div>

      <div className="ch2__body">
        <div className="ch2__scene-wrap" style={{ flex: 1, minHeight: '400px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}>
          <Warehouse3DScene
            isActive={true}
            cameraPreset={mode === 'slotting' ? 'storage' : 'picking'}
            agents={agents}
            routePath={routePath}
            routeColor={mode === 'slotting' && slottingState === 'bad' ? '#dc2626' : '#059669'}
            kpiOverlay={kpis}
            storyTitle={mode === 'slotting' ? (slottingState === 'bad' ? 'Bad Slotting: SKU BX-4492' : 'Optimised Slotting: SKU BX-4492') : REPLEN_STEPS[replenStep].title}
            storyDetail={mode === 'slotting' ? (slottingState === 'bad' ? 'Fast-moving SKU BX-4492 stored in back rack. Long 248m path per pick.' : 'SKU BX-4492 moved near picking. Route shortened to 139m (-44%).') : REPLEN_STEPS[replenStep].detail}
          />
        </div>

        <div className="ch2__panel">
          {mode === 'slotting' ? (
            <div className="explain-box">
              <h3 style={{ color: 'var(--navy)' }}>ABC VELOCITY SLOTTING</h3>
              <p style={{ fontSize: '13px', marginBottom: '14px' }}>
                Class A items (SKU BX-4492) account for 80% of picks. Storing them near picking cuts travel time significantly.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                <button className={`btn btn--sm ${slottingState === 'bad' ? 'btn--danger' : ''}`} onClick={() => setSlottingState('bad')}>
                  ❌ BAD SLOTTING — Far Back Rack (-12, -12)
                </button>
                <button className={`btn btn--sm ${slottingState === 'optimised' ? 'btn--blue' : ''}`} onClick={() => setSlottingState('optimised')}>
                  ✓ OPTIMISED SLOTTING — Near Picking Rack (4, 4)
                </button>
              </div>

              {slottingState === 'bad' ? (
                <div style={{ padding: '10px', background: 'var(--red-dim)', border: '1px solid #fca5a5', borderRadius: 'var(--radius-md)', fontSize: '12px', color: 'var(--red)' }}>
                  <strong>Impact:</strong> Long 248m travel path per pick. Increases travel time and picker fatigue.
                </div>
              ) : (
                <div style={{ padding: '10px', background: 'var(--green-dim)', border: '1px solid #6ee7b7', borderRadius: 'var(--radius-md)', fontSize: '12px', color: 'var(--green)' }}>
                  <strong>Impact:</strong> Route shortened to 139m (-44%). Pick throughput increases to 156 orders/hour!
                </div>
              )}
            </div>
          ) : (
            <div className="explain-box">
              <h3 style={{ color: 'var(--navy)' }}>AUTO-REPLENISHMENT FLOW</h3>
              <p style={{ fontSize: '13px', marginBottom: '12px' }}>
                When pick-face inventory falls below safety min, WMS issues a task to retrieve Pallet PLT-204 from reserve rack S-04-B.
              </p>

              <div style={{ padding: '10px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', marginBottom: '12px' }}>
                <strong style={{ fontSize: '12px', color: 'var(--navy)' }}>{REPLEN_STEPS[replenStep].title}</strong>
                <p style={{ fontSize: '12px', margin: '4px 0 0', color: 'var(--text-2)' }}>{REPLEN_STEPS[replenStep].detail}</p>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn--sm btn--blue" onClick={() => setReplenStep(s => Math.min(REPLEN_STEPS.length - 1, s + 1))} disabled={replenStep >= REPLEN_STEPS.length - 1}>
                  Next Step →
                </button>
                <button className="btn btn--sm btn--ghost" onClick={() => setReplenStep(0)}>
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}