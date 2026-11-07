import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NightwingLogo from './NightwingLogo';
import QuestionModal from './QuestionModal';

const TARGET_SCORE = 12;
const SUSHI_TYPES = ['🍣', '🍙', '🍤', '🍘', '🍱'];

export default function SushiChefGame({ onComplete }) {
  const [score, setScore] = useState(0);
  const [itemsList, setItemsList] = useState([]);
  const [trayX, setTrayX] = useState(0);
  const [spicyHit, setSpicyHit] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const playAreaRef = useRef(null);
  const gameLoopRef = useRef(null);
  const hasFinishedRef = useRef(false);

  const handlePointerMove = (clientX) => {
    if (!playAreaRef.current) return;
    const rect = playAreaRef.current.getBoundingClientRect();
    const x = clientX - rect.left - rect.width / 2;
    const limit = rect.width / 2 - 38;
    setTrayX(Math.max(-limit, Math.min(limit, x)));
  };

  const handleMouseMove = (e) => handlePointerMove(e.clientX);
  const handleTouchMove = (e) => {
    if (e.touches.length > 0) handlePointerMove(e.touches[0].clientX);
  };

  useEffect(() => {
    if (score >= TARGET_SCORE) return;
    const interval = setInterval(() => {
      const id = Date.now() + Math.random();
      const x = (Math.random() - 0.5) * 240;
      const isWasabi = Math.random() < 0.22;
      const emoji = isWasabi
        ? '🌶️'
        : SUSHI_TYPES[Math.floor(Math.random() * SUSHI_TYPES.length)];

      setItemsList((prev) => [...prev, { id, x, y: -30, emoji, isWasabi, speed: 4.2 + Math.random() * 1.8 }]);
    }, 950);

    return () => clearInterval(interval);
  }, [score]);

  useEffect(() => {
    if (score >= TARGET_SCORE) return;

    const loop = () => {
      if (!playAreaRef.current) {
        gameLoopRef.current = requestAnimationFrame(loop);
        return;
      }

      const areaHeight = playAreaRef.current.clientHeight || 420;
      const catchZoneTop = areaHeight - 75;
      const catchZoneBottom = areaHeight - 15;

      setItemsList((prev) => {
        const next = prev
          .map((s) => ({ ...s, y: s.y + s.speed }))
          .filter((s) => s.y < areaHeight + 20);

        const caught = next.find(
          (s) => s.y >= catchZoneTop && s.y <= catchZoneBottom && Math.abs(s.x - trayX) < 50
        );

        if (caught) {
          if (caught.isWasabi) {
            setSpicyHit(true);
            setTimeout(() => setSpicyHit(false), 450);
            try {
              window.navigator?.vibrate?.(80);
            } catch (e) {}
            setScore((s) => Math.max(0, s - 1));
          } else {
            setScore((s) => {
              const nextScore = s + 1;
              if (nextScore >= TARGET_SCORE && !hasFinishedRef.current) {
                hasFinishedRef.current = true;
                setTimeout(() => setShowQuestion(true), 600);
              }
              return nextScore;
            });
          }
          return next.filter((item) => item.id !== caught.id);
        }

        return next;
      });

      gameLoopRef.current = requestAnimationFrame(loop);
    };

    gameLoopRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(gameLoopRef.current);
  }, [trayX, score]);

  const handleAnswer = (answer) => {
    setShowQuestion(false);
    onComplete(answer);
  };

  return (
    <div
      className="fixed inset-0 w-full h-full animated-bg overflow-hidden no-select flex flex-col items-center justify-between py-3 sm:py-5 px-3"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      style={{ touchAction: 'none' }}
    >
      {/* Header */}
      <div className="z-20 text-center flex flex-col items-center gap-1">
        <div className="flex items-center gap-1.5 glass px-3 py-1 rounded-full border border-blue-500/30">
          <NightwingLogo size={18} glow={false} />
          <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-cyan-400 font-bold">
            Misión 3 de 7 · La Chef de Valencia
          </span>
        </div>
        <h2 className="text-base sm:text-xl font-bold font-outfit text-white text-glow-blue mt-0.5">
          Atrapa el Sushi de la Chef 🍣👩‍🍳
        </h2>
        <p className="text-[11px] sm:text-xs text-blue-200/70 max-w-xs">
          Atrapa 12 piezas de sushi pero <strong>¡esquiva el wasabi 🌶️!</strong>
        </p>

        {/* Counter */}
        <div className="flex items-center gap-2 mt-1">
          <div className="bg-slate-900/80 px-3 py-0.5 rounded-full border border-orange-500/30">
            <span className="text-xs text-orange-300 font-semibold">Sushi: </span>
            <span className="text-xs font-bold text-orange-400 font-mono">
              {score} / {TARGET_SCORE}
            </span>
          </div>
          {spicyHit && (
            <span className="text-xs font-bold text-red-400 bg-red-950/80 px-2 py-0.5 rounded-full border border-red-500/50">
              ¡Picante! -1 🌶️
            </span>
          )}
        </div>
      </div>

      {/* Play Area */}
      <div
        ref={playAreaRef}
        className="relative w-full h-[50vh] sm:h-[55vh] max-h-[440px] max-w-md my-auto"
      >
        <AnimatePresence>
          {itemsList.map((s) => (
            <div
              key={s.id}
              className={`absolute text-3xl sm:text-4xl pointer-events-none filter ${
                s.isWasabi
                  ? 'drop-shadow-[0_4px_8px_rgba(239,68,68,0.7)]'
                  : 'drop-shadow-[0_4px_8px_rgba(255,107,53,0.4)]'
              }`}
              style={{
                left: `calc(50% + ${s.x}px)`,
                top: s.y,
                transform: 'translateX(-50%)',
              }}
            >
              {s.emoji}
            </div>
          ))}
        </AnimatePresence>

        {/* Chef Tray */}
        <div
          className="absolute bottom-3 pointer-events-none flex flex-col items-center"
          style={{
            left: `calc(50% + ${trayX}px)`,
            transform: 'translateX(-50%)',
          }}
        >
          <div
            className={`w-22 sm:w-26 h-7 sm:h-8 rounded-xl border shadow-md flex items-center justify-center gap-1 px-2 transition-all ${
              spicyHit
                ? 'bg-gradient-to-r from-red-700 to-rose-700 border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.7)]'
                : 'bg-gradient-to-r from-amber-700 to-amber-800 border-amber-400/80'
            }`}
          >
            <span className="text-xs">🥢</span>
            <span className="text-[9px] font-bold text-amber-100 uppercase tracking-wider font-outfit">
              Chef Mari
            </span>
            <span className="text-xs">🥢</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="z-10 text-center text-[10px] text-blue-300/40 pb-1">
        Desliza para atrapar sushi y esquivar wasabi 🍣⚡
      </div>

      {/* Question 3 */}
      <QuestionModal
        isOpen={showQuestion}
        questionNumber={3}
        totalQuestions={7}
        title="Como chef experta de la casa: ¿Cuál es ese plato especial o postre con el que enamoras a cualquiera si te toca cocinar? 👩‍🍳🍰"
        subtitle="Sé que te apasiona la repostería y la cocina... ¡cuéntame cuál es tu especialidad!"
        options={[
          "Un postre brutal hecho desde cero (la repostería es mi fuerte) 🍰✨",
          "Una comida casera reconfortante con sazón de los dioses 🍲",
          "Te armo una tabla de sushi roll que te va a encantar 🍣🤤",
          "Prefiero que tú me cocines y yo soy la crítica experta 😌🍽️",
        ]}
        placeholder="O descríbeme exactamente qué prepararías..."
        onAnswer={handleAnswer}
      />
    </div>
  );
}
