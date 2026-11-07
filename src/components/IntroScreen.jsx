import { motion } from 'framer-motion';
import NightwingLogo from './NightwingLogo';

const STARS = Array.from({ length: 25 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 1.5 + Math.random() * 2.5,
  duration: 1.5 + Math.random() * 3,
  delay: Math.random() * 3,
  color: i % 3 === 0 ? '#FFA040' : '#69B1FF',
}));

export default function IntroScreen({ onStart }) {
  return (
    <div className="min-h-full w-full animated-bg flex flex-col items-center justify-center p-3 sm:p-6 no-select overflow-y-auto">
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
              boxShadow: `0 0 6px ${star.color}`,
              animationDuration: `${star.duration}s`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Ambient glowing circles */}
      <div 
        className="fixed top-1/4 left-1/4 w-[20rem] h-[20rem] pointer-events-none rounded-full" 
        style={{ background: 'radial-gradient(circle, rgba(0,128,255,0.15) 0%, transparent 65%)' }}
      />
      <div 
        className="fixed bottom-1/4 right-1/4 w-[22rem] h-[22rem] pointer-events-none rounded-full" 
        style={{ background: 'radial-gradient(circle, rgba(255,107,53,0.12) 0%, transparent 65%)' }}
      />

      {/* Main Glass Card */}
      <motion.div
        className="relative z-10 glass-card rounded-[2rem] sm:rounded-[2.5rem] px-5 sm:px-8 py-5 sm:py-7 max-w-md w-full flex flex-col items-center gap-3 sm:gap-4 text-center my-auto shadow-[0_0_50px_rgba(0,128,255,0.25)] border border-blue-400/30"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.8, type: 'spring', damping: 20 }}
      >
        {/* Top Header Badge */}
        <div className="flex items-center justify-between w-full border-b border-blue-500/20 pb-2.5">
          <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold tracking-widest text-cyan-400 uppercase">
            <NightwingLogo size={24} glow={false} />
            <span>Kabal · 31 de Octubre</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded-full border border-orange-500/30 font-semibold">
            <span>💙 Albert</span>
            <span>&</span>
            <span>Mari 🧡</span>
          </div>
        </div>

        {/* Nightwing Logo */}
        <motion.div
          animate={{ y: [-3, 3, -3] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="mt-0.5"
        >
          <NightwingLogo size={80} />
        </motion.div>

        {/* Headings */}
        <div>
          <motion.h1
            className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white font-outfit"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Para Mari 🦇
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-orange-400 text-glow-blue">
              La otra Nightwing de Kabal 💙
            </span>
          </motion.h1>

          <motion.p
            className="text-blue-200/80 text-xs sm:text-sm font-sans mt-1.5 italic max-w-xs mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            "Me dijiste que guardara esta foto del recuerdo... así que decidí hacerle todo un juego." 📸✨
          </motion.p>
        </div>

        {/* Photo with responsive max-height */}
        <motion.div
          className="relative max-h-[200px] sm:max-h-[240px] aspect-[3/4] mx-auto rounded-2xl overflow-hidden border-2 border-cyan-400/50 shadow-[0_0_25px_rgba(0,210,255,0.35)] group my-0.5"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, type: 'spring' }}
          whileHover={{ scale: 1.02 }}
        >
          <img
            src="/nightwings.jpg"
            alt="Albert y María como Nightwings en Kabal"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-2 inset-x-0 text-center px-2">
            <span className="text-[10px] font-semibold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] bg-black/70 px-2.5 py-0.5 rounded-full border border-cyan-400/30">
              ⚡ Los dos Nightwings en Kabal 🦇
            </span>
          </div>
        </motion.div>

        {/* Brief instructions */}
        <p className="text-[11px] sm:text-xs text-slate-300 font-sans leading-relaxed max-w-xs">
          Supera cada minijuego y responde las preguntas. Al final, tus respuestas llegarán directo a mi <strong className="text-emerald-400">WhatsApp</strong> para coordinar la misión secreta de este sábado 👀🍕🍣
        </p>

        {/* Start Button */}
        <motion.button
          onClick={onStart}
          className="w-full py-3 sm:py-3.5 px-6 rounded-2xl font-bold text-xs sm:text-sm tracking-wide bg-gradient-to-r from-blue-600 via-cyan-500 to-orange-500 text-white shadow-[0_0_25px_rgba(0,168,255,0.5)] hover:shadow-[0_0_35px_rgba(255,107,53,0.6)] transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden group cursor-pointer"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="relative z-10 flex items-center gap-2">
            <span>Iniciar Misión Nocturna</span>
            <span>🦇✨</span>
          </span>
          <motion.div
            className="absolute inset-0 bg-white/20"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.button>

        <span className="text-[9px] sm:text-[10px] text-blue-300/50">
          Toca o haz clic para interactuar · Hecho para Mari 🧡
        </span>
      </motion.div>
    </div>
  );
}
