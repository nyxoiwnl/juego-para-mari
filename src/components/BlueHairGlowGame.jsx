import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import NightwingLogo from './NightwingLogo';
import QuestionModal from './QuestionModal';

const TOTAL_STRANDS = 10;

function generateStrands() {
  return Array.from({ length: TOTAL_STRANDS }, (_, i) => ({
    id: i,
    x: 12 + (i % 5) * 19 + (Math.random() * 6 - 3),
    y: 22 + Math.floor(i / 5) * 36 + (Math.random() * 8 - 4),
    angle: (Math.random() - 0.5) * 20,
    length: 65 + Math.random() * 30,
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
              setTimeout(() => setShowQuestion(true), 750);
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
      className="min-h-full w-full animated-bg overflow-y-auto no-select flex flex-col items-center justify-between py-4 sm:py-6 px-3 sm:px-4"
      onPointerMove={handlePointerMove}
      onTouchMove={handleTouchMove}
      style={{ touchAction: 'none' }}
    >
      {/* Header */}
      <div className="z-20 text-center flex flex-col items-center gap-1">
        <div className="flex items-center gap-2 glass px-3.5 py-1 rounded-full border border-blue-500/30">
          <NightwingLogo size={20} glow={false} />
          <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-cyan-400 font-bold">
            Misión 5 de 7 · Universe Lycan
          </span>
        </div>
        <h2 className="text-lg sm:text-2xl font-bold font-outfit text-white text-glow-blue mt-1">
          El Brillo de su Cabello Azul 💙
        </h2>
        <p className="text-xs text-blue-200/70 max-w-xs">
          Desliza tu dedo o cursor sobre los mechones lisos de tono azul Universe.
        </p>

        {/* Counter */}
        <div className="flex items-center gap-2 mt-1.5 bg-slate-900/80 px-3.5 py-0.5 rounded-full border border-blue-500/30">
          <span className="text-xs text-cyan-300 font-semibold">Mechones iluminados:</span>
          <span className="text-sm font-bold text-cyan-400 font-mono">
            {touched.size} / {TOTAL_STRANDS}
          </span>
        </div>
      </div>

      {/* Interactive Strands Canvas */}
      <div className="relative w-full h-[50vh] sm:h-[55vh] max-h-[460px] max-w-md my-auto pointer-events-none">
        {strands.map((s) => {
          const isLit = touched.has(s.id);
          return (
            <motion.div
              key={s.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                transform: `translate(-50%, -50%) rotate(${s.angle}deg)`,
              }}
              animate={{
                y: isLit ? [-3, 3, -3] : [0, 4, 0],
              }}
              transition={{
                duration: 2.5 + (s.id % 3),
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {/* Straight sleek hair strand line */}
              <div
                className={`w-1.5 rounded-full transition-all duration-500 relative ${
                  isLit
                    ? 'bg-gradient-to-b from-cyan-300 via-blue-400 to-blue-600 shadow-[0_0_20px_#00D2FF]'
                    : 'bg-gradient-to-b from-blue-950 via-slate-800 to-blue-900 opacity-40'
                }`}
                style={{ height: `${s.length}px` }}
              >
                {isLit && (
                  <motion.div
                    className="absolute -top-1 left-1/2 -translate-x-1/2 text-sm"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    ✨
                  </motion.div>
                )}
              </div>
              <span className={`text-[10px] mt-1 font-mono transition-opacity ${isLit ? 'opacity-100 text-cyan-300' : 'opacity-0'}`}>
                💙
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="z-10 text-center text-[10px] sm:text-[11px] text-blue-300/40">
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
