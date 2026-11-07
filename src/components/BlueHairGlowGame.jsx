import { useState, useCallback, useRef } from 'react';
import NightwingLogo from './NightwingLogo';
import QuestionModal from './QuestionModal';

const TOTAL_STRANDS = 10;

function generateStrands() {
  return Array.from({ length: TOTAL_STRANDS }, (_, i) => ({
    id: i,
    x: 12 + (i % 5) * 19 + (Math.random() * 6 - 3),
    y: 22 + Math.floor(i / 5) * 36 + (Math.random() * 6 - 3),
    angle: (Math.random() - 0.5) * 18,
    length: 60 + Math.random() * 25,
  }));
}

export default function BlueHairGlowGame({ onComplete }) {
  const [strands, setStrands] = useState(generateStrands);
  const [touched, setTouched] = useState(new Set());
  const [showQuestion, setShowQuestion] = useState(false);
  const containerRef = useRef(null);
  const hasFinishedRef = useRef(false);

  const checkProximity = useCallback(
    (clientX, clientY) => {
      if (showQuestion || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const px = ((clientX - rect.left) / rect.width) * 100;
      const py = ((clientY - rect.top) / rect.height) * 100;

      strands.forEach((s) => {
        const dx = px - s.x;
        const dy = py - s.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 12) {
          setTouched((prev) => {
            if (prev.has(s.id)) return prev;
            const next = new Set(prev);
            next.add(s.id);
            try {
              window.navigator?.vibrate?.(35);
            } catch (e) {}

            if (next.size === TOTAL_STRANDS && !hasFinishedRef.current) {
              hasFinishedRef.current = true;
              setTimeout(() => setShowQuestion(true), 600);
            }
            return next;
          });
        }
      });
    },
    [strands, showQuestion]
  );

  const handlePointerMove = (e) => checkProximity(e.clientX, e.clientY);
  const handleTouchMove = (e) => {
    if (e.touches[0]) checkProximity(e.touches[0].clientX, e.touches[0].clientY);
  };

  const handleAnswer = (answer) => {
    setShowQuestion(false);
    onComplete(answer);
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full animated-bg overflow-hidden no-select flex flex-col items-center justify-between py-3 sm:py-5 px-3"
      onPointerMove={handlePointerMove}
      onTouchMove={handleTouchMove}
      style={{ touchAction: 'none' }}
    >
      {/* Header */}
      <div className="z-20 text-center flex flex-col items-center gap-1">
        <div className="flex items-center gap-1.5 glass px-3 py-1 rounded-full border border-blue-500/30">
          <NightwingLogo size={18} glow={false} />
          <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-cyan-400 font-bold">
            Misión 5 de 7 · Universe Lycan
          </span>
        </div>
        <h2 className="text-base sm:text-xl font-bold font-outfit text-white text-glow-blue mt-0.5">
          El Brillo de su Cabello Azul 💙
        </h2>
        <p className="text-[11px] sm:text-xs text-blue-200/70 max-w-xs">
          Desliza tu dedo o cursor sobre los mechones lisos de tono azul Universe.
        </p>

        {/* Counter */}
        <div className="flex items-center gap-2 mt-1 bg-slate-900/80 px-3 py-0.5 rounded-full border border-blue-500/30">
          <span className="text-xs text-cyan-300 font-semibold">Iluminados:</span>
          <span className="text-xs font-bold text-cyan-400 font-mono">
            {touched.size} / {TOTAL_STRANDS}
          </span>
        </div>
      </div>

      {/* Interactive Strands Canvas */}
      <div className="relative w-full h-[50vh] sm:h-[55vh] max-h-[440px] max-w-md my-auto pointer-events-none">
        {strands.map((s) => {
          const isLit = touched.has(s.id);
          return (
            <div
              key={s.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                transform: `translate(-50%, -50%) rotate(${s.angle}deg)`,
              }}
            >
              {/* Straight sleek hair strand line */}
              <div
                className={`w-1.5 rounded-full transition-all duration-300 relative ${
                  isLit
                    ? 'bg-gradient-to-b from-cyan-300 via-blue-400 to-blue-600 shadow-[0_0_15px_#00D2FF]'
                    : 'bg-gradient-to-b from-blue-950 via-slate-800 to-blue-900 opacity-40'
                }`}
                style={{ height: `${s.length}px` }}
              >
                {isLit && (
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 text-xs">
                    ✨
                  </div>
                )}
              </div>
              <span className={`text-[9px] mt-0.5 font-mono transition-opacity ${isLit ? 'opacity-100 text-cyan-300' : 'opacity-0'}`}>
                💙
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="z-10 text-center text-[10px] text-blue-300/40 pb-1">
        "3 años con ese azul que te queda espectacular" ⚡
      </div>

      {/* Question 5 */}
      <QuestionModal
        isOpen={showQuestion}
        questionNumber={5}
        totalQuestions={7}
        title="A ver Mari, del 1 al 10: ¿Qué tan consentida te gusta que te traten? 😌👑"
        subtitle="Dato curioso: Albert es detallista nivel experto, así que responde con confianza."
        options={[
          "10/10 me encanta que me consientan y me traten como reina 👑✨",
          "Un sólido 8, pero también me gusta consentir de vuelta 💙",
          "Al principio me da penita, pero en el fondo me encanta 🤭",
          "Sorpréndeme... que el listón está alto 😌",
        ]}
        placeholder="O cuéntame cómo es tu manera ideal de ser consentida..."
        onAnswer={handleAnswer}
      />
    </div>
  );
}
