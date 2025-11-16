import getVapiClient from "@/lib/api/vapiClient";
import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";

let vapiInstance: ReturnType<typeof getVapiClient> | null = null;

export function getVapi() {
    if (!vapiInstance) vapiInstance = getVapiClient();
    return vapiInstance;
}

export function startVapiCall(
    interviewer: CreateAssistantDTO,
    questions: string[]
) {
    const vapi = getVapi();
    const formatted = questions.map((q) => `- ${q}`).join("\n");

    return vapi.start(interviewer, {
        variableValues: { questions: formatted },
    });
}

export function stopVapiCall() {
    const vapi = getVapi();
    vapi.stop();
}

export function resetVapi() {
    if (vapiInstance) {
        vapiInstance.stop?.();
        vapiInstance = null;
    }
}
