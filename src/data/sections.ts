export type ChapterId =
  | 'lifecycle'
  | 'slotting'
  | 'inventory'
  | 'fulfilment'
  | 'picking'
  | 'automation'
  | 'digital-twin'
  | 'full-system';

export interface ChapterMeta {
  id: ChapterId;
  num: number;
  title: string;
  short: string;
  description: string;
}

export const CHAPTERS: ChapterMeta[] = [
  { id: 'lifecycle',    num: 1, title: 'Inbound Lifecycle & Put-away',       short: 'Lifecycle',    description: 'Truck Arrival → Dock → Inspection → GRN/WMS → Put-away → Storage' },
  { id: 'slotting',     num: 2, title: 'Slotting Optimisation & Replenishment', short: 'Slotting',   description: 'ABC Velocity Slotting & Automatic Pick-Face Replenishment' },
  { id: 'inventory',    num: 3, title: 'Inventory Control & Exceptions',     short: 'Inventory',   description: 'Barcode vs RFID, Cycle Count, FIFO/FEFO & Quarantine Exception' },
  { id: 'fulfilment',   num: 4, title: 'Cross-Docking & Order Fulfilment',  short: 'Fulfilment',  description: 'Cross-Docking Flow & Order ORD-2040 End-to-End Movement' },
  { id: 'picking',      num: 5, title: 'Picking Strategies (Zone/Batch/Wave)', short: 'Picking',    description: 'Visual Movement Differentiating Zone, Batch and Wave Picking' },
  { id: 'automation',   num: 6, title: 'Automation, AGV/AMR & AS/RS',       short: 'Automation',  description: 'Traditional vs Smart, AGV Obstacle Stop vs AMR Reroute, AS/RS Crane' },
  { id: 'digital-twin', num: 7, title: 'Digital Twin & Scenario Engine',     short: 'Digital Twin',description: '7 Interactive Operational Scenarios & Real-Time Rerouting' },
  { id: 'full-system',  num: 8, title: 'Full Autonomous Warehouse',          short: 'Full System', description: 'Simultaneous Operations & Live KPI Causality' },
];