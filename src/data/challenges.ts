export interface ChallengeOption {
  id: 'A' | 'B' | 'C';
  text: string;
}

export interface Challenge {
  id: string;
  round: number;
  title: string;
  scenario: string;
  question: string;
  options: ChallengeOption[];
  correct: 'A' | 'B' | 'C';
  explanation: string;
  concept: string;
  triggersDisruption?: boolean;
}

export const CHALLENGES: Challenge[] = [
  {
    id: 'slotting',
    round: 1,
    title: 'SLOTTING DECISION',
    scenario: 'SKU FX-200 receives 140 orders per day — it is your fastest-moving product. It is currently stored at the back of the warehouse, far from dispatch.',
    question: 'What should a warehouse manager do?',
    options: [
      { id: 'A', text: 'Leave it — any slot is fine' },
      { id: 'B', text: 'Move it near picking/dispatch (Slotting Optimisation)' },
      { id: 'C', text: 'Move it to the coldest zone for safety' },
    ],
    correct: 'B',
    concept: 'Slotting Optimisation',
    explanation: 'High-velocity SKUs (Class A) should be placed nearest to picking and dispatch. Every one of those 140 daily trips is shorter — reducing travel time, congestion and picking cost.',
  },
  {
    id: 'fifo-fefo',
    round: 2,
    title: 'INVENTORY POLICY',
    scenario: 'You have a batch of food products with varying expiry dates. An order comes in. Batch A expires in 10 days. Batch B expires in 90 days. You must ship one batch.',
    question: 'Which fulfilment policy should you apply?',
    options: [
      { id: 'A', text: 'FIFO — ship the batch received first' },
      { id: 'B', text: 'FEFO — FEFO — ship the batch with the earliest expiry date' },
      { id: 'C', text: 'LIFO — ship the most recently received' },
    ],
    correct: 'B',
    concept: 'FEFO (First Expiry, First Out)',
    explanation: 'FEFO is correct for perishables. Batch A expires in 10 days — if it is not shipped first it becomes waste. FIFO could be wrong if Batch B was received earlier. LIFO would leave oldest stock to expire.',
  },
  {
    id: 'disruption',
    round: 3,
    title: 'AISLE BLOCKAGE',
    scenario: 'Aisle C is blocked by a fallen pallet. AMR-07 has stopped. Orders are queuing. The Digital Twin flags the disruption immediately.',
    question: 'What should the warehouse do?',
    options: [
      { id: 'A', text: 'Stop the warehouse and wait' },
      { id: 'B', text: 'Keep sending AMRs down Aisle C' },
      { id: 'C', text: 'Use WMS/Digital Twin to reroute AMRs around the blockage' },
    ],
    correct: 'C',
    concept: 'WMS + Digital Twin Rerouting',
    explanation: 'The Digital Twin detects the disruption and the WMS recalculates an alternative route in real time. AMR-07 is rerouted, the queue clears and throughput is restored — without human intervention.',
    triggersDisruption: true,
  },
];
