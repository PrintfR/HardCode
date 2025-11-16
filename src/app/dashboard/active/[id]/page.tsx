"use client";

import Loader from "@/components/Loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useVapiCall } from "@/hooks/useVapi";
import { interviewer } from "@/lib/services/vapiInterviewer";
import { startVapiCall, stopVapiCall } from "@/lib/services/vapiService";
import { useInterviewStore } from "@/lib/store/zustand";
import { CallStatus } from "@/lib/types/customTypes";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FaMicrophoneAlt, FaPlay, FaSpinner, FaStop } from "react-icons/fa";
import { toast } from "sonner";

export default function InterviewPage() {
    const { id: interviewSessionId } = useParams();
    const router = useRouter();

    const [callStatus, setCallStatus] = useState<CallStatus>(
        CallStatus.INACTIVE
    );
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [lastMessage, setLastMessage] = useState("");

    const {
        currentInterview,
        currentQuestionIndex,
        setFeedback,
        rawMessages,
        addMessage,
        setStatus,
    } = useInterviewStore();

    const questions = useMemo(
        () => currentInterview?.questions || [],
        [currentInterview]
    );

    useVapiCall({
        onCallStart: () => setCallStatus(CallStatus.ACTIVE),
        onCallEnd: () => setCallStatus(CallStatus.FINISHED),
        onSpeechStart: () => setIsSpeaking(true),
        onSpeechEnd: () => setIsSpeaking(false),
        onFinalTranscript: (role, content) => {
            const newMessage = { role, content };
            addMessage(newMessage);
            setLastMessage(content);
        },
    });

    const handleStartCall = async () => {
        if (!questions.length) {
            toast.error(
                "No questions found. Please create/retake an interview."
            );
            router.push("/dashboard");
            return;
        }

        setCallStatus(CallStatus.CONNECTING);
        try {
            await startVapiCall(
                interviewer,
                questions.map((q) => q.text)
            );
        } catch (err) {
            toast.error("Failed to start Vapi call.");
            console.error(err);
            setCallStatus(CallStatus.INACTIVE);
        }
    };

    const handleEndCall = () => {
        stopVapiCall();
        setCallStatus(CallStatus.FINISHED);
        toast.info(
            "Interview has ended. You will be redirected to results page."
        );
    };

    useEffect(() => {
        if (callStatus !== CallStatus.FINISHED) return;

        const analyzeInterview = async () => {
            setStatus("analyzing");
            try {
                const res = await fetch(
                    `/api/interviews/${interviewSessionId}/analyze`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ transcript: rawMessages }),
                    }
                );

                if (!res.ok) throw new Error("Analysis failed");
                const { feedback } = await res.json();

                setFeedback(feedback);
                router.push(`/dashboard/results/${interviewSessionId}`);
            } catch (err) {
                toast.error("Failed to analyze answers");
                console.error(err);
            } finally {
                setStatus("completed");
            }
        };

        analyzeInterview();
    }, [callStatus]);

    if (!currentInterview) return <Loader />;

    return (
        <div className="container mx-auto py-8 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold">
                        {currentInterview.title}
                    </h1>
                    <p className="text-muted-foreground">
                        {currentInterview.position} • {currentInterview.type}{" "}
                        Interview
                    </p>
                </div>
                <Badge variant="outline" className="px-4 py-2">
                    Question {currentQuestionIndex + 1} of {questions.length}
                </Badge>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Interview Controls</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-4">
                        <Button
                            onClick={handleStartCall}
                            disabled={callStatus !== CallStatus.INACTIVE}
                            className="gap-2"
                        >
                            <FaPlay className="h-4 w-4" />
                            {callStatus === CallStatus.CONNECTING
                                ? "Connecting..."
                                : "Start Interview"}
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleEndCall}
                            disabled={callStatus !== CallStatus.ACTIVE}
                            className="gap-2"
                        >
                            <FaStop className="h-4 w-4" />
                            End Interview
                        </Button>
                    </div>
                </CardContent>
                <CardFooter className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div
                            className={`h-3 w-3 rounded-full ${
                                callStatus === CallStatus.ACTIVE
                                    ? "bg-green-500 animate-pulse"
                                    : callStatus === CallStatus.CONNECTING
                                      ? "bg-yellow-500"
                                      : "bg-gray-500"
                            }`}
                        />
                        <span className="text-sm">
                            {callStatus === CallStatus.ACTIVE
                                ? "Live"
                                : callStatus === CallStatus.CONNECTING
                                  ? "Connecting"
                                  : "Ready"}
                        </span>
                    </div>
                    {isSpeaking && (
                        <div className="flex items-center gap-2">
                            <FaSpinner className="h-4 w-4 animate-spin text-blue-500" />
                            <span className="text-sm text-blue-500">
                                AI is speaking
                            </span>
                        </div>
                    )}
                </CardFooter>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src="/ai-interviewer.png" />
                            <AvatarFallback>AI</AvatarFallback>
                        </Avatar>
                        <CardTitle>Current Question</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="min-h-[120px] p-4 rounded-lg bg-muted/50 border">
                            {lastMessage ? (
                                <p className="text-lg">{lastMessage}</p>
                            ) : (
                                <p className="text-muted-foreground italic">
                                    {callStatus === CallStatus.ACTIVE
                                        ? "Listening for question..."
                                        : "Question will appear here"}
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-pink-100 text-pink-600">
                                <FaMicrophoneAlt className="h-4 w-4" />
                            </AvatarFallback>
                        </Avatar>
                        <CardTitle>Conversation Transcript</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                            {rawMessages.length > 0 ? (
                                rawMessages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={`p-3 rounded-lg ${
                                            message.role === "assistant"
                                                ? "border border-blue-100"
                                                : "border"
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <span
                                                className={`font-medium ${
                                                    message.role === "assistant"
                                                        ? "text-blue-600"
                                                        : "text-pink-600"
                                                }`}
                                            >
                                                {message.role === "assistant"
                                                    ? "Interviewer"
                                                    : "You"}
                                            </span>
                                        </div>
                                        <p className="whitespace-pre-wrap">
                                            {message.content}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 text-center text-muted-foreground italic">
                                    Conversation transcript will appear here
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
