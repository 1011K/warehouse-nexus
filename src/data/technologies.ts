import type { ZoneId } from './simulation';

export interface Technology {
  id: string;
  name: string;
  abbr: string;
  zones: ZoneId[];
  what: string;
  where: string;
  why: string;
  isSmartOnly?: boolean;
}

export const TECHNOLOGIES: Technology[] = [
  {
    id: 'wms',
    name: 'Warehouse Management System',
    abbr: 'WMS',
    zones: ['receiving', 'storage', 'asrs', 'picking', 'packing', 'dispatch'],
    what: 'Software that tracks every SKU, slot, worker task and equipment movement across the warehouse.',
    where: 'Operates warehouse-wide as the central intelligence layer.',
    why: 'Single source of truth — every other system reads from and writes to it.',
  },
  {
    id: 'barcode',
    name: 'Barcode Scanning',
    abbr: 'Barcode',
    zones: ['receiving', 'picking', 'dispatch'],
    what: 'Optical scan of a printed 1D or 2D code to identify a single item at close range.',
    where: 'Receiving docks, pick faces, packing stations, dispatch gates.',
    why: 'Cheap and reliable; confirms identity at every handoff to prevent errors.',
  },
  {
    id: 'rfid',
    name: 'Radio-Frequency Identification (RFID)',
    abbr: 'RFID',
    zones: ['receiving', 'dispatch'],
    what: 'Tags and readers that identify multiple tagged items wirelessly without line-of-sight.',
    where: 'Dock doors, conveyor gates, high-throughput zones.',
    why: 'Reads tens of items simultaneously — far faster than one-by-one barcode scans.',
    isSmartOnly: true,
  },
  {
    id: 'iot',
    name: 'Internet of Things (IoT) Sensors',
    abbr: 'IoT',
    zones: ['storage', 'asrs'],
    what: 'Sensors on racks, doors and equipment reporting temperature, occupancy and position in real time.',
    where: 'Throughout storage, cold chain and heavy equipment.',
    why: 'Turns the physical warehouse into live data; problems surface before they escalate.',
    isSmartOnly: true,
  },
  {
    id: 'agv',
    name: 'Automated Guided Vehicle',
    abbr: 'AGV',
    zones: ['storage', 'picking'],
    what: 'Robot that follows a fixed, pre-programmed route using floor tape or magnetic strips.',
    where: 'High-volume, predictable paths between fixed stations.',
    why: 'Removes repetitive transport tasks on well-defined routes at consistent speed.',
    isSmartOnly: true,
  },
  {
    id: 'amr',
    name: 'Autonomous Mobile Robot',
    abbr: 'AMR',
    zones: ['storage', 'picking', 'packing'],
    what: 'Robot that navigates dynamically using on-board sensors, cameras and maps — rerouting around obstacles.',
    where: 'Dynamic environments, shared human-robot aisles.',
    why: 'Adapts to changing conditions without physical infrastructure changes.',
    isSmartOnly: true,
  },
  {
    id: 'asrs-tech',
    name: 'Automated Storage & Retrieval System',
    abbr: 'AS/RS',
    zones: ['asrs'],
    what: 'Automated cranes or shuttles that store and retrieve unit loads from high-density racking on command.',
    where: 'Dedicated AS/RS zone with fixed racking infrastructure.',
    why: 'Maximises vertical space utilisation and delivers consistent, sub-minute retrieval times.',
    isSmartOnly: true,
  },
  {
    id: 'ptl',
    name: 'Pick-to-Light',
    abbr: 'Pick-to-Light',
    zones: ['picking'],
    what: 'Light indicators on rack slots that direct pickers to the exact bin without a paper list.',
    where: 'High-velocity pick faces and batch pick stations.',
    why: 'Reduces pick errors and training time; pickers follow lights, not lists.',
    isSmartOnly: true,
  },
  {
    id: 'conveyors',
    name: 'Conveyor Systems',
    abbr: 'Conveyors',
    zones: ['picking', 'packing', 'dispatch'],
    what: 'Fixed belts, rollers and sorters that move goods between stations automatically.',
    where: 'Between picking, packing and dispatch in high-volume facilities.',
    why: 'Handles high steady-state volume between fixed stations more cheaply than manual carry.',
    isSmartOnly: true,
  },
  {
    id: 'digital-twin',
    name: 'Digital Twin',
    abbr: 'Digital Twin',
    zones: ['receiving', 'storage', 'asrs', 'picking', 'packing', 'dispatch'],
    what: 'A live virtual model of the physical warehouse, continuously fed by real operational data.',
    where: 'Management and operations layer — visualised on dashboards or simulation tools.',
    why: 'Lets managers test disruptions and reroutes safely in simulation before applying them live.',
    isSmartOnly: true,
  },
];
