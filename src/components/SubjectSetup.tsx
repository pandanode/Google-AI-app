import React, { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { Character } from "./CharacterSelect";

interface Props {
  character: Character;
  onStart: (subject: string) => void;
  onBack: () => void;
}

export default function SubjectSetup({ character, onStart, onBack }: Props) {
  const [subject, setSubject] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (subject.trim()) {
      onStart(subject.trim());
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-transparent">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl glass-card p-10 flex flex-col items-center relative overflow-hidden"
      >
        {/* Character Avatar Group */}
        <div className="relative mb-8">
          <div className={`absolute inset-0 bg-gradient-to-br ${character.color} blur-2xl opacity-20`} />
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="text-9xl relative z-10"
          >
            {character.emoji}
          </motion.div>
        </div>

        <h2 className="text-3xl font-display font-bold text-center mb-2">
          What shall we learn, <span className="text-indigo-400">Student</span>?
        </h2>
        <p className="text-slate-400 text-center mb-8">
          {character.name} Sensei is ready to guide you. Choose your path!
        </p>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div className="relative group">
            <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            <input
              autoFocus
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter a subject (e.g. Quantum Physics, Cooking, React JS)"
              className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl py-4 pl-14 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600"
            />
            {subject.trim() && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
              </motion.div>
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-2xl transition-all"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={!subject.trim()}
              className="flex-[2] anime-button flex items-center justify-center gap-2 py-4 rounded-2xl"
            >
              Start Lesson
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>

        <div className="mt-8 grid grid-cols-2 gap-3 w-full">
          <p className="col-span-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Quick Suggestions</p>
          {['World History', 'JavaScript', 'Geometry', 'Japanese Culture'].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSubject(s)}
              className="text-sm text-left px-4 py-2 bg-slate-800/30 hover:bg-slate-800 rounded-lg border border-white/5 transition-colors text-slate-400 hover:text-white"
            >
              {s}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
