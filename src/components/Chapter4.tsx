import { useState, useEffect } from 'react';
import Warehouse3DScene from './Warehouse3DScene';
import type { Agent3D } from './Warehouse3DScene';
import './Chapter4.css';

type Mode = 'cross-dock' | 'fulfilment';

const ORDER_STAGES = [
  { id: 'alloc',  preset: 'storage' as const,  label: '1. Order ORD-2040 Allocated',  detail: 'Customer Order ORD-2040 received in WMS. 3 units of SKU BX-4492 allocated from Pallet PLT-204 in Rack S-04-B.' },
  { id: 'pick',   preset: 'picking' as const,  label: '2. Pick-to-Light Retrieval',  detail: 'Picker retrieves SKU BX-4492 from Pick Face B and confirms scan.' },
  { id: 'convey', preset: 'picking' as const,  label: '3. Conveyor Roller Transport', detail: 'Tote containing Order ORD-2040 travels down roller conveyor to Packing Bench.' },
  { id: 'pack',   preset: 'packing' as const,  label: '4. Packing & Weight Verification', detail: 'Order ORD-2040 packed in carton, shipping label applied, weight verified.' },
  { id: 'stage',  preset: 'dispatch' as const, label: '5. Dispatch Staging',           detail: 'Carton staged at Outbound Dock Bay 4 for FedEx freight route pickup.' },
  { id: 'depart', preset: 'dispatch' as const, label: '6. Truck OUT-01 Departure',    detail: 'Carton loaded onto Truck OUT-01, manifest closed in WMS, truck departs.' },
];

export default function Chapter4() {
  const [mode, setMode] = useState<Mode>('fulfilment');
  const [crossDockType, setCrossDockType] = useState<'normal' | 'cross-dock'>('normal');
  const [fulfilStep, setFulfilStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying || mode !== 'fulfilment') return;
    if (fulfilStep >= ORDER_STAGES.length - 1) return;
    const timer = setTimeout(() => {
      setFulfilStep(s => s + 1);
    }, 2800);
    return () => clearTimeout(timer);
  }, [fulfilStep, isPlaying, mode]);

  const currentStage = ORDER_STAGES[fulfilStep];

  const agents: Agent3D[] = mode === 'cross-dock' ? [
    { id: 'cross-dock-agent', x: crossDockType === 'normal' ? 4 : 0, y: 0, z: crossDockType === 'normal' ? 4 : 0, type: 'pallet', color: crossDockType === 'normal' ? '#1d6ff0' : '#0891b2', label: crossDockType === 'normal' ? 'Standard Storage Flow' : 'Direct Cross-Dock' }
  ] : [
    {
      id: 'ord2040-agent',
      x: fulfilStep === 0 ? 4 : fulfilStep === 1 ? 18 : fulfilStep <= 3 ? 18 : 28,
      y: 0,
      z: fulfilStep === 0 ? 4 : fulfilStep === 1 ? -4 : fulfilStep <= 3 ? 6 : 0,
      type: 'box',
      color: '#059669',
      label: 'Order ORD-2040 (BX-4492)'
    },
    ...(fulfilStep === 5 ? [{ id: 'truck-out', x: 28, y: 0, z: 0, type: 'truck' as const, color: '#059669', label: 'OUT-01 (Departing)' }] : [])
  ];

  const routePath: [number, number, number][] | undefined = mode === 'cross-dock' ? (
    crossDockType === 'normal'
      ? [[-26, 0, 0], [4, 0, 4], [18, 0, -2], [28, 0, 0]]
      : [[-26, 0, 0], [0, 0, 0], [28, 0, 0]]
  ) : (
    [[4, 0, 4], [18, 0, -2], [18, 0, 6], [28, 0, 0]]
  );

  return (
    <section className="chapter ch4">
      <div className="ch4__header">
        <p className="chapter-eyebrow">Scene 4 · 3D Order Fulfilment &amp; Cross-Docking</p>
        <h1 className="chapter-title">Cross-Docking &amp; Order ORD-2040 Fulfilment</h1>
        <p className="chapter-subtitle">
          Compare standard storage flow against direct <strong>Cross-Docking</strong>, then watch <strong>Order ORD-2040</strong> move continuously from allocation to picking, conveyor transport, packing, and departure on Truck OUT-01.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
        <button className={`btn btn--sm ${mode === 'fulfilment' ? 'btn--primary' : ''}`} onClick={() => setMode('fulfilment')}>
          1 · Hero Order Fulfilment (ORD-2040)
        </button>
        <button className={`btn btn--sm ${mode === 'cross-dock' ? 'btn--primary' : ''}`} onClick={() => setMode('cross-dock')}>
          2 · Cross-Docking vs Storage Flow
        </button>
      </div>

      <div className="ch4__body">
        <div className="ch4__scene-wrap" style={{ flex: 1, minHeight: '400px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}>
          <Warehouse3DScene
            isActive={true}
            cameraPreset={mode === 'fulfilment' ? currentStage.preset : 'overview'}
            agents={agents}
            routePath={routePath}
            routeColor={mode === 'cross-dock' && crossDockType === 'cross-dock' ? '#0891b2' : '#059669'}
            storyTitle={mode === 'fulfilment' ? currentStage.label : (crossDockType === 'normal' ? 'Standard Storage Flow' : 'Direct Cross-Dock Flow')}
            storyDetail={mode === 'fulfilment' ? currentStage.detail : (crossDockType === 'normal' ? 'Pallets dwell in storage racks before picking.' : 'Transfers goods directly dock-to-dock with zero storage dwell time!')}
          />
        </div>

        <div className="ch4__right">
          {mode === 'fulfilment' ? (
            <div className="explain-box">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className="chip chip--green">ORDER #ORD-2040</span>
                <span className="chip chip--blue">STEP {fulfilStep + 1} OF {ORDER_STAGES.length}</span>
              </div>
              <h3 style={{ margin: '0 0 6px', color: 'var(--navy)' }}>{currentStage.label}</h3>
              <p style={{ fontSize: '13px', margin: '0 0 14px', color: 'var(--text-2)', lineHeight: 1.55 }}>{currentStage.detail}</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn--sm btn--blue" onClick={() => setIsPlaying(!isPlaying)}>
                  {isPlaying ? '⏸ Pause' : '▶ Play Fulfilment'}
                </button>
                <button className="btn btn--sm" onClick={() => setFulfilStep(s => Math.min(ORDER_STAGES.length - 1, s + 1))} disabled={fulfilStep >= ORDER_STAGES.length - 1}>
                  Next Step →
                </button>
                <button className="btn btn--sm btn--ghost" onClick={() => { setFulfilStep(0); setIsPlaying(true); }}>
                  ↺ Replay
                </button>
              </div>
            </div>
          ) : (
            <div className="explain-box">
              <h3 style={{ color: 'var(--navy)' }}>CROSS-DOCKING CONCEPT</h3>
              <p style={{ fontSize: '13px', marginBottom: '12px' }}>
                Cross-docking bypasses storage racks. Inbound shipments from Truck IN-07 transfer directly to Outbound Truck OUT-01.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button className={`btn btn--sm ${crossDockType === 'normal' ? 'btn--blue' : ''}`} onClick={() => setCrossDockType('normal')}>
                  Standard Flow: Receiving → Storage Racks → Picking → Dispatch
                </button>
                <button className={`btn btn--sm ${crossDockType === 'cross-dock' ? 'btn--primary' : ''}`} onClick={() => setCrossDockType('cross-dock')}>
                  ⚡ Cross-Dock Flow: Receiving Dock → Direct Outbound Dock
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}