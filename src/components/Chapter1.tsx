import { useState, useEffect } from 'react';
import Warehouse3DScene from './Warehouse3DScene';
import type { Agent3D } from './Warehouse3DScene';
import './Chapter1.css';

const LIFECYCLE_STEPS = [
  { id: 'dock',    preset: 'receiving' as const, label: '1. Inbound Truck IN-07 Docked', detail: 'Inbound freight trailer IN-07 docks at Bay 1 carrying Pallet PLT-204 (SKU BX-4492, Qty 42).' },
  { id: 'unload',  preset: 'receiving' as const, label: '2. Unloading & Staging',       detail: 'Electric forklift unloads Pallet PLT-204 onto Receiving Staging Lane 1.' },
  { id: 'scan',    preset: 'receiving' as const, label: '3. RFID & Barcode Scan',       detail: 'RFID portal gate scans Pallet PLT-204. Reads SKU BX-4492, Batch B-26, Qty 42.' },
  { id: 'quality', preset: 'receiving' as const, label: '4. Quality & GRN Entry',        detail: 'Quality check passed. Goods Receipt Note (GRN) created in Warehouse Management System (WMS).' },
  { id: 'putaway', preset: 'storage' as const,   label: '5. Autonomous Put-away',       detail: 'WMS assigns Storage Slot S-04-B. AMR-01 transports Pallet PLT-204 into reserve racks.' },
  { id: 'stored',  preset: 'storage' as const,   label: '6. Storage Rack Logged',        detail: 'Pallet PLT-204 stored in rack S-04-B and visible to global WMS order allocation.' },
];

export default function Chapter1() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    if (currentStep >= LIFECYCLE_STEPS.length - 1) return;
    const timer = setTimeout(() => {
      setCurrentStep(s => s + 1);
    }, 2800);
    return () => clearTimeout(timer);
  }, [currentStep, isPlaying]);

  const stepData = LIFECYCLE_STEPS[currentStep];

  // 3D Process Agents
  const agents: Agent3D[] = [
    { id: 'truck-in', x: -26, y: 0, z: -8, type: 'truck', color: '#1d6ff0', label: 'IN-07' },
    ...(currentStep >= 1 && currentStep <= 4 ? [
      { id: 'pallet-plt204', x: -20 + currentStep * 3, y: 0, z: -8 + currentStep * 2, type: 'pallet' as const, color: '#0891b2', label: 'PLT-204 (BX-4492)' }
    ] : []),
    ...(currentStep >= 4 ? [
      { id: 'amr-01', x: -5 + (currentStep - 4) * 2, y: 0, z: 0, type: 'amr' as const, color: '#059669', label: 'AMR-01 (Put-away)' }
    ] : [])
  ];

  const routePath: [number, number, number][] | undefined = currentStep >= 4
    ? [[-20, 0, -4], [-5, 0, 0], [4, 0, 0]]
    : undefined;

  return (
    <section className="chapter ch1">
      <div className="ch1__header">
        <p className="chapter-eyebrow">Scene 1 · 3D Inbound Lifecycle</p>
        <h1 className="chapter-title">Truck IN-07 Arrival to Storage Rack S-04-B</h1>
        <p className="chapter-subtitle">
          Watch Pallet PLT-204 (SKU BX-4492) move from inbound Truck IN-07 at Dock 1 through RFID verification, GRN entry in the WMS, and autonomous AMR put-away into Storage Rack S-04-B.
        </p>
      </div>

      <div className="ch1__body">
        <div className="ch1__scene-container" style={{ flex: 1, minHeight: '400px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}>
          <Warehouse3DScene
            isActive={true}
            cameraPreset={stepData.preset}
            agents={agents}
            routePath={routePath}
            routeColor="#059669"
            storyTitle={stepData.label}
            storyDetail={stepData.detail}
          />
        </div>

        <div className="ch1__control-panel">
          <div className="ch1__step-card explain-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span className="chip chip--blue">STAGE {currentStep + 1} OF {LIFECYCLE_STEPS.length}</span>
              <span className="chip chip--green">{stepData.id.toUpperCase()}</span>
            </div>
            <h3 style={{ margin: '0 0 6px', fontSize: '15px', color: 'var(--navy)' }}>{stepData.label}</h3>
            <p style={{ fontSize: '13px', margin: 0, color: 'var(--text-2)', lineHeight: 1.55 }}>{stepData.detail}</p>
          </div>

          <div className="ch1__actions" style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <button className="btn btn--sm" onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? '⏸ Pause' : '▶ Play Sequence'}
            </button>
            <button className="btn btn--sm" onClick={() => setCurrentStep(s => Math.min(LIFECYCLE_STEPS.length - 1, s + 1))} disabled={currentStep >= LIFECYCLE_STEPS.length - 1}>
              Next Step →
            </button>
            <button className="btn btn--sm btn--ghost" onClick={() => { setCurrentStep(0); setIsPlaying(true); }}>
              ↺ Replay
            </button>
          </div>

          <div className="ch1__timeline" style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {LIFECYCLE_STEPS.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => { setCurrentStep(idx); setIsPlaying(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid ' + (idx === currentStep ? 'var(--blue)' : 'var(--border)'),
                  background: idx === currentStep ? 'var(--blue-dim)' : 'var(--surface-2)',
                  fontSize: '11px',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span className="mono" style={{ color: idx <= currentStep ? 'var(--blue)' : 'var(--text-3)', fontWeight: 700 }}>
                  {idx < currentStep ? '✓' : `0${idx + 1}`}
                </span>
                <span style={{ fontWeight: idx === currentStep ? 700 : 500, color: 'var(--navy)' }}>{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}