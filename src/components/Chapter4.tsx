import { useState, useEffect } from 'react';
import WarehouseScene from './WarehouseScene';
import type { ZoneHighlight, AgentPos } from './WarehouseScene';
import type { ZoneId } from '../data/simulation';
import './Chapter4.css';

type Mode = 'cross-dock' | 'fulfilment';

const ORDER_STAGES = [
  { id: 'alloc',  zone: 'storage' as ZoneId,  label: '1. Order ORD-2040 Allocated',  detail: 'Customer Order ORD-2040 received in WMS. 3 units of SKU BX-4492 allocated from Pallet PLT-204 in Rack S-04-B.' },
  { id: 'pick',   zone: 'picking' as ZoneId,  label: '2. Pick-to-Light Retrieval',  detail: 'Picker retrieves SKU BX-4492 from Pick Face B and confirms scan.' },
  { id: 'convey', zone: 'packing' as ZoneId,  label: '3. Conveyor Roller Transport', detail: 'Tote containing Order ORD-2040 travels down roller conveyor to Packing Bench.' },
  { id: 'pack',   zone: 'packing' as ZoneId,  label: '4. Packing & Weight Verification', detail: 'Order ORD-2040 packed in carton, shipping label applied, weight verified.' },
  { id: 'stage',  zone: 'dispatch' as ZoneId, label: '5. Dispatch Staging',           detail: 'Carton staged at Outbound Dock Bay 4 for FedEx freight route pickup.' },
  { id: 'depart', zone: 'dispatch' as ZoneId, label: '6. Truck OUT-01 Departure',    detail: 'Carton loaded onto Truck OUT-01, manifest closed in WMS, truck departs.' },
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

  const highlights: ZoneHighlight[] = mode === 'cross-dock' ? (
    crossDockType === 'normal' ? [
      { zone: 'receiving', tone: 'blue' },
      { zone: 'storage', tone: 'amber' },
      { zone: 'picking', tone: 'amber' },
      { zone: 'dispatch', tone: 'green' }
    ] : [
      { zone: 'receiving', tone: 'cyan' },
      { zone: 'dispatch', tone: 'green' }
    ]
  ) : [
    { zone: currentStage.zone, tone: 'green' }
  ];

  const route: [number, number][] | undefined = mode === 'cross-dock' ? (
    crossDockType === 'normal'
      ? [[100, 200], [350, 200], [735, 130], [895, 200]]
      : [[100, 250], [500, 250], [895, 250]]
  ) : (
    fulfilStep === 0 ? [[350, 200], [735, 130]] :
    fulfilStep === 1 ? [[735, 130], [735, 300]] :
    fulfilStep === 2 ? [[735, 300], [735, 360]] :
    fulfilStep === 3 ? [[735, 360], [895, 200]] :
    [[895, 200], [950, 200]]
  );

  const agents: AgentPos[] = mode === 'cross-dock' ? [
    { x: crossDockType === 'normal' ? 350 : 500, y: 250, label: crossDockType === 'normal' ? 'Storage Flow' : 'Direct Cross-Dock', color: crossDockType === 'normal' ? '#1d6ff0' : '#0891b2', icon: '📦', pulsing: true }
  ] : [
    {
      x: fulfilStep === 0 ? 350 : fulfilStep === 1 ? 735 : fulfilStep <= 3 ? 735 : 895,
      y: fulfilStep === 0 ? 200 : fulfilStep === 1 ? 130 : fulfilStep <= 3 ? 330 : 200,
      label: 'ORD-2040 (BX-4492)',
      color: '#059669',
      icon: '📦',
      pulsing: true,
    }
  ];

  return (
    <section className="chapter ch4">
      <div className="ch4__header">
        <p className="chapter-eyebrow">Scene 4 · Order Fulfilment &amp; Cross-Docking</p>
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
        <div className="ch4__scene-wrap" style={{ flex: 1, minHeight: '380px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)', background: '#f9f8f5' }}>
          <WarehouseScene
            highlights={highlights}
            route={route}
            routeTone={mode === 'cross-dock' && crossDockType === 'cross-dock' ? 'cyan' : 'green'}
            agents={agents}
            focusedZone={mode === 'fulfilment' ? currentStage.zone : null}
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