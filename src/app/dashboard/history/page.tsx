"use client";

import InterviewCards from "@/components/InterviewCards";
import { useInterviewStore } from "@/lib/store/zustand";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SessionWithInterview } from "@/app/dashboard/page";

export default function InterviewPage() {
    const { currentInterview, setCurrentInterview, resetInterview } =
        useInterviewStore();

    const [sessions, setSessions] = useState<SessionWithInterview[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch("/api/interviews");
                if (!res.ok) throw new Error("Fetch failed");
                const data: { sessions: SessionWithInterview[] } =
                    await res.json();

                setSessions(data.sessions);
                const inProgress = data.sessions.find((s) => !s.completedAt);
                if (!currentInterview && inProgress)
                    setCurrentInterview(inProgress.interview);

                if (
                    currentInterview &&
                    !data.sessions.some((s) => s.id === currentInterview.id)
                )
                    resetInterview();
            } catch (e) {
                console.error(e);
                toast.error("Failed to load interviews");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [currentInterview, resetInterview, setCurrentInterview]);

    return (
        <div className="container py-8 space-y-4">
            <h1 className="text-3xl font-bold">All interviews</h1>
            <InterviewCards sessions={sessions} loading={loading} />
        </div>
    );
}
