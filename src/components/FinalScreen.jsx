import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, RotateCcw, Copy, Check } from 'lucide-react';
import NightwingLogo from './NightwingLogo';
import BatConfettiRain from './BatConfettiRain';

const QUESTION_TITLES = [
  "[1] 📸 Lo que pensé cuando te acercaste:",
  "[2] 🍣 Qué elegiría hacer en nuestra mini cita:",
  "[3] 👩‍🍳 Mi comida / postre de chef:",
  "[4] 🎶 Canción para escuchar un día juntos:",
  "[5] 👑 Mi nivel de consentida (1 al 10):",
  "[6] 👀 Lo que me da curiosidad de ti:",
  "[7] 🧡 Mi respuesta para este sábado:",
];

export default function FinalScreen({ answers = {}, onRestart }) {
  const [copied, setCopied] = useState(false);
  const [confettiActive, setConfettiActive] = useState(true);

  // Format WhatsApp message cleanly with safe, universal formatting
  const formatWhatsAppMessage = () => {
    let msg = `¡Hola Albert! 🦇💙 Ya completé el juego de los dos Nightwings 🧡\n\nAquí están mis respuestas:\n\n`;

    for (let i = 1; i <= 7; i++) {
      const ans = answers[`q${i}`] || "Sin respuesta";
      msg += `${QUESTION_TITLES[i - 1]}\n👉 ${ans}\n\n`;
    }

    msg += `🦇 ¡Misión Kabal completada con éxito! Nos vemos este sábado 💙🧡`;
    return msg;
  };

  const handleSendWhatsApp = () => {
    const rawMessage = formatWhatsAppMessage();
    // Copy to clipboard as safe backup
    try {
      navigator.clipboard?.writeText(rawMessage);
    } catch(e) {}

    const encoded = encodeURIComponent(rawMessage);
    // Directly target api.whatsapp.com to avoid wa.me 302 redirect character mangling
    const url = `https://api.whatsapp.com/send/?phone=584129983853&text=${encoded}`;
    window.open(url, '_blank');
  };

  const handleCopy = () => {
    const rawMessage = formatWhatsAppMessage();
    navigator.clipboard?.writeText(rawMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 w-full h-full animated-bg overflow-y-auto overflow-x-hidden overscroll-contain touch-scroll no-select flex flex-col items-center justify-start py-6 sm:py-8 px-3 sm:px-4 select-none">
      <BatConfettiRain active={confettiActive} />

      <motion.div
        className="relative z-10 glass-card rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-7 max-w-lg w-full border border-cyan-400/40 text-center shadow-[0_0_50px_rgba(0,128,255,0.3)] my-auto"
        initial={{ scale: 0.95, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', damping: 20 }}
      >
        {/* Top Emblem */}
        <div className="flex justify-center mb-1.5">
          <NightwingLogo size={70} />
        </div>

        <motion.h2
          className="text-xl sm:text-3xl font-extrabold text-white font-outfit text-glow-blue leading-tight"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          ¡Misión Cumplida,
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-orange-400">
            Mari! 🦇💙🧡
          </span>
        </motion.h2>

        <p className="text-[11px] sm:text-xs text-blue-200/70 font-sans mt-1">
          Dos Nightwings en Kabal · 31 de Octubre
        </p>

        {/* PHOTO OF BOTH OF THEM */}
        <motion.div
          className="relative max-h-[190px] sm:max-h-[230px] aspect-[3/4] mx-auto rounded-2xl overflow-hidden border-2 border-cyan-400/50 shadow-[0_0_30px_rgba(0,210,255,0.4)] my-3 group"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
        >
          <img
            src="./nightwings.jpg"
            alt="Albert y María Nightwings"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-2 inset-x-0 text-center">
            <span className="text-[9px] sm:text-[10px] font-bold text-white bg-black/70 px-2.5 py-0.5 rounded-full border border-cyan-400/40">
              ⚡ La foto del recuerdo 🦇
            </span>
          </div>
        </motion.div>

        {/* Note from Albert */}
        <div className="bg-slate-900/80 rounded-2xl p-3.5 sm:p-4 text-left border border-blue-500/30 mb-4">
          <p className="text-xs sm:text-sm text-slate-200 font-sans leading-relaxed italic">
            "Me dijiste que guardara esa foto del recuerdo... y la verdad es que valió cada píxel. En estos días hablando me he dado cuenta de lo trabajadora que eres, lo que le pones a la cocina, tu risa y lo fluido que es hablar contigo.
            <br /><br />
            Este sábado tenemos esa mini cita pendiente y ya tengo todo el plan listo (sorpresa 👀). ¡Ahora dale al botón de abajo para que me lleguen todas tus respuestas!"
          </p>
          <span className="block text-right text-xs font-bold text-orange-400 mt-2 font-outfit">
            — Albert 💙
          </span>
        </div>

        {/* Answers Preview Box */}
        <div className="bg-slate-950/70 rounded-2xl p-3.5 sm:p-4 text-left border border-white/10 mb-4 max-h-52 overflow-y-auto">
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2.5">
            <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider font-outfit">
              📋 Resumen de tus Respuestas:
            </span>
            <span className="text-[10px] text-orange-400 font-mono">
              {Object.keys(answers).length} / 7 respondidas
            </span>
          </div>

          <div className="space-y-2.5">
            {QUESTION_TITLES.map((title, idx) => {
              const ansKey = `q${idx + 1}`;
              const answer = answers[ansKey] || "Sin respuesta";
              return (
                <div key={idx} className="text-xs">
                  <span className="text-slate-400 font-medium block text-[11px]">
                    {title}
                  </span>
                  <span className="text-white font-semibold block mt-0.5 pl-2 border-l-2 border-cyan-400">
                    {answer}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* BIG WHATSAPP BUTTON */}
        <motion.button
          onClick={handleSendWhatsApp}
          className="w-full py-3.5 px-5 rounded-2xl font-bold text-xs sm:text-sm tracking-wide bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 text-white shadow-[0_0_25px_rgba(16,185,129,0.5)] hover:shadow-[0_0_35px_rgba(16,185,129,0.8)] transition-all flex items-center justify-center gap-2 relative overflow-hidden group mb-2.5 cursor-pointer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <MessageSquare size={17} className="fill-current flex-shrink-0" />
          <span className="leading-tight">Enviar mis respuestas a Albert por WhatsApp</span>
          <span className="text-xs flex-shrink-0">📲</span>
        </motion.button>

        {/* Secondary: Copy to Clipboard */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          <motion.button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800/80 px-3 py-1.5 rounded-full border border-white/10 transition-colors cursor-pointer"
            whileTap={{ scale: 0.95 }}
          >
            {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
            <span>{copied ? "¡Copiado al portapapeles!" : "Copiar respuestas"}</span>
          </motion.button>

          <motion.button
            onClick={onRestart}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-1.5 transition-colors cursor-pointer"
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw size={13} />
            <span>Jugar de nuevo</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
