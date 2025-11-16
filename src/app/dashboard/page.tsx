"use client";

import InterviewCards from "@/components/InterviewCards";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardStats } from "@/lib/constants";
import { useInterviewStore } from "@/lib/store/zustand";
import { Feedback, Interview as InterviewType } from "@/lib/types/customTypes";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export interface ScoreSummary {
    averageScore: number;
    completedCount: number;
}

export interface SessionWithInterview {
    id: string;
    interview: InterviewType;
    feedback?: Feedback;
    startedAt: string;
    completedAt?: string;
    score?: number;
}

export default function DashboardPage() {
    const { data: sessionData } = useSession();
    const { currentInterview, setCurrentInterview, resetInterview } =
        useInterviewStore();

    const [sessions, setSessions] = useState<SessionWithInterview[]>([]);
    const [stats, setStats] = useState<ScoreSummary | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch("/api/interviews?limit=3&summary=true");
                if (!res.ok) throw new Error("Fetch failed");
                const data: {
                    sessions: SessionWithInterview[];
                    summary: ScoreSummary;
                } = await res.json();

                setSessions(data.sessions);
                setStats(data.summary);

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
    }, []);

    const statCards = getDashboardStats(stats);

    return (
        <div className="container py-8">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">
                    Welcome back,{" "}
                    {sessionData?.user?.name?.split(" ")[0] || "User"}
                </h1>
                <Button asChild>
                    <Link href="/dashboard/interviews/new">New Interview</Link>
                </Button>
            </header>

            <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 mb-8">
                {statCards.map((stat, idx) => (
                    <Card key={idx}>
                        <CardHeader className="flex justify-between items-center">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold mb-1">
                                {stat.value}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </section>

            <h2 className="text-xl font-bold mb-3">Recent Interviews</h2>
            <InterviewCards sessions={sessions} loading={loading} />
        </div>
    );
}
