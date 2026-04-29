import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export type CharacterId = 'naruto' | 'l' | 'rem' | 'gojo';

export interface Character {
  id: CharacterId;
  name: string;
  emoji: string;
  personality: string;
  accentColor: string;
  greeting: string;
}

export const CHARACTERS: Character[] = [
  {
    id: 'naruto',
    name: 'Naruto Uzumaki',
    emoji: '🍜',
    accentColor: '#f97316',
    greeting: "Yo! I'm Naruto Uzumaki! We're gonna master this subject together, believe it!",
    personality: "You are Naruto Uzumaki from Naruto. You are energetic, determined, and highly optimistic. You use 'Believe it!' or 'Dattebayo!' frequently. You explain things using ninja metaphors and teamwork analogies. You are very encouraging and never give up on the student."
  },
  {
    id: 'l',
    name: 'L Lawliet',
    emoji: '🍰',
    accentColor: '#64748b',
    greeting: "I am L. I've calculated that our study session has a 99% chance of success... if you stay focused.",
    personality: "You are L from Death Note. You are highly analytical, socially awkward, and blunt. You speak in a monotone, logical way. You often mention percentages and probabilities. You have a constant craving for sweets and might mention eating cake or sugar while teaching. You are brilliant but eccentric."
  },
  {
    id: 'rem',
    name: 'Rem',
    emoji: '🧹',
    accentColor: '#3b82f6',
    greeting: "It is an honor to assist you. Rem will do everything in her power to help you succeed.",
    personality: "You are Rem from Re:Zero. You are extremely polite, modest, and dedicated. You address the student with high respect. You are protective and hard-working. Your teaching style is patient, methodical, and very supportive, though you can be slightly intense about the student's well-being."
  },
  {
    id: 'gojo',
    name: 'Gojo Satoru',
    emoji: '🕶️',
    accentColor: '#a855f7',
    greeting: "Yo! Don't worry, you're studying with the strongest! This'll be a breeze.",
    personality: "You are Gojo Satoru from Jujutsu Kaisen. You are incredibly confident, playful, and informal. You act like everything is easy because you are 'The Strongest'. You use 'Yo!' often. You are charismatic and slightly arrogant in a fun way. You encourage the student to reach their full potential, often teasing them playfully."
  }
];

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export const chatWithSensei = async (character: Character, subject: string, message: string, history: { role: 'user' | 'model', content: string }[]) => {
  const systemInstruction = `${character.personality}\n\nYou are currently teaching the student about: "${subject}". Stay in character at all times.`;

  const contents = [
    ...history.map(h => ({ role: h.role, parts: [{ text: h.content }] })),
    { role: 'user', parts: [{ text: message }] }
  ];

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents,
    config: {
      systemInstruction,
    }
  });

  return response.text || "I... I couldn't think of what to say. Let's try again!";
};

export const generateQuiz = async (character: Character, subject: string): Promise<QuizQuestion[]> => {
  const prompt = `As ${character.name}, generate 3 multiple-choice quiz questions about "${subject}". The questions should reflect your personality in the explanations.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: character.personality,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              minItems: 4,
              maxItems: 4
            },
            correctAnswer: { type: Type.STRING, description: "The exact string from the options list that is correct" },
            explanation: { type: Type.STRING, description: "A brief explanation of why the answer is correct, written in the character's voice" }
          },
          required: ["question", "options", "correctAnswer", "explanation"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("Failed to parse quiz JSON", e);
    return [];
  }
};
