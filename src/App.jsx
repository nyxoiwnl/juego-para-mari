import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import IntroScreen from './components/IntroScreen';
import EmblemHuntGame from './components/EmblemHuntGame';
import DynamicDuoMemory from './components/DynamicDuoMemory';
import SushiChefGame from './components/SushiChefGame';
import NightwingWordSearch from './components/NightwingWordSearch';
import BlueHairGlowGame from './components/BlueHairGlowGame';
import SunsetOrangeStars from './components/SunsetOrangeStars';
import SecretNightwingLetter from './components/SecretNightwingLetter';
import FinalScreen from './components/FinalScreen';

export default function App() {
  const [stage, setStage] = useState('intro');
  const [answers, setAnswers] = useState({});

  const handleStageAnswer = (questionKey, answer, nextStage) => {
    setAnswers((prev) => ({
      ...prev,
      [questionKey]: answer,
    }));
    setStage(nextStage);
  };

  const restart = () => {
    setAnswers({});
    setStage('intro');
  };

  return (
    <div className="fixed inset-0 w-full h-full select-none bg-[#050813] overflow-hidden">
      <AnimatePresence mode="wait">
        {stage === 'intro' && (
          <IntroScreen
            key="intro"
            onStart={() => setStage('emblems')}
          />
        )}

        {stage === 'emblems' && (
          <EmblemHuntGame
            key="emblems"
            onComplete={(ans) => handleStageAnswer('q1', ans, 'memory')}
          />
        )}

        {stage === 'memory' && (
          <DynamicDuoMemory
            key="memory"
            onComplete={(ans) => handleStageAnswer('q2', ans, 'sushi')}
          />
        )}

        {stage === 'sushi' && (
          <SushiChefGame
            key="sushi"
            onComplete={(ans) => handleStageAnswer('q3', ans, 'wordsearch')}
          />
        )}

        {stage === 'wordsearch' && (
          <NightwingWordSearch
            key="wordsearch"
            onComplete={(ans) => handleStageAnswer('q4', ans, 'hair')}
          />
        )}

        {stage === 'hair' && (
          <BlueHairGlowGame
            key="hair"
            onComplete={(ans) => handleStageAnswer('q5', ans, 'sunset')}
          />
        )}

        {stage === 'sunset' && (
          <SunsetOrangeStars
            key="sunset"
            onComplete={(ans) => handleStageAnswer('q6', ans, 'letter')}
          />
        )}

        {stage === 'letter' && (
          <SecretNightwingLetter
            key="letter"
            onComplete={(ans) => handleStageAnswer('q7', ans, 'final')}
          />
        )}

        {stage === 'final' && (
          <FinalScreen
            key="final"
            answers={answers}
            onRestart={restart}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
