import { motion } from "motion/react";

export interface Character {
  id: string;
  name: string;
  emoji: string;
  color: string;
  bio: string;
}

const CHARACTERS: Character[] = [
  { id: "naruto", name: "Naruto", emoji: "🍥", color: "from-orange-500 to-yellow-500", bio: "The Hokage who never gives up! Dattebayo!" },
  { id: "l", name: "L", emoji: "🍬", color: "from-slate-700 to-slate-900", bio: "World's greatest detective. Enjoys sweets and mysteries." },
  { id: "rem", name: "Rem", emoji: "🛡️", color: "from-blue-500 to-cyan-500", bio: "The loyal maid of Roswaal Mansion. Let's study together!" },
  { id: "gojo", name: "Gojo", emoji: "🤞", color: "from-indigo-600 to-purple-600", bio: "The strongest sorcerer. I'll teach you everything, infinity and beyond!" },
];

interface Props {
  onSelect: (char: Character) => void;
}

export default function CharacterSelect({ onSelect }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-transparent">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl md:text-7xl font-display font-bold mb-4 text-transparent bg-clip-text anime-gradient text-glow"
      >
        Anime Sensei
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-slate-400 mb-12 text-lg text-center max-w-md"
      >
        Choose your legendary mentor to start your learning journey!
      </motion.p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        {CHARACTERS.map((char, index) => (
          <motion.div
            key={char.id}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ 
              scale: 1.05,
              rotateY: 5,
              rotateX: -5,
              translateY: -10,
              transition: { duration: 0.2 } 
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(char)}
            className="relative group perspective-1000"
          >
            {/* Outer Glow */}
            <div className={`character-card-glow ${char.color}`} />
            
            <div className="character-card glass-card p-8 h-80 flex flex-col items-center justify-between border-2 border-transparent group-hover:border-white/40 relative z-10">
              {/* Shimmer Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 pointer-events-none overflow-hidden">
                <div className="w-full h-full bg-gradient-to-r from-transparent via-white to-transparent -skew-x-12 animate-shimmer" />
              </div>

              <div className={`absolute inset-0 bg-gradient-to-br ${char.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
              
              <div className="text-8xl mb-4 group-hover:animate-float drop-shadow-2xl">
                {char.emoji}
              </div>
              
              <div className="text-center relative z-20">
                <h3 className="text-2xl font-display font-bold text-white mb-2 group-hover:text-glow transition-all">
                  {char.name}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed dark:text-slate-300 light:text-slate-700">
                  {char.bio}
                </p>
              </div>
              
              <motion.div 
                layoutId={`indicator-${char.id}`}
                className={`mt-4 h-1 w-12 bg-gradient-to-r ${char.color} rounded-full group-hover:w-24 transition-all duration-300`} 
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
