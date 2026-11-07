import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import NightwingLogo from './NightwingLogo';
import QuestionModal from './QuestionModal';

// 10x10 Grid with diagonal, vertical and horizontal words + believable decoy letters
const GRID = [
  ['N', 'O', 'C', 'H', 'K', 'A', 'B', 'A', 'L', 'P'], // (0,0)=N, (0,4)-(0,8)=KABAL
  ['E', 'I', 'V', 'E', 'N', 'A', 'M', 'O', 'R', 'V'], // (1,1)=I, (1,9)=V of VALENCIA
  ['A', 'L', 'G', 'Y', 'M', 'N', 'S', 'P', 'R', 'A'], // (2,0)=A of ALBERT, (2,2)=G, (2,6)=S of SUSHI, (2,9)=A
  ['L', 'K', 'M', 'H', 'E', 'C', 'U', 'H', 'I', 'L'], // (3,0)=L, (3,2)=M of MARI, (3,3)=H, (3,6)=U, (3,9)=L
  ['B', 'E', 'A', 'C', 'T', 'O', 'S', 'E', 'C', 'E'], // (4,0)=B, (4,2)=A, (4,4)=T, (4,6)=S, (4,9)=E
  ['E', 'T', 'R', 'A', 'P', 'W', 'H', 'I', 'A', 'N'], // (5,0)=E, (5,2)=R, (5,5)=W, (5,6)=H, (5,9)=N
  ['R', 'A', 'I', 'T', 'U', 'S', 'I', 'N', 'D', 'C'], // (6,0)=R, (6,2)=I, (6,6)=I (cross of SUSHI & NIGHTWING), (6,9)=C
  ['T', 'O', 'C', 'A', 'F', 'E', 'C', 'N', 'A', 'I'], // (7,0)=T, (7,7)=N, (7,9)=I
  ['S', 'A', 'Z', 'U', 'L', 'K', 'M', 'O', 'G', 'A'], // (8,1)-(8,4)=AZUL, (8,8)=G, (8,9)=A
  ['D', 'O', 'C', 'T', 'U', 'B', 'R', 'E', 'P', 'S']  // (9,1)-(9,7)=OCTUBRE
];

const WORDS = [
  { word: 'NIGHTWING', start: [0, 0], end: [8, 8], hint: 'Diagonal ↘' },
  { word: 'VALENCIA',  start: [1, 9], end: [8, 9], hint: 'Vertical ↓' },
  { word: 'OCTUBRE',   start: [9, 1], end: [9, 7], hint: 'Horizontal →' },
  { word: 'ALBERT',    start: [2, 0], end: [7, 0], hint: 'Vertical ↓' },
  { word: 'KABAL',     start: [0, 4], end: [0, 8], hint: 'Horizontal →' },
  { word: 'SUSHI',     start: [2, 6], end: [6, 6], hint: 'Vertical ↓' },
  { word: 'AZUL',      start: [8, 1], end: [8, 4], hint: 'Horizontal →' },
  { word: 'MARI',      start: [3, 2], end: [6, 2], hint: 'Vertical ↓' },
];

export default function NightwingWordSearch({ onComplete }) {
  const [foundWords, setFoundWords] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [wrongFlash, setWrongFlash] = useState(null);
  const [showQuestion, setShowQuestion] = useState(false);
  const hasFinishedRef = useRef(false);

  const isWordFound = (w) => foundWords.includes(w);

  const handleCellClick = (r, c) => {
    if (foundWords.length === WORDS.length) return;

    if (!selectedCell) {
      setSelectedCell({ r, c });
      return;
    }

    const start = selectedCell;
    const end = { r, c };

    const match = WORDS.find(
      (w) =>
        !isWordFound(w.word) &&
        ((w.start[0] === start.r && w.start[1] === start.c && w.end[0] === end.r && w.end[1] === end.c) ||
          (w.start[0] === end.r && w.start[1] === end.c && w.end[0] === start.r && w.end[1] === start.c))
    );

    if (match) {
      const updated = [...foundWords, match.word];
      setFoundWords(updated);
      setSelectedCell(null);
      if (updated.length === WORDS.length && !hasFinishedRef.current) {
        hasFinishedRef.current = true;
        setTimeout(() => setShowQuestion(true), 750);
      }
    } else {
      setWrongFlash({ r, c });
      setTimeout(() => setWrongFlash(null), 350);
      setSelectedCell(null);
    }
  };

  const isCellInFoundWord = (r, c) => {
    for (const fw of foundWords) {
      const def = WORDS.find((w) => w.word === fw);
      if (!def) continue;
      const [sR, sC] = def.start;
      const [eR, eC] = def.end;
      const dR = Math.sign(eR - sR);
      const dC = Math.sign(eC - sC);
      let currR = sR;
      let currC = sC;
      while (true) {
        if (currR === r && currC === c) return true;
        if (currR === eR && currC === eC) break;
        currR += dR;
        currC += dC;
      }
    }
    return false;
  };

  const handleAnswer = (answer) => {
    setShowQuestion(false);
    onComplete(answer);
  };

  return (
    <div className="min-h-full w-full animated-bg overflow-y-auto no-select flex flex-col items-center justify-between py-4 sm:py-6 px-2 sm:px-4">
      {/* Header */}
      <div className="z-20 text-center flex flex-col items-center gap-1">
        <div className="flex items-center gap-2 glass px-3.5 py-1 rounded-full border border-blue-500/30">
          <NightwingLogo size={20} glow={false} />
          <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-cyan-400 font-bold">
            Misión 4 de 7 · Archivos Secretos
          </span>
        </div>
        <h2 className="text-lg sm:text-2xl font-bold font-outfit text-white text-glow-blue mt-1">
          Sopa de Letras Nocturna 🔍🦇
        </h2>
        <p className="text-xs text-blue-200/70 max-w-xs">
          ¡Ahora sí es un reto! Las palabras están en horizontal, vertical y diagonal. Toca la primera y la última letra.
        </p>
      </div>

      {/* Words Badges List */}
      <div className="z-10 flex flex-wrap justify-center gap-1 sm:gap-1.5 max-w-md my-2">
        {WORDS.map((w) => {
          const found = isWordFound(w.word);
          return (
            <span
              key={w.word}
              className={`text-[9px] sm:text-[10px] font-bold tracking-wider px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border transition-all ${
                found
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 border-cyan-300 text-white shadow-[0_0_10px_rgba(0,210,255,0.5)]'
                  : 'bg-slate-900/70 border-slate-700/60 text-slate-300'
              }`}
            >
              {w.word} {found ? '✓' : `(${w.hint})`}
            </span>
          );
        })}
      </div>

      {/* 10x10 Grid */}
      <div className="z-10 p-2 sm:p-3 glass-card rounded-2xl max-w-xs sm:max-w-sm w-full border border-blue-500/30 my-auto">
        <div className="grid grid-cols-10 gap-0.5 sm:gap-1">
          {GRID.map((row, r) =>
            row.map((letter, c) => {
              const isSelected = selectedCell?.r === r && selectedCell?.c === c;
              const isFound = isCellInFoundWord(r, c);
              const isWrong = wrongFlash?.r === r && wrongFlash?.c === c;

              return (
                <motion.div
                  key={`${r}-${c}`}
                  onClick={() => handleCellClick(r, c)}
                  className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex items-center justify-center rounded-md sm:rounded-lg cursor-pointer text-[10px] sm:text-xs md:text-sm font-bold font-mono transition-all border ${
                    isFound
                      ? 'bg-gradient-to-br from-blue-600/90 to-cyan-500/90 border-cyan-300 text-white shadow-[0_0_8px_rgba(0,210,255,0.7)]'
                      : isSelected
                      ? 'bg-orange-500 border-orange-300 text-white scale-110 shadow-[0_0_12px_rgba(255,107,53,0.9)] z-10'
                      : isWrong
                      ? 'bg-red-500/80 border-red-400 text-white animate-pulse'
                      : 'bg-slate-900/80 border-white/5 text-slate-300 hover:border-blue-400/50'
                  }`}
                  whileTap={{ scale: 0.9 }}
                >
                  {letter}
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="z-10 text-xs text-blue-200/60 font-semibold py-1">
        Palabras encontradas: <strong className="text-orange-400 font-mono">{foundWords.length} / {WORDS.length}</strong>
      </div>

      {/* Question 4 with updated wording */}
      <QuestionModal
        isOpen={showQuestion}
        questionNumber={4}
        totalQuestions={7}
        title="Una canción de pop chicloso o de tus artistas favoritas (Sabrina Carpenter, Sailorr, Flo, Tate...) que debamos escuchar un día juntos: 🎶🎧"
        subtitle="Sé que te encanta el pop pegajoso... ¿cuál ponemos de primero en la playlist?"
        options={[
          "Cualquiera de Sabrina Carpenter (¡me encantan sus temas!) 💖",
          "Coconut de Sailorr o algo con vibra fresca 🥥✨",
          "Pop dosmilero para cantar a todo pulmón juntos 🎤✨",
          "Te dejo poner música a ti primero a ver qué tal tus gustos 👀🎶",
        ]}
        placeholder="Escribe el nombre de la canción o cantante que quieras recomendar..."
        onAnswer={handleAnswer}
      />
    </div>
  );
}
