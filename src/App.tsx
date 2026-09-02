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
import { CHAPTERS, type ChapterId } from './data/sections';
import './styles/app.css';

const chapterIdx = (id: ChapterId) => CHAPTERS.findIndex(c => c.id === id);

export default function App() {
  const [chapter, setChapter] = useState<ChapterId>('lifecycle');
  const [furthest, setFurthest] = useState(CHAPTERS.length - 1); // Allow free presenter jump navigation

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

  // Keyboard navigation for presenter
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') goNext();
      if (e.key === 'ArrowLeft' || e.key === 'PageUp')   goPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goNext, goPrev]);

  return (
    <div className="app-shell">
      <ChapterNav
        current={chapter}
        furthest={furthest}
        onNavigate={id => goTo(id)}
        onPrev={goPrev}
        onNext={goNext}
        canPrev={currentIdx > 0}
        canNext={currentIdx < CHAPTERS.length - 1}
      />

      <main className="view-frame" style={{ marginTop: 'var(--nav-h)' }}>
        {chapter === 'lifecycle'    && <Chapter1 />}
        {chapter === 'slotting'      && <Chapter2 />}
        {chapter === 'inventory'     && <Chapter3 />}
        {chapter === 'fulfilment'    && <Chapter4 />}
        {chapter === 'picking'       && <Chapter5 />}
        {chapter === 'automation'    && <Chapter6 />}
        {chapter === 'digital-twin'  && <Chapter7 />}
        {chapter === 'full-system'   && <Chapter8 />}
      </main>
    </div>
  );
}
