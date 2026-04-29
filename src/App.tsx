/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import CharacterSelect, { Character } from "./components/CharacterSelect";
import SubjectSetup from "./components/SubjectSetup";
import ChatScreen from "./components/ChatScreen";
import QuizMode from "./components/QuizMode";
import { Trophy, Calendar, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [view, setView] = useState<"select" | "setup" | "chat" | "quiz">("select");
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [currentSubject, setCurrentSubject] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [stats, setStats] = useState({
    totalScore: 0,
    streak: 0,
    lastStudyDate: ""
  });

  useEffect(() => {
    const saved = localStorage.getItem("anime-sensei-stats");
    if (saved) {
      setStats(JSON.parse(saved));
    }
    
    const savedTheme = localStorage.getItem("anime-sensei-theme");
    if (savedTheme === "light") {
      setIsDarkMode(false);
    }
  }, []);

  useEffect(() => {
    if (!isDarkMode) {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
    localStorage.setItem("anime-sensei-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const updateStats = (newScore: number) => {
    const today = new Date().toDateString();
    let newStreak = stats.streak;

    if (stats.lastStudyDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (stats.lastStudyDate === yesterday.toDateString()) {
        newStreak += 1;
      } else {
        newStreak = 1;
      }
    }

    const newStats = {
      totalScore: stats.totalScore + newScore,
      streak: newStreak,
      lastStudyDate: today
    };

    setStats(newStats);
    localStorage.setItem("anime-sensei-stats", JSON.stringify(newStats));
  };

  const handleCharacterSelect = (char: Character) => {
    setSelectedCharacter(char);
    setView("setup");
  };

  const handleStartChat = (subject: string) => {
    setCurrentSubject(subject);
    setView("chat");
  };

  const handleQuizStart = (subject: string) => {
    setCurrentSubject(subject);
    setView("quiz");
  };

  const handleQuizFinish = (score: number) => {
    updateStats(score);
    setView("select");
    setSelectedCharacter(null);
  };

  return (
    <div className="min-h-screen relative">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-900/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-900/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 h-full">
        <AnimatePresence mode="wait">
          {view === "select" && (
            <motion.div
              key="select"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Stats Bar */}
              <div className="absolute top-6 left-6 right-6 flex justify-end items-center gap-4 pointer-events-none">
                <button 
                  onClick={toggleTheme}
                  className="pointer-events-auto glass-card p-2 hover:bg-white/20 transition-all text-indigo-400"
                  title="Toggle Light/Dark Mode"
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5 text-slate-700" />}
                </button>
                <div className="glass-card px-4 py-2 flex items-center gap-2 text-sm font-bold text-indigo-300">
                  <Trophy className="w-4 h-4" />
                  Score: {stats.totalScore}
                </div>
                <div className="glass-card px-4 py-2 flex items-center gap-2 text-sm font-bold text-pink-300">
                  <Calendar className="w-4 h-4" />
                  Streak: {stats.streak} days
                </div>
              </div>
              <CharacterSelect onSelect={handleCharacterSelect} />
            </motion.div>
          )}

          {view === "setup" && selectedCharacter && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full"
            >
              <SubjectSetup 
                character={selectedCharacter}
                onStart={handleStartChat}
                onBack={() => setView("select")}
              />
            </motion.div>
          )}

          {view === "chat" && selectedCharacter && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full"
            >
              <ChatScreen 
                character={selectedCharacter} 
                initialSubject={currentSubject}
                onBack={() => setView("setup")} 
                onQuiz={handleQuizStart} 
              />
            </motion.div>
          )}

          {view === "quiz" && selectedCharacter && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="h-full"
            >
              <QuizMode 
                character={selectedCharacter} 
                subject={currentSubject} 
                onFinish={handleQuizFinish} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
