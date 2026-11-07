import { useEffect, useRef } from 'react';

const CONFETTI_COUNT = 45;

const KEYFRAME_CSS = `
@keyframes batFallAnim {
  0%   { transform: translateY(-30px) rotate(0deg); opacity: 1; }
  85%  { opacity: 0.8; }
  100% { transform: translateY(115vh) rotate(600deg); opacity: 0; }
}
@keyframes batDrift {
  0%   { margin-left: 0px; }
  25%  { margin-left: 20px; }
  50%  { margin-left: -15px; }
  75%  { margin-left: 25px; }
  100% { margin-left: -10px; }
}
`;

function createPiece(i) {
  const isBlue = i % 2 === 0;
  const isHeart = i % 3 === 0;
  return {
    id: i,
    left: Math.random() * 100,
    duration: 3 + Math.random() * 4,
    delay: Math.random() * 3,
    size: 14 + Math.random() * 16,
    symbol: isHeart ? '🧡' : (isBlue ? '🦇' : '💙'),
    driftDuration: 2 + Math.random() * 2,
    driftDelay: Math.random() * 2,
  };
}

const PIECES = Array.from({ length: CONFETTI_COUNT }, (_, i) => createPiece(i));

export default function BatConfettiRain({ active }) {
  const styleRef = useRef(null);

  useEffect(() => {
    if (!styleRef.current) {
      const style = document.createElement('style');
      style.textContent = KEYFRAME_CSS;
      document.head.appendChild(style);
      styleRef.current = style;
    }
    return () => {
      if (styleRef.current) {
        document.head.removeChild(styleRef.current);
        styleRef.current = null;
      }
    };
  }, []);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" aria-hidden="true">
      {PIECES.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            top: '-35px',
            fontSize: `${p.size}px`,
            opacity: 0,
            animation: [
              `batFallAnim ${p.duration}s ${p.delay}s linear infinite`,
              `batDrift ${p.driftDuration}s ${p.driftDelay}s ease-in-out infinite`,
            ].join(', '),
            willChange: 'transform, opacity',
          }}
        >
          {p.symbol}
        </div>
      ))}
    </div>
  );
}
