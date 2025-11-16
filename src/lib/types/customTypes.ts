// --- ENUMS --- //

export type InterviewType = "technical" | "behavioral" | "mix";
export type Difficulty = "easy" | "medium" | "hard";

// --- CORE ENTITIES --- //
export interface User {
    id: string;
    name: string;
    email: string;
    image?: string;
    createdAt: Date;
}

export interface Interview {
    id: string;
    title: string;
    position: string;
    techStack: string[];
    numberOfQuestions: number;
    type: InterviewType;
    difficulty: Difficulty;
    questions: Question[];
    createdAt: Date;
    createdBy: string; // User ID
}

export interface Question {
    id: string;
    text: string;
}

// --- INTERVIEW SESSION  --- //

export interface InterviewSession {
    id: string;
    interviewId: string;
    userId: string;
    feedback?: Feedback;
    startedAt: Date;
    completedAt?: Date;
}

export interface Feedback {
    scores: Score;
    suggestions: string[];
}

export interface Score {
    communicationSkills: number; // 0–100
    technicalKnowledge: number; // 0–100
    problemSolving: number; // 0–100
    culturalFit: number; // 0–100
    confidenceAndClarity: number; // 0–100
}

// Vapi Call Status
export enum CallStatus {
    INACTIVE = "INACTIVE",
    CONNECTING = "CONNECTING",
    ACTIVE = "ACTIVE",
    FINISHED = "FINISHED",
}

// Paginated Response for Discover Page
export interface PaginatedResponse {
    data: Interview[];
    total: number;
    totalPages: number;
    page: number;
}
