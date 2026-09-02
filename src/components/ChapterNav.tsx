import { CHAPTERS, type ChapterId } from '../data/sections';
import './ChapterNav.css';

interface ChapterNavProps {
  current: ChapterId;
  furthest: number;
  onNavigate: (id: ChapterId) => void;
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
}

export default function ChapterNav({
  current, furthest, onNavigate, onPrev, onNext, canPrev, canNext,
}: ChapterNavProps) {
  const currentIdx = CHAPTERS.findIndex(c => c.id === current);

  return (
    <nav className="chap-nav" aria-label="Chapter navigation">
      <div className="chap-nav__left">
        <span className="chap-nav__logo">WAREHOUSE NEXUS</span>
      </div>

      <div className="chap-nav__dots">
        {CHAPTERS.map((c, i) => (
          <button
            key={c.id}
            className={[
              'chap-dot',
              i === currentIdx ? 'chap-dot--active' : '',
              i <= furthest ? 'chap-dot--visited' : '',
            ].join(' ')}
            onClick={() => i <= furthest && onNavigate(c.id)}
            disabled={i > furthest}
            aria-label={`Chapter ${c.num}: ${c.short}`}
            title={`${c.num}. ${c.short}`}
          >
            <span className="chap-dot__num">{c.num}</span>
            <span className="chap-dot__label">{c.short}</span>
          </button>
        ))}
      </div>

      <div className="chap-nav__arrows">
        <button
          className="chap-arrow"
          onClick={onPrev}
          disabled={!canPrev}
          aria-label="Previous chapter"
        >
          ←
        </button>
        <span className="chap-nav__count">{currentIdx + 1} / {CHAPTERS.length}</span>
        <button
          className="chap-arrow"
          onClick={onNext}
          disabled={!canNext}
          aria-label="Next chapter"
        >
          →
        </button>
      </div>
    </nav>
  );
}
