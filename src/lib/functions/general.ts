import { SavedMessage } from "@/lib/store/zustand";

export function cleanupGeminiResponse(response: string) {
    const cleaned = response
        .trim()
        .replace(/^```[a-z]*\n?/, "")
        .replace(/```$/, "")
        .trim();
    return cleaned;
}

export function formatTranscript(transcript: SavedMessage[]) {
    return transcript
        .map(
            (msg: { role: string; content: string }) =>
                `- ${msg.role}: ${msg.content}\n`
        )
        .join("");
}
