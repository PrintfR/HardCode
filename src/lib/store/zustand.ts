import { Feedback, Interview } from "@/lib/types/customTypes";
import { create } from "zustand";

export interface SavedMessage {
    role: "user" | "system" | "assistant";
    content: string;
}

interface InterviewState {
    currentInterview: Interview | null;
    setCurrentInterview: (interview: Interview) => void;

    rawMessages: SavedMessage[];
    addMessage: (message: SavedMessage) => void;

    currentQuestionIndex: number;
    setCurrentQuestionIndex: (index: number) => void;

    feedback: Feedback | null;
    setFeedback: (feedback: Feedback) => void;

    status: "idle" | "generating" | "simulating" | "analyzing" | "completed";
    setStatus: (status: InterviewState["status"]) => void;

    resetInterview: () => void;
}

export const useInterviewStore = create<InterviewState>((set) => ({
    currentInterview: null,
    rawMessages: [],
    feedback: null,
    currentQuestionIndex: 0,
    status: "idle",

    setCurrentInterview: (interview) => set({ currentInterview: interview }),

    addMessage: (message) =>
        set((state) => ({
            rawMessages: [...state.rawMessages, message],
        })),

    setCurrentQuestionIndex: (index) =>
        set((state) => ({
            currentQuestionIndex: Math.max(
                0,
                Math.min(
                    (state.currentInterview?.questions.length ?? 0) - 1,
                    index
                )
            ),
        })),

    setFeedback: (feedback) => set({ feedback }),
    setStatus: (status) => set({ status }),

    resetInterview: () =>
        set({
            currentInterview: null,
            rawMessages: [],
            feedback: null,
            currentQuestionIndex: 0,
            status: "idle",
        }),
}));
