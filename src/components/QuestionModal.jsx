import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2 } from 'lucide-react';
import NightwingLogo from './NightwingLogo';

export default function QuestionModal({
  isOpen,
  questionNumber,
  totalQuestions = 7,
  title,
  subtitle,
  options = [],
  placeholder = "Escribe aquí si quieres agregar algo más...",
  onAnswer,
}) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [customText, setCustomText] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = () => {
    const finalAnswer = selectedOption 
      ? (customText.trim() ? `${selectedOption} — "${customText.trim()}"` : selectedOption)
      : customText.trim();

    if (!finalAnswer) {
      setError(true);
      return;
    }

    onAnswer(finalAnswer);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md no-select overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative w-full max-w-md my-auto max-h-[92vh] overflow-y-auto glass-card rounded-[2rem] p-5 sm:p-7 border border-blue-500/30 text-white shadow-2xl"
          initial={{ scale: 0.95, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 15, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 220 }}
        >
          {/* Ambient header glow */}
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-orange-500/20 rounded-full blur-2xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between border-b border-blue-500/20 pb-2.5 mb-3.5">
            <div className="flex items-center gap-2">
              <NightwingLogo size={26} glow={false} />
              <span className="text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-cyan-400">
                Misión {questionNumber} de {totalQuestions}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded-full border border-orange-500/20 font-medium">
              <span>Para Mari</span>
              <span>🧡</span>
            </div>
          </div>

          {/* Question Text */}
          <div className="mb-3.5">
            <h3 className="text-base sm:text-lg font-bold text-white text-glow-blue leading-snug font-outfit">
              {title}
            </h3>
            {subtitle && (
              <p className="text-[11px] sm:text-xs text-blue-200/70 mt-1">
                {subtitle}
              </p>
            )}
          </div>

          {/* Options */}
          {options.length > 0 && (
            <div className="space-y-2 mb-3.5">
              {options.map((opt, idx) => {
                const isSelected = selectedOption === opt;
                return (
                  <motion.button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedOption(opt);
                      setError(false);
                    }}
                    className={`w-full text-left p-2.5 sm:p-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm transition-all duration-200 flex items-center justify-between border cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-blue-600/40 to-cyan-500/30 border-cyan-400 text-white shadow-[0_0_15px_rgba(0,210,255,0.3)]'
                        : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200'
                    }`}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>{opt}</span>
                    {isSelected && (
                      <CheckCircle2 size={16} className="text-cyan-400 flex-shrink-0 ml-2" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          )}

          {/* Custom text field */}
          <div className="mb-3.5">
            <label className="block text-[10px] sm:text-[11px] font-medium text-blue-200/60 mb-1">
              {options.length > 0 ? "O escribe tu propia respuesta / añade algo más:" : "Tu respuesta:"}
            </label>
            <textarea
              rows={2}
              value={customText}
              onChange={(e) => {
                setCustomText(e.target.value);
                setError(false);
              }}
              placeholder={placeholder}
              className="w-full bg-slate-900/80 border border-blue-500/30 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all resize-none"
            />
            {error && (
              <p className="text-[10px] sm:text-[11px] text-red-400 mt-1">
                ¡Porfa elige una opción o escribe tu respuesta para avanzar! 🦇
              </p>
            )}
          </div>

          {/* Submit Button */}
          <motion.button
            type="button"
            onClick={handleSubmit}
            className="w-full py-3 px-4 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm tracking-wide bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 text-white shadow-[0_0_20px_rgba(0,128,255,0.4)] flex items-center justify-center gap-2 group transition-all cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>Guardar respuesta y seguir</span>
            <Send size={14} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
