import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.GEMINI_API_KEY!;
if (!API_KEY)
    throw new Error("Missing GOOGLE_GEMINI_API_KEY environment variable.");

export default function getGeminiClient(): GoogleGenAI {
    return new GoogleGenAI({ apiKey: API_KEY });
}
