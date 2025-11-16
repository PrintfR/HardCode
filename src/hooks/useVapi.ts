import { useEffect } from "react";
import { toast } from "sonner";
import { getVapi, resetVapi } from "@/lib/services/vapiService";

export const useVapiCall = ({
    onCallStart,
    onCallEnd,
    onSpeechStart,
    onSpeechEnd,
    onFinalTranscript,
}: {
    onCallStart: () => void;
    onCallEnd: () => void;
    onSpeechStart: () => void;
    onSpeechEnd: () => void;
    onFinalTranscript: (role: MessageRoleEnum, content: string) => void;
}) => {
    useEffect(() => {
        const vapi = getVapi();

        const handleMessage = (message: Message) => {
            if (
                message.type === "transcript" &&
                message.transcriptType === "final"
            ) {
                const content = message.transcript.trim();
                onFinalTranscript(message.role, content);
            }
        };

        const handleError = (err: Error) =>
            toast.error("Vapi Error: " + err.message);

        vapi.on("call-start", onCallStart);
        vapi.on("call-end", onCallEnd);
        vapi.on("speech-start", onSpeechStart);
        vapi.on("speech-end", onSpeechEnd);
        vapi.on("message", handleMessage);
        vapi.on("error", handleError);

        return () => {
            vapi.off("call-start", onCallStart);
            vapi.off("call-end", onCallEnd);
            vapi.off("speech-start", onSpeechStart);
            vapi.off("speech-end", onSpeechEnd);
            vapi.off("message", handleMessage);
            vapi.off("error", handleError);
            resetVapi();
        };
    }, []);
};
