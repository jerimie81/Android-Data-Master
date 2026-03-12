import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export function createChatSession() {
  return ai.chats.create({
    model: 'gemini-3.1-pro-preview',
    config: {
      systemInstruction: 'You are an expert Android rooting, backup, and recovery assistant. You help users understand Android partitions (boot, recovery, userdata, efs, metadata, etc.), Magisk, shell scripts, and the backup/restore process for Samsung devices like the A16.',
    },
  });
}

export async function performSearch(query: string) {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: query,
    config: {
      tools: [{ googleSearch: {} }],
      systemInstruction: 'You are a helpful assistant providing up-to-date information about Android devices, rooting, and troubleshooting. Always use Google Search to find the most accurate and recent information.',
    },
  });
  
  return {
    text: response.text,
    groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
}
