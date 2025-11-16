"use client";

import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useInterviewStore } from "@/lib/store/zustand";
import { Interview } from "@/lib/types/customTypes";
import { redirect, useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function PreviewPage() {
    const router = useRouter();
    const { id: interviewId } = useParams();
    const { setCurrentInterview, setStatus, currentInterview } =
        useInterviewStore();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadInterview = async () => {
            setLoading(true);
            try {
                const res = await fetch(
                    `/api/interviews/${interviewId}/preview`
                );
                if (!res.ok) throw new Error("Failed to fetch interview");

                const data: {
                    interview: Interview;
                } = await res.json();
                setCurrentInterview(data.interview);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load interview preview");
                redirect("/dashboard/discover");
            } finally {
                setLoading(false);
            }
        };

        loadInterview();
    }, [interviewId]);

    const handleStartAttempt = async () => {
        try {
            const res = await fetch(`/api/interviews/${interviewId}/start`, {
                method: "POST",
            });

            if (!res.ok) throw new Error("Failed to start interview attempt");
            const data = await res.json();

            toast.success("Interview loaded successfully");
            setCurrentInterview(data.session.interview);
            setStatus("simulating");

            router.push(`/dashboard/active/${data.session.id}`);
        } catch (err) {
            console.error(err);
            toast.error("Could not start interview");
        }
    };

    if (loading) return <Loader />;

    if (!currentInterview)
        return (
            <div className="text-center py-20 text-red-500">
                Interview not found
            </div>
        );

    return (
        <div className="container py-10 max-w-8xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">
                        {currentInterview.title}
                    </CardTitle>
                    <p className="text-muted-foreground text-sm mt-1">
                        {currentInterview.numberOfQuestions} •{" "}
                        {currentInterview.type.charAt(0).toUpperCase() +
                            currentInterview.type.slice(1)}{" "}
                        •{" "}
                        {Array.isArray(currentInterview.techStack)
                            ? currentInterview.techStack.join(", ")
                            : "N/A"}
                    </p>
                </CardHeader>

                <CardContent className="space-y-4">
                    <h2 className="text-lg font-semibold">Preview Questions</h2>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                        {currentInterview.questions
                            .slice(0, 3)
                            .map((q, idx) => (
                                <li key={q.id}>
                                    <span className="font-medium">
                                        Q{idx + 1}:
                                    </span>{" "}
                                    {q.text}
                                </li>
                            ))}
                    </ul>

                    <div className="mt-6 flex justify-end">
                        <Button onClick={handleStartAttempt}>
                            Start Attempt
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
