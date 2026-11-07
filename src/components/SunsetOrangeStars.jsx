import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NightwingLogo from './NightwingLogo';
import QuestionModal from './QuestionModal';

const TOTAL_STARS = 8;

function SunsetStar({ id, x, y, onCatch }) {
  return (
    <motion.div
      className="absolute cursor-grab active:cursor-grabbing flex items-center justify-center w-14 sm:w-16 h-14 sm:h-16 z-40 -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${x}%`, top: `${y}%`, touchAction: 'none' }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: [1, 1.15, 1],
        opacity: 1,
        y: [0, 8, -8, 0],
        x: [0, -5, 5, 0],
      }}
      transition={{
        duration: 3 + Math.random() * 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      drag
      dragConstraints={{ top: -100, bottom: 600, left: -200, right: 200 }}
      dragElastic={0.4}
      onDragEnd={(event, info) => {
        const dropY = info.point.y;
        const dropX = info.point.x;
        // Check if near jar at bottom center
        const isNearJar =
          dropY > window.innerHeight - 230 &&
          dropX > window.innerWidth / 2 - 110 &&
          dropX < window.innerWidth / 2 + 110;
        if (isNearJar) {
          onCatch(id);
        }
      }}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 1.3 }}
    >
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 bg-orange-400 blur-md rounded-full animate-pulse" />
        <span className="relative text-2xl sm:text-4xl filter drop-shadow-[0_0_12px_rgba(255,107,53,0.9)]">
          🌅
        </span>
      </div>
    </motion.div>
  );
}

export default function SunsetOrangeStars({ onComplete }) {
  const [stars, setStars] = useState([]);
  const [caughtCount, setCaughtCount] = useState(0);
  const [showQuestion, setShowQuestion] = useState(false);
  const starIdCounter = useRef(0);
  const hasFinishedRef = useRef(false);

  useEffect(() => {
    if (caughtCount >= TOTAL_STARS) return;
    const interval = setInterval(() => {
      setStars((prev) => {
        if (prev.length < 4) {
          return [
            ...prev,
            {
              id: starIdCounter.current++,
              x: 15 + Math.random() * 70,
              y: 20 + Math.random() * 38,
            },
          ];
        }
        return prev;
      });
    }, 1100);

    return () => clearInterval(interval);
  }, [caughtCount]);

  const handleCatch = useCallback((id) => {
    try {
      window.navigator?.vibrate?.(40);
    } catch (e) {}

    setStars((prev) => prev.filter((s) => s.id !== id));
    setCaughtCount((c) => {
      const next = c + 1;
      if (next >= TOTAL_STARS && !hasFinishedRef.current) {
        hasFinishedRef.current = true;
        setTimeout(() => setShowQuestion(true), 750);
      }
      return next;
    });
  }, []);

  const handleAnswer = (answer) => {
    setShowQuestion(false);
    onComplete(answer);
  };

  const jarGlow = Math.min((caughtCount / TOTAL_STARS) * 100, 100);

  return (
    <div
      className="min-h-full w-full animated-bg overflow-y-auto no-select flex flex-col items-center justify-between py-4 sm:py-6 px-3 sm:px-4"
      style={{ touchAction: 'none' }}
    >
      {/* Header */}
      <div className="z-20 text-center flex flex-col items-center gap-1">
        <div className="flex items-center gap-2 glass px-3.5 py-1 rounded-full border border-orange-500/30">
          <NightwingLogo size={20} glow={false} />
          <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-orange-400 font-bold">
            Misión 6 de 7 · Su Color Favorito
          </span>
        </div>
        <h2 className="text-lg sm:text-2xl font-bold font-outfit text-white text-glow-orange mt-1">
          El Naranja del Atardecer 🌅🧡
        </h2>
        <p className="text-xs text-orange-200/80 max-w-xs">
          Arrastra los destellos del atardecer hacia el frasco nocturno.
        </p>

        {/* Counter */}
        <div className="flex items-center gap-2 mt-1.5 bg-slate-900/80 px-3.5 py-0.5 rounded-full border border-orange-500/30">
          <span className="text-xs text-orange-300 font-semibold">Atardeceres guardados:</span>
          <span className="text-sm font-bold text-orange-400 font-mono">
            {caughtCount} / {TOTAL_STARS}
          </span>
        </div>
      </div>

      {/* Floating Stars */}
      <AnimatePresence>
        {stars.map((star) => (
          <SunsetStar
            key={star.id}
            id={star.id}
            x={star.x}
            y={star.y}
            onCatch={handleCatch}
          />
        ))}
      </AnimatePresence>

      {/* The Glow Jar at the bottom */}
      <div className="relative z-10 w-32 h-44 sm:w-40 sm:h-48 flex items-end justify-center mb-4 sm:mb-6 pointer-events-none">
        <motion.div
          className="relative w-full h-full rounded-b-[2.5rem] rounded-t-2xl glass-sunset flex flex-col items-center justify-end pb-3 sm:pb-4 border-2 border-orange-400/40"
          style={{
            boxShadow: `0 0 ${20 + jarGlow * 0.4}px rgba(255,107,53,${0.2 + jarGlow / 180})`,
          }}
          animate={{
            scale: caughtCount === TOTAL_STARS ? [1, 1.05, 1] : 1,
          }}
          transition={{ duration: 1.5, repeat: caughtCount === TOTAL_STARS ? Infinity : 0 }}
        >
          {/* Jar Lid */}
          <div className="absolute -top-3 sm:-top-4 w-16 sm:w-20 h-3.5 sm:h-4 bg-amber-800 rounded-sm border-t border-amber-600" />

          {/* Liquid glow */}
          <motion.div
            className="absolute inset-x-2 bottom-2 rounded-b-[2.2rem] pointer-events-none"
            style={{
              height: `${jarGlow}%`,
              background: 'linear-gradient(to top, rgba(255,107,53,0.7) 0%, rgba(255,175,122,0.3) 100%)',
            }}
          />

          <span className="relative z-20 text-2xl sm:text-3xl filter drop-shadow-[0_0_10px_#FF8C42]">
            {caughtCount > 0 ? '🧡' : '✨'}
          </span>
          <span className="relative z-20 text-[9px] sm:text-[10px] font-bold text-orange-200 mt-1 uppercase tracking-wider">
            {caughtCount} / {TOTAL_STARS}
          </span>
        </motion.div>
      </div>

      {/* Question 6 */}
      <QuestionModal
        isOpen={showQuestion}
        questionNumber={6}
        totalQuestions={7}
        title="¿Qué es lo que más te da curiosidad o te ha llamado la atención de mí en estos días hablando? 👀💙"
        subtitle="¡Quiero saber qué impresión te he dado hasta ahora, sin filtros!"
        options={[
          "Lo detallista y atento que eres con cada mensaje 💙✨",
          "Que eres súper enfocado y trabajador con tus proyectos 💻",
          "Tu sentido del humor y que la conversación fluye súper natural 😂",
          "Que coincidimos en cosas inesperadas (Nightwings, sushi, gym...) 🦇🍣",
        ]}
        placeholder="O escribe qué otra cosa te causa curiosidad sobre mí..."
        onAnswer={handleAnswer}
      />
    </div>
  );
}
