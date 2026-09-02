import Warehouse3DScene from './Warehouse3DScene';
import type { Agent3D } from './Warehouse3DScene';
import './Chapter8.css';

export default function Chapter8() {
  const activeAgents: Agent3D[] = [
    { id: 'trk-in', x: -26, y: 0, z: -8, type: 'truck', color: '#1d6ff0', label: 'IN-07 Docked' },
    { id: 'amr-fleet', x: -5, y: 0, z: 0, type: 'amr', color: '#059669', label: 'AMR Fleet' },
    { id: 'asrs-crane', x: 12, y: 4, z: 0, type: 'crane', color: '#0891b2', label: 'AS/RS Crane' },
    { id: 'pick-box', x: 18, y: 0, z: -2, type: 'box', color: '#d97706', label: 'ORD-2040 (BX-4492)' },
    { id: 'trk-out', x: 28, y: 0, z: 8, type: 'truck', color: '#059669', label: 'OUT-01 Express' },
  ];

  const routePath: [number, number, number][] = [
    [-26, 0, -8], [-5, 0, 0], [12, 0, 0], [18, 0, -2], [18, 0, 6], [28, 0, 8]
  ];

  return (
    <section className="chapter ch8">
      <div className="ch8__header" style={{ textAlign: 'center', marginBottom: '16px' }}>
        <p className="chapter-eyebrow">Scene 8 · Full Autonomous Warehouse</p>
        <h1 className="chapter-title" style={{ fontSize: '28px' }}>Integrated Warehouse Management System</h1>
        <p className="chapter-subtitle" style={{ margin: '0 auto', maxWidth: '700px' }}>
          Every 3D zone operating simultaneously under WMS real-time coordination — synchronizing inventory, space, people, equipment, and information.
        </p>
      </div>

      <div className="ch8__body" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', minHeight: 0 }}>
        <div style={{ flex: 1, borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border)', background: '#f9f8f5', boxShadow: 'var(--shadow-md)', minHeight: '380px' }}>
          <Warehouse3DScene
            cameraPreset="overview"
            agents={activeAgents}
            routePath={routePath}
            routeColor="#059669"
            kpiOverlay={{
              travelDistance: 139,
              pickTime: 32,
              queueLength: 2,
              cycleTime: '14m 10s',
              inventoryAccuracy: 99.8,
              throughput: 185,
            }}
            storyTitle="Full Autonomous Operations"
            storyDetail="Inbound receiving, AS/RS storage, pick-face replenishment, order picking, conveyor packing, and outbound dispatch operating concurrently."
          />
        </div>

        <div className="ch8__summary-hero" style={{ background: 'var(--navy)', color: '#ffffff', padding: '16px 24px', borderRadius: 'var(--radius-lg)', textAlign: 'center', boxShadow: 'var(--shadow-md)' }}>
          <h2 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 800 }}>Receive → Store → Control → Replenish → Pick → Pack → Dispatch</h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', fontSize: '12px', color: 'rgba(255,255,255,0.75)', fontFamily: 'var(--font-mono)' }}>
            <span>📦 Inventory</span>
            <span>•</span>
            <span>🏢 Space</span>
            <span>•</span>
            <span>👷 People</span>
            <span>•</span>
            <span>🤖 Equipment</span>
            <span>•</span>
            <span>📡 Information</span>
          </div>
        </div>
      </div>
    </section>
  );
}