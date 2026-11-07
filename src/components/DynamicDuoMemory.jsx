import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import NightwingLogo from './NightwingLogo';
import QuestionModal from './QuestionModal';

const ICONS = [
  { id: 'sushi', emoji: '🍣', label: 'Sushi' },
  { id: 'nightwing', emoji: '🦇', label: 'Nightwings' },
  { id: 'arcade', emoji: '🕹️', label: 'Arcade' },
  { id: 'sunset', emoji: '🌅', label: 'Atardecer' },
  { id: 'earbuds', emoji: '🎧', label: 'Audífonos' },
  { id: 'blueheart', emoji: '💙', label: 'Azul Albert' },
  { id: 'orangeheart', emoji: '🧡', label: 'Naranja Mari' },
  { id: 'icecream', emoji: '🍦', label: 'Heladito' },
];

const generateCards = () => {
  const deck = [...ICONS, ...ICONS].map((item, index) => ({
    uid: index,
    ...item,
    isFlipped: false,
    isMatched: false,
  }));
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

export default function DynamicDuoMemory({ onComplete }) {
  const [cards, setCards] = useState(generateCards);
  const [flipped, setFlipped] = useState([]);
  const [isLocked, setIsLocked] = useState(false);
  const [matches, setMatches] = useState(0);
  const [showQuestion, setShowQuestion] = useState(false);
  const hasFinishedRef = useRef(false);

  const handleCardClick = (index) => {
    if (isLocked) return;
    if (cards[index].isFlipped || cards[index].isMatched) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setIsLocked(true);
      const [first, second] = newFlipped;

      if (newCards[first].id === newCards[second].id) {
        setTimeout(() => {
          setCards((prev) => {
            const updated = [...prev];
            updated[first].isMatched = true;
            updated[second].isMatched = true;
            return updated;
          });
          setMatches((m) => {
            const next = m + 1;
            if (next === ICONS.length && !hasFinishedRef.current) {
              hasFinishedRef.current = true;
              setTimeout(() => setShowQuestion(true), 600);
            }
            return next;
          });
          setFlipped([]);
          setIsLocked(false);
        }, 300);
      } else {
        setTimeout(() => {
          setCards((prev) => {
            const reset = [...prev];
            reset[first].isFlipped = false;
            reset[second].isFlipped = false;
            return reset;
          });
          setFlipped([]);
          setIsLocked(false);
        }, 750);
      }
    }
  };

  const handleAnswer = (answer) => {
    setShowQuestion(false);
    onComplete(answer);
  };

  return (
    <div className="fixed inset-0 w-full h-full animated-bg overflow-hidden no-select flex flex-col items-center justify-between py-3 sm:py-5 px-3">
      {/* Header */}
      <div className="z-20 text-center flex flex-col items-center gap-1">
        <div className="flex items-center gap-1.5 glass px-3 py-1 rounded-full border border-blue-500/30">
          <NightwingLogo size={18} glow={false} />
          <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-cyan-400 font-bold">
            Misión 2 de 7 · Sincronía
          </span>
        </div>
        <h2 className="text-base sm:text-xl font-bold font-outfit text-white text-glow-blue mt-0.5">
          El Dúo Dinámico 🦇✨
        </h2>
        <p className="text-[11px] sm:text-xs text-blue-200/70 max-w-xs">
          Encuentra los 8 pares de íconos que nos conectan.
        </p>
      </div>

      {/* Grid of 16 Cards (4x4) */}
      <div className="grid grid-cols-4 gap-1.5 sm:gap-2.5 p-2 sm:p-3 glass-card rounded-2xl max-w-xs sm:max-w-sm md:max-w-md w-full border border-blue-400/30 my-auto">
        {cards.map((card, idx) => (
          <div
            key={card.uid}
            onClick={() => handleCardClick(idx)}
            className="aspect-[4/5] cursor-pointer perspective-1000 relative"
          >
            <motion.div
              className="w-full h-full relative transition-all duration-300"
              animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Back (hidden initially) */}
              <div
                className="absolute inset-0 rounded-xl flex flex-col items-center justify-center border border-blue-500/40 bg-gradient-to-br from-blue-900/60 to-slate-900/90 shadow-sm p-1"
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                }}
              >
                <NightwingLogo size={22} glow={false} />
                <span className="text-[7px] text-cyan-400/80 font-bold tracking-widest uppercase mt-0.5">
                  Kabal
                </span>
              </div>

              {/* Front (revealed) */}
              <div
                className={`absolute inset-0 rounded-xl flex flex-col items-center justify-center p-1 border transition-all ${
                  card.isMatched
                    ? 'bg-gradient-to-br from-blue-600/40 via-cyan-500/20 to-orange-500/30 border-orange-400 shadow-[0_0_10px_rgba(255,107,53,0.4)]'
                    : 'bg-slate-900/95 border-cyan-400'
                }`}
                style={{
                  transform: 'rotateY(180deg)',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                }}
              >
                <span className="text-xl sm:text-2xl filter drop-shadow-sm">
                  {card.emoji}
                </span>
                <span className="text-[7px] sm:text-[8px] font-bold text-slate-200 mt-0.5 text-center leading-tight">
                  {card.label}
                </span>
              </div>
            </motion.div>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div className="z-10 flex items-center gap-2 text-xs text-blue-200/60 font-semibold py-1">
        <span>Progreso:</span>
        <div className="w-24 sm:w-28 h-1.5 sm:h-2 bg-slate-800 rounded-full overflow-hidden border border-blue-500/30">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-400 to-orange-400"
            animate={{ width: `${(matches / ICONS.length) * 100}%` }}
          />
        </div>
        <span className="text-orange-400 font-mono">{matches} / {ICONS.length}</span>
      </div>

      {/* Question 2 */}
      <QuestionModal
        isOpen={showQuestion}
        questionNumber={2}
        totalQuestions={7}
        title="Dicen que se viene una mini-cita secreta este sábado... 👀 Si pudieras elegir qué hacemos primero, ¿qué sería? 🍣🍦"
        subtitle="¡Elige tu plan favorito o escribe qué se te antoja!"
        options={[
          "Comer sushi rico y un heladito para empezar bien 🍣🍦",
          "Echar unas partidas de minijuegos y arcade a ver quién gana 🕹️👾",
          "Chismear sabroso mientras buscamos un buen spot para el atardecer 🌅",
          "Dejarme sorprender al 100% porque confío en tu plan 😌✨",
        ]}
        placeholder="O escribe qué otra cosa te gustaría que hiciéramos..."
        onAnswer={handleAnswer}
      />
    </div>
  );
}
