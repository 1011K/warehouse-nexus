import { useState } from 'react';
import WarehouseScene from './WarehouseScene';
import type { ZoneHighlight, AgentPos } from './WarehouseScene';
import './Chapter3.css';

type Tab = 'identification' | 'fifo-fefo' | 'exception';

export default function Chapter3() {
  const [tab, setTab] = useState<Tab>('identification');
  const [scanType, setScanType] = useState<'barcode' | 'rfid'>('barcode');
  const [rotationPolicy, setRotationPolicy] = useState<'fifo' | 'fefo'>('fifo');
  const [exceptionStep, setExceptionStep] = useState(0);

  const EXCEPTION_STEPS = [
    { title: '1. Inbound Inspection Defect', detail: 'Pallet PLT-901 at Receiving fails quality inspection (damaged packaging).' },
    { title: '2. Quarantine Isolation',    detail: 'Forklift moves Pallet PLT-901 into the Quarantine Isolation Enclosure.' },
    { title: '3. WMS Quarantine Lock',      detail: 'WMS marks Pallet PLT-901 as BLOCKED/UNAVAILABLE. System stock frozen.' },
    { title: '4. Order Re-allocation',      detail: 'WMS re-routes active order allocation to verified Pallet PLT-204 in Rack S-04-B.' },
  ];

  const highlights: ZoneHighlight[] = tab === 'exception' ? [
    { zone: 'receiving', tone: 'red' },
    { zone: 'storage', tone: 'green' }
  ] : tab === 'fifo-fefo' ? [
    { zone: 'storage', tone: 'blue' },
    { zone: 'dispatch', tone: 'green' }
  ] : [
    { zone: 'receiving', tone: 'cyan' },
    { zone: 'storage', tone: 'blue' }
  ];

  const agents: AgentPos[] = tab === 'exception' ? (
    exceptionStep <= 1 ? [
      { x: 90, y: 410, label: 'Quarantine PLT-901', color: '#dc2626', icon: '☣️', pulsing: true }
    ] : [
      { x: 90, y: 410, label: 'PLT-901 LOCKED', color: '#dc2626', icon: '🔒' },
      { x: 350, y: 200, label: 'Allocated PLT-204 (S-04-B)', color: '#059669', icon: '📦', pulsing: true }
    ]
  ) : tab === 'identification' ? [
    { x: 100, y: 200, label: scanType === 'barcode' ? 'Single Scan' : 'RFID Portal', color: scanType === 'barcode' ? '#1d6ff0' : '#0891b2', icon: scanType === 'barcode' ? '▦' : '📡', pulsing: true }
  ] : [
    { x: 350, y: 200, label: rotationPolicy === 'fifo' ? 'Oldest Arrival (JAN)' : 'Earliest Expiry (FEB)', color: '#059669', icon: '📅', pulsing: true }
  ];

  return (
    <section className="chapter ch3">
      <div className="ch3__header">
        <p className="chapter-eyebrow">Scene 3 · Inventory Control &amp; Exceptions</p>
        <h1 className="chapter-title">Inventory Visibility &amp; Exception Handling</h1>
        <p className="chapter-subtitle">
          Compare optical Barcode vs. wireless RFID multi-tag scanning, stock rotation policies (FIFO vs. FEFO), and see how the WMS locks defective Pallet PLT-901 in Quarantine while re-allocating Order ORD-2040 to verified Pallet PLT-204.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
        <button className={`btn btn--sm ${tab === 'identification' ? 'btn--primary' : ''}`} onClick={() => setTab('identification')}>
          1 · Barcode vs RFID Identification
        </button>
        <button className={`btn btn--sm ${tab === 'fifo-fefo' ? 'btn--primary' : ''}`} onClick={() => setTab('fifo-fefo')}>
          2 · FIFO vs FEFO Rotation
        </button>
        <button className={`btn btn--sm ${tab === 'exception' ? 'btn--primary' : ''}`} onClick={() => setTab('exception')}>
          3 · Quality Defect &amp; Quarantine
        </button>
      </div>

      <div className="ch3__body">
        <div className="ch3__scene-wrap" style={{ flex: 1, minHeight: '380px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)', background: '#f9f8f5' }}>
          <WarehouseScene
            highlights={highlights}
            showQuarantine={true}
            agents={agents}
            focusedZone={tab === 'exception' ? 'receiving' : 'storage'}
          />
        </div>

        <div className="ch3__panel">
          {tab === 'identification' && (
            <div className="explain-box">
              <h3 style={{ color: 'var(--navy)' }}>BARCODE vs. RFID IDENTIFICATION</h3>
              <p style={{ fontSize: '13px', marginBottom: '12px' }}>
                Optical barcodes require individual line-of-sight laser scans. RFID portals detect all tagged items on Pallet PLT-204 wirelessly in a single pass.
              </p>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <button className={`btn btn--sm ${scanType === 'barcode' ? 'btn--blue' : ''}`} onClick={() => setScanType('barcode')}>
                  ▦ Barcode (Single Optical)
                </button>
                <button className={`btn btn--sm ${scanType === 'rfid' ? 'btn--blue' : ''}`} onClick={() => setScanType('rfid')}>
                  📡 RFID (Multi-Tag Portal)
                </button>
              </div>
            </div>
          )}

          {tab === 'fifo-fefo' && (
            <div className="explain-box">
              <h3 style={{ color: 'var(--navy)' }}>INVENTORY ROTATION POLICIES</h3>
              <p style={{ fontSize: '13px', marginBottom: '12px' }}>
                Stock rotation policy determines which inventory batch is dispatched first to minimize obsolescence and waste.
              </p>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <button className={`btn btn--sm ${rotationPolicy === 'fifo' ? 'btn--blue' : ''}`} onClick={() => setRotationPolicy('fifo')}>
                  📅 FIFO (First In, First Out)
                </button>
                <button className={`btn btn--sm ${rotationPolicy === 'fefo' ? 'btn--blue' : ''}`} onClick={() => setRotationPolicy('fefo')}>
                  ⏱ FEFO (First Expiry, First Out)
                </button>
              </div>
            </div>
          )}

          {tab === 'exception' && (
            <div className="explain-box">
              <h3 style={{ color: 'var(--navy)' }}>QUALITY EXCEPTION &amp; QUARANTINE</h3>
              <p style={{ fontSize: '13px', marginBottom: '12px' }}>
                Physical defects immediately freeze digital availability in WMS. Defective Pallet PLT-901 moves to Quarantine while Order ORD-2040 re-allocates to verified Pallet PLT-204.
              </p>
              <div style={{ padding: '10px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', marginBottom: '12px' }}>
                <strong style={{ fontSize: '12px', color: 'var(--navy)' }}>{EXCEPTION_STEPS[exceptionStep].title}</strong>
                <p style={{ fontSize: '12px', margin: '4px 0 0', color: 'var(--text-2)' }}>{EXCEPTION_STEPS[exceptionStep].detail}</p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn--sm btn--blue" onClick={() => setExceptionStep(s => Math.min(EXCEPTION_STEPS.length - 1, s + 1))} disabled={exceptionStep >= EXCEPTION_STEPS.length - 1}>
                  Next Step →
                </button>
                <button className="btn btn--sm btn--ghost" onClick={() => setExceptionStep(0)}>
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