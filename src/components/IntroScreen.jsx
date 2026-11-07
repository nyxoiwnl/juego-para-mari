import { motion } from 'framer-motion';
import NightwingLogo from './NightwingLogo';

const STARS = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 1.5 + Math.random() * 2,
  duration: 2 + Math.random() * 2.5,
  delay: Math.random() * 2,
  color: i % 3 === 0 ? '#FFA040' : '#69B1FF',
}));

export default function IntroScreen({ onStart }) {
  return (
    <div className="fixed inset-0 w-full h-full animated-bg flex flex-col items-center justify-start sm:justify-center p-3 sm:p-6 no-select overflow-y-auto overflow-x-hidden overscroll-contain touch-scroll">
      {/* Background stars */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {STARS.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full star"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
              backgroundColor: star.color,
              boxShadow: `0 0 5px ${star.color}`,
              animationDuration: `${star.duration}s`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Main Glass Card */}
      <motion.div
        className="relative z-10 glass-card rounded-[1.8rem] sm:rounded-[2.2rem] px-4 sm:px-7 py-4 sm:py-6 max-w-sm sm:max-w-md w-full flex flex-col items-center gap-2.5 sm:gap-3.5 text-center my-auto shadow-2xl border border-blue-400/30"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Header Badge */}
        <div className="flex items-center justify-between w-full border-b border-blue-500/20 pb-2">
          <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold tracking-wider text-cyan-400 uppercase">
            <NightwingLogo size={20} glow={false} />
            <span>Kabal · 31 de Octubre</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/30 font-semibold">
            <span>💙 Albert</span>
            <span>&</span>
            <span>Mari 🧡</span>
          </div>
        </div>

        {/* Nightwing Logo */}
        <div className="my-0.5">
          <NightwingLogo size={65} />
        </div>

        {/* Headings */}
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white font-outfit">
            Para Mari 🦇
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-orange-400 text-glow-blue">
              La otra Nightwing de Kabal 💙
            </span>
          </h1>

          <p className="text-blue-200/80 text-[11px] sm:text-xs font-sans mt-1 italic max-w-xs mx-auto">
            "Me dijiste que guardara esta foto del recuerdo... así que decidí hacerle todo un juego." 📸✨
          </p>
        </div>

        {/* Photo with controlled height for mobile */}
        <div className="relative max-h-[160px] xs:max-h-[185px] sm:max-h-[220px] aspect-[3/4] mx-auto rounded-2xl overflow-hidden border-2 border-cyan-400/50 shadow-md my-0.5">
          <img
            src="/nightwings.jpg"
            alt="Albert y María como Nightwings en Kabal"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-1.5 inset-x-0 text-center px-1">
            <span className="text-[9px] font-semibold text-white bg-black/75 px-2 py-0.5 rounded-full border border-cyan-400/30">
              ⚡ Los dos Nightwings en Kabal 🦇
            </span>
          </div>
        </div>

        {/* Brief instructions */}
        <p className="text-[10px] sm:text-xs text-slate-300 font-sans leading-snug max-w-xs">
          Supera los minijuegos y responde las preguntas. Al final, tus respuestas me llegarán directo a mi <strong className="text-emerald-400">WhatsApp</strong> 👀🍣
        </p>

        {/* Start Button */}
        <motion.button
          onClick={onStart}
          className="w-full py-3 px-5 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm tracking-wide bg-gradient-to-r from-blue-600 via-cyan-500 to-orange-500 text-white shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer mt-0.5"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>Iniciar Misión Nocturna</span>
          <span>🦇✨</span>
        </motion.button>
      </motion.div>
    </div>
  );
}
