import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, XCircle, Trophy, RefreshCw, Loader2, Home } from "lucide-react";
import { Character } from "./CharacterSelect";
import { generateQuiz, QuizQuestion } from "../services/gemini";

interface Props {
  character: Character;
  subject: string;
  onFinish: (score: number) => void;
}

export default function QuizMode({ character, subject, onFinish }: Props) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    async function loadQuiz() {
      const data = await generateQuiz(character.name, subject);
      setQuestions(data);
      setIsLoading(false);
    }
    loadQuiz();
  }, [character.name, subject]);

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
  };

  const handleConfirm = () => {
    if (selectedOption === null || isAnswered) return;
    
    const correct = questions[currentIndex].correctAnswer === selectedOption;
    if (correct) setScore(s => s + 1);
    setIsAnswered(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsDone(true);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-transparent p-6">
        <div className="relative w-24 h-24 mb-8">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full"
          />
          <div className="absolute inset-0 flex items-center justify-center text-4xl">
            {character.emoji}
          </div>
        </div>
        <h2 className="text-2xl font-display font-bold text-indigo-400 mb-2">Generating Quiz...</h2>
        <p className="text-slate-400 text-center animate-pulse">Wait a moment, I'm thinking of some tough ones!</p>
      </div>
    );
  }

  if (isDone) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-transparent p-6 text-center">
        <motion.div
           initial={{ scale: 0 }}
           animate={{ scale: 1 }}
           className="relative mb-8"
        >
          <div className="text-9xl mb-4 relative z-10">🏆</div>
          <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20" />
        </motion.div>
        
        <h2 className="text-4xl font-display font-bold mb-2">Study Session Complete!</h2>
        <p className="text-slate-400 mb-8">You scored {score} out of {questions.length}</p>
        
        <div className="grid grid-cols-2 gap-4 w-full max-w-md">
          <button 
            onClick={() => onFinish(score)}
            className="anime-button flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Home
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-6 rounded-full flex items-center justify-center gap-2 transition-all"
          >
            <RefreshCw className="w-5 h-5" />
            Restart
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-3xl">
        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-800 rounded-full mb-8 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            className="h-full anime-gradient"
          />
        </div>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
             <span className="text-3xl">{character.emoji}</span>
             <h3 className="font-display font-bold text-xl">{character.name}'s Quiz</h3>
          </div>
          <div className="bg-indigo-500/10 text-indigo-400 px-4 py-1 rounded-full border border-indigo-500/20 text-sm font-bold">
            Question {currentIndex + 1} / {questions.length}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass-card p-6 md:p-10"
          >
            <h4 className="text-xl md:text-2xl font-bold mb-8 leading-tight">{currentQ.question}</h4>
            
            <div className="space-y-4">
              {currentQ.options.map((opt, i) => {
                const isSelected = selectedOption === i;
                const isCorrect = isAnswered && i === currentQ.correctAnswer;
                const isWrong = isAnswered && isSelected && i !== currentQ.correctAnswer;
                
                return (
                  <motion.button
                    key={i}
                    whileHover={!isAnswered ? { x: 5 } : {}}
                    whileTap={!isAnswered ? { scale: 0.98 } : {}}
                    onClick={() => handleSelect(i)}
                    className={`w-full p-4 text-left rounded-xl border-2 transition-all flex items-center justify-between ${
                      isCorrect 
                        ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" 
                        : isWrong 
                          ? "bg-rose-500/20 border-rose-500 text-rose-400"
                          : isSelected
                            ? "bg-indigo-500/20 border-indigo-500 text-indigo-400"
                            : "bg-slate-800/50 border-white/5 text-slate-300 hover:border-white/20"
                    }`}
                  >
                    <span className="font-medium">{opt}</span>
                    {isCorrect && <CheckCircle2 className="w-5 h-5" />}
                    {isWrong && <XCircle className="w-5 h-5" />}
                  </motion.button>
                );
              })}
            </div>

            <div className="mt-8 flex justify-end">
              {!isAnswered ? (
                <button 
                  onClick={handleConfirm}
                  disabled={selectedOption === null}
                  className="anime-button"
                >
                  Verify Answer
                </button>
              ) : (
                <button 
                  onClick={handleNext}
                  className="anime-button flex items-center gap-2"
                >
                  {currentIndex === questions.length - 1 ? "Finish Quiz" : "Next Question"}
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
