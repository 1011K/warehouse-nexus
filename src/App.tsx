import { useState, useEffect, useCallback } from 'react';
import ChapterNav from './components/ChapterNav';
import Chapter1 from './components/Chapter1';
import Chapter2 from './components/Chapter2';
import Chapter3 from './components/Chapter3';
import Chapter4 from './components/Chapter4';
import Chapter5 from './components/Chapter5';
import Chapter6 from './components/Chapter6';
import Chapter7 from './components/Chapter7';
import Chapter8 from './components/Chapter8';
import AIControlCentre from './components/AIControlCentre';
import { CHAPTERS, type ChapterId } from './data/sections';
import './styles/app.css';

const chapterIdx = (id: ChapterId) => CHAPTERS.findIndex(c => c.id === id);

type AppMode = 'box-journey' | 'ai-control';

export default function App() {
  const [appMode, setAppMode] = useState<AppMode>('box-journey');
  const [chapter, setChapter] = useState<ChapterId>('lifecycle');
  const [furthest, setFurthest] = useState(CHAPTERS.length - 1);

  const goTo = useCallback((id: ChapterId) => {
    setChapter(id);
    setFurthest(f => Math.max(f, chapterIdx(id)));
  }, []);

  const currentIdx = chapterIdx(chapter);

  const goNext = useCallback(() => {
    const next = CHAPTERS[currentIdx + 1];
    if (next) goTo(next.id);
  }, [currentIdx, goTo]);

  const goPrev = useCallback(() => {
    const prev = CHAPTERS[currentIdx - 1];
    if (prev) goTo(prev.id);
  }, [currentIdx, goTo]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (appMode === 'box-journey') {
        if (e.key === 'ArrowRight' || e.key === 'PageDown') goNext();
        if (e.key === 'ArrowLeft' || e.key === 'PageUp')   goPrev();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [appMode, goNext, goPrev]);

  return (
    <div className="app-shell">
      {/* Top Mode Switcher Bar */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '42px',
        background: '#1a1f2e',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        zIndex: 1000,
        boxShadow: 'var(--shadow-md)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="mono" style={{ fontWeight: 800, fontSize: '13px', color: '#7dd3fc', letterSpacing: '0.08em' }}>WAREHOUSE NEXUS</span>
          <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-mono)' }}>LIVE WAREHOUSE SIMULATOR</span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setAppMode('box-journey')}
            style={{
              padding: '5px 14px',
              borderRadius: '20px',
              border: '1.5px solid ' + (appMode === 'box-journey' ? '#38bdf8' : 'rgba(255,255,255,0.2)'),
              background: appMode === 'box-journey' ? 'rgba(56,189,248,0.2)' : 'transparent',
              color: appMode === 'box-journey' ? '#ffffff' : 'rgba(255,255,255,0.7)',
              fontSize: '11px',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            📦 1 · JOURNEY OF A BOX (EDUCATIONAL)
          </button>

          <button
            onClick={() => setAppMode('ai-control')}
            style={{
              padding: '5px 14px',
              borderRadius: '20px',
              border: '1.5px solid ' + (appMode === 'ai-control' ? '#4ade80' : 'rgba(255,255,255,0.2)'),
              background: appMode === 'ai-control' ? 'rgba(74,222,128,0.2)' : 'transparent',
              color: appMode === 'ai-control' ? '#ffffff' : 'rgba(255,255,255,0.7)',
              fontSize: '11px',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            ⚡ 2 · AI WAREHOUSE CONTROL CENTRE (DIGITAL TWIN)
          </button>
        </div>
      </div>

      {/* Mode 1 Sub-Navigation */}
      {appMode === 'box-journey' && (
        <div style={{ marginTop: '42px' }}>
          <ChapterNav
            current={chapter}
            furthest={furthest}
            onNavigate={id => goTo(id)}
            onPrev={goPrev}
            onNext={goNext}
            canPrev={currentIdx > 0}
            canNext={currentIdx < CHAPTERS.length - 1}
          />
        </div>
      )}

      {/* Main View Area */}
      <main className="view-frame" style={{ marginTop: appMode === 'box-journey' ? 'calc(42px + var(--nav-h))' : '42px' }}>
        {appMode === 'ai-control' ? (
          <AIControlCentre />
        ) : (
          <>
            {chapter === 'lifecycle'    && <Chapter1 />}
            {chapter === 'slotting'      && <Chapter2 />}
            {chapter === 'inventory'     && <Chapter3 />}
            {chapter === 'fulfilment'    && <Chapter4 />}
            {chapter === 'picking'       && <Chapter5 />}
            {chapter === 'automation'    && <Chapter6 />}
            {chapter === 'digital-twin'  && <Chapter7 />}
            {chapter === 'full-system'   && <Chapter8 />}
          </>
        )}
      </main>
    </div>
  );
}
