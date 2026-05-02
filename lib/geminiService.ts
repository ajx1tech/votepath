import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || '');

/**
 * Interface representing a chat message.
 */
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

let lastCallTime = 0;
const translationCache = new Map<string, string>();

/**
 * Wait for a specified number of milliseconds.
 * @param {number} ms - Milliseconds to wait.
 * @returns {Promise<void>}
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Sanitizes user input by trimming and removing HTML tags.
 * @param {string} input - The input string to sanitize.
 * @returns {string} Sanitized string.
 */
const sanitizeInput = (input: string): string => {
  return input.replace(/<[^>]*>?/gm, '').trim();
};

/**
 * Asks the Gemini assistant a question about the election process.
 * @param {string} userMessage - The user's query.
 * @param {ChatMessage[]} conversationHistory - Previous chat messages.
 * @param {string} language - The user's preferred language.
 * @returns {Promise<string>} The assistant's response.
 */
export async function askElectionAssistant(
  userMessage: string,
  conversationHistory: ChatMessage[],
  language: string
): Promise<string> {
  try {
    const sanitizedMessage = sanitizeInput(userMessage);
    
    // Rate limiting: max 1 request per second
    const now = Date.now();
    const timeSinceLastCall = now - lastCallTime;
    if (timeSinceLastCall < 1000) {
      await delay(1000 - timeSinceLastCall);
    }
    lastCallTime = Date.now();

    const systemPrompt = `You are VotePath, a friendly election education assistant. Help users understand the democratic process, voting steps, eligibility, and election timeline in India. Be factual, neutral, and non-partisan. Always encourage civic participation. Keep answers concise (under 150 words). If user asks in Hindi, respond in Hindi. Current language preference: ${language}. Do not discuss political parties or candidates.`;

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: systemPrompt
    });

    // Convert history to Gemini's expected format
    const history = conversationHistory.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const chat = model.startChat({
      history
    });

    const result = await chat.sendMessage(sanitizedMessage);
    return result.response.text();
  } catch (error) {
    console.error("Error communicating with Gemini assistant:", error);
    return "I'm having trouble connecting right now. Please try again in a moment.";
  }
}

/**
 * Translates text into the target language using Gemini.
 * @param {string} text - Text to translate.
 * @param {string} targetLanguage - Target language for translation.
 * @returns {Promise<string>} Translated text.
 */
export async function translateText(text: string, targetLanguage: string): Promise<string> {
  const cacheKey = `${targetLanguage}:${text}`;
  
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Translate the following text accurately into ${targetLanguage}. Keep the original meaning and tone intact. Return only the translated text without any quotes or extra explanation.\n\nText: "${text}"`;

    const result = await model.generateContent(prompt);
    const translatedText = result.response.text().trim();
    
    translationCache.set(cacheKey, translatedText);
    return translatedText;
  } catch (error) {
    console.error("Error translating text:", error);
    return text; // Return original text gracefully
  }
}
