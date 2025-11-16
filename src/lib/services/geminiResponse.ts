import getGeminiClient from "@/lib/api/geminiClient";
import { cleanupGeminiResponse } from "@/lib/functions/general";

const config = { responseMimeType: "text/plain" };
const model = "gemini-2.5-flash";

export async function generateGeminiResponse<T>(prompt: string): Promise<T> {
    const genAI = getGeminiClient();

    const contents = [{ role: "user", parts: [{ text: prompt }] }];
    const result = await genAI.models.generateContent({
        model,
        config,
        contents,
    });

    const raw = result?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!raw) throw new Error("Empty response from Gemini");

    const cleaned = cleanupGeminiResponse(raw);

    try {
        return JSON.parse(cleaned) as T;
    } catch (err) {
        console.error("Gemini response parse error:", raw, err);
        throw new Error("Gemini response format error");
    }
}
