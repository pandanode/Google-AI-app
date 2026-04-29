import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "" 
});

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export async function getChatResponse(character: string, subject: string, chatHistory: { role: string, text: string }[]) {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `You are ${character} from your respective anime. 
  Your goal is to teach the user about "${subject}" while staying perfectly in character. 
  Use your iconic catchphrases, speech patterns, and personality traits. 
  Be encouraging but authentic to your source material. 
  Keep responses educational but fun.`;

  const contents = chatHistory.map(msg => ({
    role: msg.role === "user" ? "user" : "model",
    parts: [{ text: msg.text }]
  }));

  try {
    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction,
        temperature: 0.8,
      },
    });
    return response.text || "I... I don't know what to say. (Something went wrong)";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Error: Could not reach the anime world. Please check your connection.";
  }
}

export async function generateQuiz(character: string, subject: string): Promise<QuizQuestion[]> {
  const model = "gemini-3-flash-preview";

  const prompt = `Generate 3 multiple-choice quiz questions about "${subject}". 
  The questions should be challenging but fair. 
  The response must be in JSON format matching the schema provided. 
  Make the questions feel like they are being asked by ${character}.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
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
                description: "Array of 4 possible answers"
              },
              correctAnswer: { 
                type: Type.INTEGER, 
                description: "Index of the correct answer (0-3)"
              }
            },
            required: ["question", "options", "correctAnswer"]
          }
        }
      }
    });

    const text = response.text || "[]";
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Quiz Error:", error);
    return [];
  }
}
