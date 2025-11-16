import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";
import {
    interviewerPrompt,
    interviewerTranscriber,
    interviewerVoice,
} from "@/lib/constants";

export const interviewer: CreateAssistantDTO = {
    name: "Interviewer",
    firstMessage:
        "Hello! Really glad you could join me today. I'm here to get to know you better and explore your experience, so let’s dive in when you’re ready.",
    transcriber: interviewerTranscriber,
    voice: interviewerVoice,
    model: {
        provider: "openai",
        model: "gpt-4",
        messages: [{ role: "system", content: interviewerPrompt }],
    },
};
