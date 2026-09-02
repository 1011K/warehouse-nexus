// All figures are illustrative simulation data for a student symposium demo.

export type ZoneId =
  | 'receiving'
  | 'storage'
  | 'asrs'
  | 'picking'
  | 'packing'
  | 'dispatch'
  | 'quarantine';

export interface Zone {
  id: ZoneId;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  fill: string;
  stroke: string;
}

// Layout for a flat 2.5D warehouse schematic, 1000×500 viewBox.
export const ZONES: Zone[] = [
  { id: 'receiving',  label: 'RECEIVING',   x: 30,  y: 40,  w: 145, h: 420, fill: '#dbeafe', stroke: '#93c5fd' },
  { id: 'storage',    label: 'STORAGE',     x: 200, y: 40,  w: 290, h: 420, fill: '#e0f2fe', stroke: '#7dd3fc' },
  { id: 'asrs',       label: 'AS/RS',       x: 515, y: 40,  w: 130, h: 420, fill: '#f0fdf4', stroke: '#86efac' },
  { id: 'picking',    label: 'PICKING',     x: 670, y: 40,  w: 130, h: 195, fill: '#fef9c3', stroke: '#fde047' },
  { id: 'packing',    label: 'PACKING',     x: 670, y: 265, w: 130, h: 195, fill: '#fef3c7', stroke: '#fcd34d' },
  { id: 'dispatch',   label: 'DISPATCH',    x: 825, y: 40,  w: 145, h: 420, fill: '#d1fae5', stroke: '#6ee7b7' },
];

export type TwinState = 'normal' | 'blocked' | 'optimised';

export interface LiveKpiData {
  travelDistance: number;   // meters
  pickTime: number;         // seconds/order
  queueLength: number;      // items
  cycleTime: string;        // mm:ss
  inventoryAccuracy: number;// %
  throughput: number;       // orders/hr
}

export const BASE_KPIS: LiveKpiData = {
  travelDistance: 184,
  pickTime: 42,
  queueLength: 3,
  cycleTime: '18m 20s',
  inventoryAccuracy: 99.4,
  throughput: 146,
};

export const AISLE_C = { x: 330, y: 160, w: 40, h: 300 };
export const QUARANTINE_ZONE = { x: 45, y: 380, w: 115, h: 65 };

export const ROUTE_NORMAL: [number, number][] = [
  [350, 450], [350, 300], [350, 130], [580, 130], [735, 130],
];

export const ROUTE_BLOCKED: [number, number][] = [
  [350, 450], [350, 300], [350, 280],
];

export const ROUTE_OPTIMISED: [number, number][] = [
  [350, 450], [210, 450], [210, 130], [580, 130], [735, 130],
];

export interface ScenarioDefinition {
  id: string;
  name: string;
  icon: string;
  description: string;
  impact: string;
  resolution: string;
  kpis: Partial<LiveKpiData>;
  highlightZone: ZoneId;
  routeTone: 'red' | 'amber' | 'green' | 'blue';
}

export const SCENARIOS: ScenarioDefinition[] = [
  {
    id: 'aisle-blocked',
    name: 'Aisle C Obstruction',
    icon: '⚠️',
    description: 'Fallen pallet blocking main through-aisle C in Storage.',
    impact: 'AMR fleet halted, picking queue building up.',
    resolution: 'Digital Twin detects blockage; WMS recalculates perimeter route via West corridor.',
    kpis: { travelDistance: 248, queueLength: 18, throughput: 109 },
    highlightZone: 'storage',
    routeTone: 'red',
  },
  {
    id: 'congestion',
    name: 'Picking Bottleneck',
    icon: '🚦',
    description: 'High volume order batch concentrating in Pick Zone B.',
    impact: 'Picker travel collision & delayed order packing.',
    resolution: 'WMS dynamically splits batch and re-balances wave pickers across Zone A & C.',
    kpis: { pickTime: 78, queueLength: 24, throughput: 112 },
    highlightZone: 'picking',
    routeTone: 'amber',
  },
  {
    id: 'shortage',
    name: 'Pick-Face Stockout',
    icon: '📦',
    description: 'SKU BX-4492 pick bin drops below minimum safety threshold (5 units).',
    impact: 'Active picks stalled waiting for inventory.',
    resolution: 'WMS auto-issues high-priority replenishment task from AS/RS reserve rack.',
    kpis: { pickTime: 64, queueLength: 12, inventoryAccuracy: 98.2 },
    highlightZone: 'asrs',
    routeTone: 'amber',
  },
  {
    id: 'equipment-fault',
    name: 'AS/RS Crane Fault',
    icon: '⚙️',
    description: 'High-bay Retrieval Crane Crane-02 motor overheats.',
    impact: 'Automated retrieval suspended on Racks 12-16.',
    resolution: 'System redirects task to secondary autonomous shuttle system.',
    kpis: { throughput: 94, cycleTime: '26m 45s' },
    highlightZone: 'asrs',
    routeTone: 'red',
  },
  {
    id: 'receiving-surge',
    name: 'Inbound Dock Surge',
    icon: '🚛',
    description: '4 heavy freight trailers arrive simultaneously at Receiving.',
    impact: 'Dock staging area 95% saturated; risk of demurrage.',
    resolution: 'WMS opens temporary overflow staging and dispatches extra AMRs for rapid put-away.',
    kpis: { queueLength: 32, travelDistance: 210 },
    highlightZone: 'receiving',
    routeTone: 'amber',
  },
  {
    id: 'priority-order',
    name: 'VIP Priority Order',
    icon: '⚡',
    description: 'Emergency order ORD-9999 received with 15-minute SLA.',
    impact: 'Standard pick queues suspended.',
    resolution: 'WMS preempts wave schedule and dispatches AMR-01 for immediate direct pick.',
    kpis: { cycleTime: '06m 10s', pickTime: 18 },
    highlightZone: 'dispatch',
    routeTone: 'green',
  },
  {
    id: 'capacity-limit',
    name: 'Storage Capacity Limit',
    icon: '🏬',
    description: 'Storage zone reaches 94% volumetric capacity.',
    impact: 'Standard put-away slots unavailable.',
    resolution: 'WMS activates dynamic slotting algorithms to consolidate partial pallets.',
    kpis: { travelDistance: 195, inventoryAccuracy: 99.8 },
    highlightZone: 'storage',
    routeTone: 'blue',
  },
];

export const ORDER_SKU = { sku: 'BX-4492', batch: 'B-26', expiry: '2027-03-15', status: 'VERIFIED' };