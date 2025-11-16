"use client";

import { useInterviewStore } from "@/lib/store/zustand";
import { Feedback, Interview } from "@/lib/types/customTypes";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import Loader from "@/components/Loader";
import { getResultScores } from "@/lib/constants";
import { ArrowLeft, Download, Share2 } from "lucide-react";
import {
    PolarAngleAxis,
    PolarGrid,
    PolarRadiusAxis,
    Radar,
    RadarChart,
    ResponsiveContainer,
    Tooltip,
} from "recharts";
import { toast } from "sonner";

export default function ResultsPage() {
    const { id: interviewSessionId } = useParams();
    const router = useRouter();
    const { currentInterview, setCurrentInterview, feedback, setFeedback } =
        useInterviewStore();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const res = await fetch(
                    `/api/interviews/${interviewSessionId}/results`
                );

                if (!res.ok) throw new Error("Failed to fetch results");

                const data: {
                    interview: Interview;
                    feedback: Feedback;
                } = await res.json();

                if (!data.feedback || !data.interview) {
                    toast.error("No feedback found for the given interview");
                    router.push("/dashboard");
                    return;
                }

                setCurrentInterview(data.interview);
                setFeedback(data.feedback);
                setLoading(false);
            } catch (err) {
                console.error(err);

                toast.error("Failed to fetch results for the given interview");
                router.push("/dashboard");
            }
        };

        fetchResults();
    }, [interviewSessionId, setCurrentInterview, setFeedback, router]);

    if (loading || !currentInterview || !feedback) return <Loader />;

    const scoreData = getResultScores(feedback);

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-6">
                <Button
                    variant="outline"
                    onClick={() => router.push("/dashboard")}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Button>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export Report
                    </Button>
                    <Button variant="outline">
                        <Share2 className="mr-2 h-4 w-4" />
                        Share
                    </Button>
                </div>
            </div>

            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">
                    {currentInterview.title} Results
                </h1>
                <p className="text-muted-foreground">
                    {new Date(currentInterview.createdAt).toDateString()}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Radar Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">
                            Performance Overview
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart
                                    data={scoreData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius="80%"
                                >
                                    <PolarGrid
                                        stroke="#ccc"
                                        strokeDasharray="4 4"
                                    />

                                    <PolarAngleAxis
                                        dataKey="subject"
                                        tick={{
                                            fill: "#333",
                                            fontSize: 12,
                                            fontWeight: 500,
                                        }}
                                        tickLine={false}
                                    />

                                    <PolarRadiusAxis
                                        angle={30}
                                        domain={[0, 100]}
                                        tick={{ fill: "#666", fontSize: 10 }}
                                        axisLine={false}
                                        tickCount={5}
                                    />

                                    <Radar
                                        name="Score"
                                        dataKey="score"
                                        stroke="#00C49F"
                                        fill="#00C49F"
                                        fillOpacity={0.4}
                                        strokeWidth={2}
                                        dot={{
                                            r: 3,
                                            stroke: "#fff",
                                            strokeWidth: 1,
                                        }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#00000070",
                                            borderColor: "#cccccc",
                                            borderRadius: "8px",
                                            fontSize: "14px",
                                            padding: "10px",
                                        }}
                                        labelStyle={{ display: "none" }}
                                        formatter={(value, name) => [
                                            `${value}%`,
                                            name,
                                        ]}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Key Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {scoreData.map((score) => (
                            <div
                                className="flex justify-between"
                                key={score.subject}
                            >
                                <span className="capitalize">
                                    {score.subject}
                                </span>
                                <Badge variant="outline">
                                    {score.score + "/" + 100}
                                </Badge>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {Array.isArray(feedback.suggestions) &&
                feedback.suggestions.filter((s) => s.trim()).length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Suggestions</h2>
                        <Card>
                            <CardContent>
                                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                                    {feedback.suggestions
                                        .filter((s) => s.trim())
                                        .map((sugg, i) => (
                                            <li key={i}>{sugg}</li>
                                        ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                )}
        </div>
    );
}
