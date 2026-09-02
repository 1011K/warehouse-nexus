# Warehouse Nexus

Interactive warehouse management system built for a college symposium. A
single-page control-room simulation — not a slide deck — covering the
overview, order process, technology stack, a live digital twin disruption
demo, an audience quiz, and a results screen.

All operational figures (orders/hour, pick accuracy, route distances, etc.)
are **illustrative simulation data** written for this demo. They are not
measurements from a real facility.

## Requirements

- Node.js **>=20.19.0** or **>=22.12.0** (Vite 8 requires it; Node 24.x works fine)
- npm

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Starts the Vite dev server (default: http://localhost:5173). The app runs
entirely client-side — no backend, database, or external API calls at
runtime. All fonts are bundled locally via `@fontsource`, so once
dependencies are installed the app works fully offline.

## Production build

```bash
npm run build
```

Type-checks with `tsc -b` and bundles with Vite into `dist/`. Preview the
production build with:

```bash
npm run preview
```

## Linting

```bash
npm run lint
```

## Architecture

The app is a single React tree with no routing library — one `App.tsx`
holds the current section id (`overview | process | technology | twin |
challenge | results`) and a "furthest reached" index used to gate the top
navigation bar so a section can't be jumped to before it's been reached.
All state lives in React `useState`; nothing touches `localStorage` or
`sessionStorage`.

```
src/
  components/
    Navigation.tsx        Persistent top progress/nav bar (6 steps)
    WarehouseMap.tsx       Shared SVG warehouse schematic (zones, routes,
                            AMR position, Aisle C block indicator) reused
                            by Overview, Process, Technology, and the twin
    KPICard.tsx             Small stat card used on Overview + Digital Twin
    Panel.tsx               Bordered panel shell with a label/tag header
    Overview.tsx            Section 01 — landing + KPI summary + schematic
    OrderJourney.tsx        Section 02 — Order #2040 stage-by-stage flow
    TechnologyView.tsx      Section 03 — clickable technology overlays
    DigitalTwin.tsx         Section 04 — block/optimise disruption demo
    WarehouseChallenge.tsx  Section 05 — 4-round scored quiz
    Results.tsx             Section 06 — final score + classification
  data/
    simulation.ts          Zones, KPI sets, routes, order stages, event log
    technologies.ts         Technology overlay content (what/why per system)
    challenges.ts            Quiz rounds, options, correct answers, copy
    sections.ts              Nav step metadata + SectionId type
  styles/
    tokens.css               Color/type/spacing CSS variables, base resets
    global.css                Layout shell, buttons, shared section chrome
  App.tsx                   Section switch + shared state (score, answers,
                              digital twin state, nav position)
  main.tsx                  Entry point, font imports, global CSS imports
```

### Shared state across sections

- **Digital twin state** (`normal | blocked | optimised`) is lifted to
  `App.tsx` and passed to both the Digital Twin section and Round 3 of the
  Warehouse Challenge, so answering Round 3 correctly visibly reroutes the
  same map shown in Section 04.
- **Score and answers** are tracked in `App.tsx`. Each challenge round can
  only be scored once — the option buttons lock after a selection is made,
  so repeated clicking cannot inflate the score.
- **Restart Simulation** (on the Results screen) resets score, answers,
  digital twin state, and navigation progress back to Overview in one call.

## Known limitations

- Digital twin numbers, technology descriptions, and quiz explanations are
  written for a plausible, illustrative warehouse — they're a teaching aid,
  not a case study of a specific real facility.
- All operational figures (orders/hour, pick accuracy, route distances) are
  **illustrative simulation data** and not empirical measurements.
