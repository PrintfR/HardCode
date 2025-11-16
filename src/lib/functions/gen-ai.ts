import {
    evaluateInterviewSessionPrompt,
    generateInterviewQuestionsPrompt,
} from "@/lib/constants";
import { generateGeminiResponse } from "@/lib/services/geminiResponse";
import { SavedMessage } from "@/lib/store/zustand";
import { Difficulty, InterviewType, Score } from "@/lib/types/customTypes";
import { formatTranscript } from "@/lib/functions/general";

type EvaluationResult = {
    scores: Score;
    suggestions: string[];
};

export async function evaluateInterviewSession(params: {
    transcript: SavedMessage[];
}): Promise<EvaluationResult> {
    const formattedTranscript = formatTranscript(params.transcript);
    const prompt = evaluateInterviewSessionPrompt(formattedTranscript);

    const parsed = await generateGeminiResponse<EvaluationResult>(prompt);
    const { scores, suggestions } = parsed;

    if (
        typeof scores?.communicationSkills !== "number" ||
        typeof scores?.technicalKnowledge !== "number" ||
        typeof scores?.problemSolving !== "number" ||
        typeof scores?.culturalFit !== "number" ||
        typeof scores?.confidenceAndClarity !== "number" ||
        !Array.isArray(suggestions) ||
        suggestions.some(
            (s: string) => typeof s !== "string" || s.trim() === ""
        )
    )
        throw new Error("Invalid evaluation format from Gemini");

    return { scores, suggestions };
}

export async function generateInterviewQuestions(params: {
    position: string;
    techStack: string[];
    type: InterviewType;
    difficulty: Difficulty;
    numberOfQuestions: number;
}): Promise<string[]> {
    const prompt = generateInterviewQuestionsPrompt(
        params.position,
        params.techStack,
        params.type,
        params.difficulty,
        params.numberOfQuestions
    );
    const questions = await generateGeminiResponse<string[]>(prompt);

    if (
        !Array.isArray(questions) ||
        questions.some((q) => typeof q !== "string" || q.trim() === "")
    )
        throw new Error("Invalid question format from Gemini");

    return questions;
}
