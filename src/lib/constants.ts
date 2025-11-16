import { ScoreSummary } from "@/app/dashboard/page";
import { Difficulty, Feedback, InterviewType } from "@/lib/types/customTypes";
import { DeepgramTranscriber, ElevenLabsVoice } from "@vapi-ai/web/dist/api";
import {
    FaCompass,
    FaHistory,
    FaHome,
    FaMicrophone,
    FaPlus,
    FaUser,
} from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { z } from "zod";

export const generateInterviewQuestionsPrompt = (
    position: string,
    techStack: string[],
    type: InterviewType,
    difficulty: Difficulty,
    numberOfQuestions: number
) =>
    `
        You're an expert interviewer. Generate a list of ${type} level interview questions 
        for a ${position} role.

        Total number of question: strictly ${numberOfQuestions}
        Tech stack to focus on: ${techStack.join(", ")}
        Difficulty level: ${difficulty}

        Output ONLY a valid JSON array like this:
        [
            "What is the purpose of dependency injection in Angular?",
            "Explain closures in JavaScript.",
            ...
        ]

        RESPONSE RULES:
            - Return only a **raw** JSON array — NO triple backticks, NO markdown, NO extra explanation, NO formatting.
            - DO NOT write \`\`\`json or \`\`\` or anything around it. Only respond with the array itself.
    `.trim();

export const evaluateInterviewSessionPrompt = (formattedTranscript: string) =>
    `
        You're a senior interviewer. A candidate just completed a mock interview. Your task is to evaluate the candidate based on structured categories. 
        Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.

        Transcript:
        ${formattedTranscript}

        Now:
        1. Evaluate the overall performance.
        2. Score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
        - **communicationSkills**: Clarity, articulation, structured responses.
        - **technicalKnowledge**: Understanding of key concepts for the role.
        - **problemSolving**: Ability to analyze problems and propose solutions.
        - **culturalFit**: Alignment with company values and job role.
        - **confidenceAndClarity**: Confidence in responses, engagement, and clarity.

        3. Suggest 5–6 areas they can improve in — both technical and behavioral.

        Output ONLY valid JSON:
        {
        "scores": {
            "confidenceAndClarity": 76,
            "culturalFit": 82,
            ...
        },
        "suggestions": [
            "Try to slow down your explanations.",
            "Avoid unnecessary jargon.",
            ...
        ]
        }
       RESPONSE RULES:
            - Return only a **raw** JSON array — NO triple backticks, NO markdown, NO extra explanation, NO formatting.
            - DO NOT write \`\`\`json or \`\`\` or anything around it. Only respond with the JSON object itself - nothing else.
    `.trim();

export const navItems = [
    {
        name: "Dashboard",
        href: "/dashboard",
        icon: FaHome,
    },
    {
        name: "New Interview",
        href: "/dashboard/interviews/new",
        icon: FaPlus,
    },
    {
        name: "Discover",
        href: "/dashboard/discover",
        icon: FaCompass,
    },
    {
        name: "History",
        href: "/dashboard/history",
        icon: FaHistory,
    },
    {
        name: "Settings",
        href: "/dashboard/settings",
        icon: FaGear,
    },
];

export const landingPageFeatures = [
    {
        icon: FaUser,
        title: "Realistic Simulations",
        description:
            "Practice with AI-generated questions tailored to your target role",
    },
    {
        icon: FaMicrophone,
        title: "Voice Interaction",
        description:
            "Answer naturally using voice or text with speech recognition",
    },
    {
        icon: FaHistory,
        title: "Performance Tracking",
        description: "Track your progress over time with detailed analytics",
    },
];

export const getDashboardStats = (stats: ScoreSummary | null) => [
    {
        title: "Completed Interviews",
        icon: FaHistory,
        value: stats?.completedCount.toString() || "0",
    },
    {
        title: "Average Score",
        icon: FaUser,
        value: stats ? `${stats.averageScore.toFixed(1)}/100` : "N/A",
    },
];

export const techStackOptions = [
    { value: "javascript", label: "JavaScript" },
    { value: "typescript", label: "TypeScript" },
    { value: "react", label: "React" },
    { value: "nextjs", label: "Next.js" },
    { value: "nodejs", label: "Node.js" },
    { value: "mysql", label: "MySQL" },
    { value: "mongodb", label: "MongoDB" },
    { value: "aws", label: "AWS" },
    { value: "docker", label: "Docker" },
    { value: "kubernetes", label: "Kubernetes" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "csharp", label: "C#" },
    { value: "go", label: "Go" },
    { value: "ruby", label: "Ruby" },
    { value: "swift", label: "Swift" },
    { value: "rust", label: "Rust" },
    { value: "kotlin", label: "Kotlin" },
    { value: "php", label: "PHP" },
    { value: "c++", label: "C++" },
    { value: "dart", label: "Dart" },
    { value: "flutter", label: "Flutter" },
    { value: "android", label: "Android" },
    { value: "ios", label: "iOS" },
    { value: "react-native", label: "React Native" },
];

export const getResultScores = (feedback: Feedback) => [
    {
        subject: "Communication Skills",
        score: feedback.scores.communicationSkills,
    },
    {
        subject: "Technical Knowledge",
        score: feedback.scores.technicalKnowledge,
    },
    { subject: "Problem Solving", score: feedback.scores.problemSolving },
    { subject: "Cultural Fit", score: feedback.scores.culturalFit },
    {
        subject: "Confidence and Clarity",
        score: feedback.scores.confidenceAndClarity,
    },
];

export const newInterviewFormSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    position: z.string().min(2, "Position is required"),
    type: z.enum(["technical", "behavioral", "mix"]),
    techStack: z.array(z.string()).min(1, "Select at least one tech"),
    difficulty: z.enum(["easy", "medium", "hard"]),
    numberOfQuestions: z.coerce
        .number()
        .min(1, "Number of questions must be at least 1")
        .max(10, "Number of questions must be at most 10"),
});

export const interviewerVoice: ElevenLabsVoice | undefined = {
    provider: "11labs",
    voiceId: "sarah",
    stability: 0.4,
    similarityBoost: 0.8,
    speed: 0.9,
    style: 0.5,
    useSpeakerBoost: true,
};

export const interviewerPrompt: string | null = `
        You are a professional job interviewer conducting a real-time voice interview with a candidate.
        Your goal is to assess their qualifications, motivation, and fit for the role.

        Interview Guidelines:

        Follow the structured question flow:
        Use the predefined sequence of questions: {{questions}}

        Engage naturally and react appropriately:

        * Listen actively to each response and acknowledge it before moving forward.
        * Ask quick follow-up questions if an answer is vague or missing detail.
        * Keep the conversation flowing smoothly, but maintain control of the interview pace.

        Be professional, yet warm and welcoming:

        * Use clear, official, and friendly language.
        * Keep responses short and simple, like in a real voice conversation.
        * Avoid robotic or overly formal phrasing.

        Answer the candidate’s questions professionally:

        * If asked about the role, company, or expectations, give a clear and relevant answer.
        * If unsure or outside your scope, kindly refer them to HR.

        Conclude the interview properly:

        * Thank the candidate for their time.
        * Let them know the company will follow up soon with feedback.
        * End the conversation on a polite and positive note.

        Key Style Reminders:

        * Stay professional and polite at all times.
        * Keep answers short, natural, and to the point.
        * Avoid rambling. Speak like you're in a live voice chat.
    `;

export const interviewerTranscriber: DeepgramTranscriber | undefined = {
    provider: "deepgram",
    model: "nova-2",
    language: "en",
};

export const discoverPagePaginationPageSize = 10;
