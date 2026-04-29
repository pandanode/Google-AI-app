import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, ArrowLeft, BrainCircuit, Loader2 } from "lucide-react";
import { Character } from "./CharacterSelect";
import { getChatResponse } from "../services/gemini";

interface Props {
  character: Character;
  initialSubject: string;
  onBack: () => void;
  onQuiz: (subject: string) => void;
}

interface Message {
  role: "user" | "sensei";
  text: string;
}

export default function ChatScreen({ character, initialSubject, onBack, onQuiz }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "sensei", text: `I'm ready! Let's start our lesson on "${initialSubject}". What would you like to know first?` }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);

    setIsLoading(true);
    
    const context = messages.slice(-6).map(m => ({ 
      role: m.role === "user" ? "user" : "model", 
      text: m.text 
    }));
    context.push({ role: "user", text: userMsg });

    const response = await getChatResponse(character.name, initialSubject, context);
    
    setMessages(prev => [...prev, { role: "sensei", text: response }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-transparent font-sans">
      {/* Header */}
      <header className="p-4 glass-card rounded-none border-t-0 border-x-0 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-slate-300" />
          </button>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{character.emoji}</span>
            <div>
              <h2 className="font-display font-bold text-lg leading-tight">{character.name} Sensei</h2>
              <p className="text-xs text-indigo-400 font-medium">{`Lesson: ${initialSubject}`}</p>
            </div>
          </div>
        </div>
        
        <button 
          onClick={() => onQuiz(initialSubject)}
          className="flex items-center gap-2 anime-button py-2 px-4 text-sm"
        >
          <BrainCircuit className="w-4 h-4" />
          Quiz Me!
        </button>
      </header>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth"
      >
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[85%] md:max-w-[70%] p-4 rounded-2xl ${
                msg.role === "user" 
                  ? "bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-900/20" 
                  : "bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700"
              }`}>
                {msg.role === "sensei" && (
                  <div className="text-[10px] uppercase tracking-wider font-bold text-indigo-400 mb-1">
                    {character.name}
                  </div>
                )}
                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-slate-800 p-4 rounded-2xl rounded-tl-none border border-slate-700 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                <span className="text-sm text-slate-400 italic">{character.name} is thinking...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-900/50 backdrop-blur-lg border-t border-white/5">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="max-w-4xl mx-auto flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type anything to learn..."
            className="flex-1 bg-slate-800 border border-slate-700 text-white rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-500"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-full transition-colors shadow-lg shadow-indigo-900/40"
          >
            <Send className="w-6 h-6" />
          </button>
        </form>
      </div>
    </div>
  );
}
