import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NightwingLogo from './NightwingLogo';
import QuestionModal from './QuestionModal';

export default function SecretNightwingLetter({ onComplete }) {
  const [opened, setOpened] = useState(false);
  const [revealedPoints, setRevealedPoints] = useState(new Set());
  const [revealPercent, setRevealPercent] = useState(0);
  const [showQuestion, setShowQuestion] = useState(false);
  const containerRef = useRef(null);
  const hasFinishedRef = useRef(false);

  const handleRub = (e) => {
    if (!opened || showQuestion) return;
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.clientX || e.touches?.[0]?.clientX;
    const clientY = e.clientY || e.touches?.[0]?.clientY;
    if (clientX === undefined || clientY === undefined) return;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const gridX = Math.floor((x / rect.width) * 10);
    const gridY = Math.floor((y / rect.height) * 10);
    const pointId = `${gridX}-${gridY}`;

    if (gridX >= 0 && gridX < 10 && gridY >= 0 && gridY < 10) {
      if (!revealedPoints.has(pointId)) {
        const next = new Set(revealedPoints);
        next.add(pointId);
        setRevealedPoints(next);
        const percent = Math.round((next.size / 100) * 100);
        setRevealPercent(percent);

        if (percent >= 55 && !hasFinishedRef.current) {
          hasFinishedRef.current = true;
          setTimeout(() => setShowQuestion(true), 1100);
        }
      }
    }
  };

  const handleAnswer = (answer) => {
    setShowQuestion(false);
    onComplete(answer);
  };

  return (
    <div
      className="fixed inset-0 w-full h-full animated-bg overflow-hidden no-select flex flex-col items-center justify-between py-3 sm:py-5 px-3 select-none"
      style={{ touchAction: 'none' }}
    >
      {/* Header */}
      <div className="z-20 text-center flex flex-col items-center gap-1">
        <div className="flex items-center gap-2 glass px-3.5 py-1 rounded-full border border-blue-500/30">
          <NightwingLogo size={20} glow={false} />
          <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-cyan-400 font-bold">
            Misión 7 de 7 · Mensaje Encriptado
          </span>
        </div>
        <h2 className="text-lg sm:text-2xl font-bold font-outfit text-white text-glow-blue mt-1">
          La Carta de la Baticueva ✉️🦇
        </h2>
        <p className="text-xs text-blue-200/70 max-w-xs">
          {!opened
            ? 'Toca el sobre sellado para desbloquear la carta.'
            : 'Frota con tu dedo o cursor para raspar el holograma.'}
        </p>
      </div>

      {/* Main Letter Card */}
      <div
        ref={containerRef}
        className="relative w-68 sm:w-80 h-84 sm:h-96 flex items-center justify-center my-auto"
        onMouseMove={opened ? handleRub : undefined}
        onTouchMove={opened ? handleRub : undefined}
      >
        <AnimatePresence mode="wait">
          {!opened ? (
            <motion.div
              key="envelope"
              onClick={() => setOpened(true)}
              className="w-60 sm:w-64 h-44 sm:h-48 glass-card rounded-2xl flex flex-col items-center justify-center cursor-pointer shadow-2xl relative border-2 border-cyan-400/50 group"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              exit={{ scale: 0.8, opacity: 0, y: -25 }}
            >
              <NightwingLogo size={60} />
              <span className="text-xs font-bold text-cyan-300 mt-2 tracking-wider uppercase font-outfit">
                Para Mari 🦇🧡
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">
                (Toca para abrir el sello)
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="letter"
              initial={{ y: 40, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              className="w-full h-full glass-card p-5 sm:p-6 rounded-3xl relative overflow-hidden shadow-2xl border-2 border-blue-400/40 flex flex-col justify-between"
            >
              {/* Underlying Secret Message */}
              <div className="h-full flex flex-col justify-center text-center leading-relaxed pointer-events-none z-0">
                <div className="flex justify-center mb-1">
                  <NightwingLogo size={42} />
                </div>
                <h4 className="text-sm font-bold text-cyan-300 font-outfit">
                  Para Mari 🦇
                </h4>
                <p className="text-[11px] sm:text-xs text-slate-200 font-sans mt-2 italic leading-relaxed">
                  "Dicen que uno debe llegar a la vida de la gente a sumar, y en solo días tú le has sumado un montón de risas a mis días.
                  <br /><br />
                  Me encanta conocer a esa chica chef, de cabello azul, que le gusta el sushi y el atardecer tanto como a mí.
                  <br /><br />
                  Con calma pero con ganas... y este sábado se viene una misión especial 👀✨"
                </p>
                <div className="mt-2.5 flex items-center justify-center gap-2">
                  <span className="text-xs font-bold text-orange-400 font-outfit">
                    — Albert 💙🧡
                  </span>
                </div>
              </div>

              {/* Holographic Scratch Mask */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-blue-700 via-slate-900 to-orange-700 pointer-events-none flex items-center justify-center"
                style={{ opacity: Math.max(0, 1 - revealPercent / 55) }}
              >
                <div className="text-center p-4">
                  <span className="text-2xl">✨</span>
                  <p className="text-xs font-bold text-white tracking-wider uppercase mt-1">
                    Frota para revelar...
                  </p>
                  <p className="text-[10px] text-cyan-200/70 font-mono mt-0.5">
                    {revealPercent}% revelado
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress */}
      {opened && (
        <div className="z-10 flex items-center gap-2 text-xs text-blue-200/60 font-semibold py-1">
          <span>Revelado:</span>
          <div className="w-24 sm:w-28 h-2 bg-slate-800 rounded-full overflow-hidden border border-blue-500/30">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
              style={{ width: `${Math.min(100, (revealPercent / 55) * 100)}%` }}
            />
          </div>
          <span className="text-cyan-400 font-mono">{revealPercent}%</span>
        </div>
      )}

      {/* Question 7 (Final) - No fortnite option, completely fun and tailored */}
      <QuestionModal
        isOpen={showQuestion}
        questionNumber={7}
        totalQuestions={7}
        title="Y para cerrar esta misión con broche de oro... Si este sábado cuadramos para nuestra mini cita secreta, ¿qué me dirías? 🦇🧡"
        subtitle="¡La última respuesta antes de ver tu reporte final!"
        options={[
          "¡De una! Cuadremos hora y lugar 🍣🍦",
          "Sí, me encantaría verte de nuevo en persona 💙",
          "Con tal de que haya buena comida y risas, estoy dentro 😌✨",
          "Solo si me prometes que habrá helado y risas garantizadas 🍦✨",
        ]}
        placeholder="O dinos qué te gustaría que hiciéramos ese día..."
        onAnswer={handleAnswer}
      />
    </div>
  );
}
