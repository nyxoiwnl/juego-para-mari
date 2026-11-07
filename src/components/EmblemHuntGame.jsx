import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NightwingLogo from './NightwingLogo';
import QuestionModal from './QuestionModal';

const TOTAL_EMBLEMS = 8;

function generateEmblems() {
  const items = [];
  const cols = 4;
  const rows = 2;
  for (let i = 0; i < TOTAL_EMBLEMS; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = 14 + col * 24 + (Math.random() * 6 - 3);
    const y = 22 + row * 34 + (Math.random() * 6 - 3);
    items.push({ id: i, x, y, isOrange: i % 2 === 1 });
  }
  return items.sort(() => Math.random() - 0.5);
}

export default function EmblemHuntGame({ onComplete }) {
  const [emblems, setEmblems] = useState(generateEmblems);
  const [collected, setCollected] = useState(0);
  const [showQuestion, setShowQuestion] = useState(false);
  const hasFinishedGame = useRef(false);

  const handleCollect = useCallback((id) => {
    setEmblems((prev) => prev.filter((e) => e.id !== id));
    setCollected((c) => {
      const next = c + 1;
      if (next >= TOTAL_EMBLEMS && !hasFinishedGame.current) {
        hasFinishedGame.current = true;
        setTimeout(() => setShowQuestion(true), 500);
      }
      return next;
    });
  }, []);

  const handleQuestionAnswer = (answer) => {
    setShowQuestion(false);
    onComplete(answer);
  };

  return (
    <div className="fixed inset-0 w-full h-full animated-bg overflow-hidden no-select flex flex-col items-center justify-between py-3 sm:py-5 px-3">
      {/* Header Info */}
      <div className="z-20 text-center flex flex-col items-center gap-1 max-w-sm">
        <div className="flex items-center gap-1.5 glass px-3 py-1 rounded-full border border-blue-500/30">
          <NightwingLogo size={18} glow={false} />
          <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-cyan-400 font-bold">
            Misión 1 de 7 · Señales en Kabal
          </span>
        </div>
        <h2 className="text-base sm:text-xl font-bold font-outfit text-white text-glow-blue mt-0.5">
          Activa los Bat-Emblemas 🦇
        </h2>
        <p className="text-[11px] sm:text-xs text-blue-200/70">
          Toca los {TOTAL_EMBLEMS} emblemas para sincronizar nuestras frecuencias.
        </p>

        {/* Progress bar */}
        <div className="w-40 sm:w-48 h-1.5 sm:h-2 bg-slate-850 rounded-full overflow-hidden border border-blue-500/20 mt-1">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-orange-400"
            animate={{ width: `${(collected / TOTAL_EMBLEMS) * 100}%` }}
            transition={{ type: 'spring', stiffness: 100 }}
          />
        </div>
        <span className="text-[10px] text-orange-400 font-mono">
          {collected} / {TOTAL_EMBLEMS} activados
        </span>
      </div>

      {/* Play Area - fixed and calm */}
      <div className="relative w-full h-[55vh] max-w-md my-auto">
        <AnimatePresence>
          {emblems.map((emblem) => (
            <motion.button
              key={emblem.id}
              onClick={() => handleCollect(emblem.id)}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer focus:outline-none p-1"
              style={{ left: `${emblem.x}%`, top: `${emblem.y}%` }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0.95, 1.05, 0.95],
                opacity: 1,
              }}
              exit={{ scale: 1.4, opacity: 0 }}
              transition={{
                scale: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' },
              }}
              whileTap={{ scale: 0.85 }}
            >
              <div
                className={`relative flex items-center justify-center p-2.5 sm:p-3 rounded-2xl border transition-all ${
                  emblem.isOrange
                    ? 'bg-orange-500/20 border-orange-400/60 shadow-[0_0_15px_rgba(255,107,53,0.4)]'
                    : 'bg-blue-600/20 border-cyan-400/60 shadow-[0_0_15px_rgba(0,210,255,0.4)]'
                }`}
              >
                <NightwingLogo size={30} glow={false} />
                <span className="absolute -top-1 -right-1 text-xs">
                  {emblem.isOrange ? '🧡' : '💙'}
                </span>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer hint */}
      <div className="z-10 text-center text-[10px] text-blue-300/40 pb-1">
        Dos trajes iguales en la misma fiesta no podían ser casualidad ⚡
      </div>

      {/* Question 1 Modal */}
      <QuestionModal
        isOpen={showQuestion}
        questionNumber={1}
        totalQuestions={7}
        title="Noche del 31 de octubre en Kabal: ¿Qué pensaste cuando yo me acerqué a pedirte la foto? 📸👀"
        subtitle="¡Sé 100% sincera Mari, que aquí no hay respuestas malas!"
        options={[
          "«¡Wao, otro Nightwing! Tenemos que tomarnos la foto sí o sí» ✨",
          "«Qué pena me da al principio pero se ve súper cool» 🤭",
          "«Este chico me llamó la atención de una» 💙",
          "«Menos mal vine de Nightwing y no de otro personaje» 😂",
        ]}
        placeholder="O cuéntame con tus palabras qué te pasó por la mente en ese momento..."
        onAnswer={handleQuestionAnswer}
      />
    </div>
  );
}
