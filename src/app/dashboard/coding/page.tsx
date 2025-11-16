"use client";

import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { SubmissionCalendar } from "@/components/dashboard/SubmissionCalendar";
import { SolveRateChart } from "@/components/dashboard/SolveRateChart";
import { SkillsRadarChart } from "@/components/dashboard/SkillsRadarChart";
import { ContestRatingChart } from "@/components/dashboard/ContestRatingChart";
import { RecentSubmissions } from "@/components/dashboard/RecentSubmissions";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Clock, TrendingUp, Award } from "lucide-react";
import { useState } from "react";

export default function CodingDashboardPage() {
    const [stats] = useState({
        solved: 245,
        attempted: 89,
        total: 1600,
        streak: 89,
        reputation: 1245,
        ranking: 1234,
    });

    const solveRateData = [
        { name: "Easy", value: 150, total: 450, color: "#00b8a3" },
        { name: "Medium", value: 80, total: 800, color: "#ffc01e" },
        { name: "Hard", value: 15, total: 350, color: "#ef4743" },
    ];

    const skillsData = [
        { topic: "Arrays", score: 85, fullMark: 100 },
        { topic: "DP", score: 70, fullMark: 100 },
        { topic: "Graphs", score: 60, fullMark: 100 },
        { topic: "Trees", score: 75, fullMark: 100 },
        { topic: "Strings", score: 80, fullMark: 100 },
        { topic: "Sorting", score: 90, fullMark: 100 },
        { topic: "Greedy", score: 65, fullMark: 100 },
        { topic: "Hash Tables", score: 88, fullMark: 100 },
    ];

    const ratingData = [
        { date: "2024-01", rating: 1200, peakRating: 1200 },
        { date: "2024-02", rating: 1350, peakRating: 1350 },
        { date: "2024-03", rating: 1280, peakRating: 1350 },
        { date: "2024-04", rating: 1420, peakRating: 1420 },
        { date: "2024-05", rating: 1500, peakRating: 1500 },
        { date: "2024-06", rating: 1480, peakRating: 1500 },
    ];

    const mockSubmissions = [
        {
            id: "1",
            problemTitle: "Two Sum",
            problemId: "1",
            language: "Python",
            status: "accepted" as const,
            submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
            runtime: 45,
            memory: 14.2,
        },
        {
            id: "2",
            problemTitle: "Reverse Linked List",
            problemId: "2",
            language: "JavaScript",
            status: "accepted" as const,
            submittedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
            runtime: 32,
            memory: 12.5,
        },
        {
            id: "3",
            problemTitle: "Merge Intervals",
            problemId: "3",
            language: "Java",
            status: "wrong-answer" as const,
            submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        },
    ];


    return (
        <div className="container mx-auto py-6 space-y-6">
            <Breadcrumb items={[{ label: "Coding Dashboard" }]} />

            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Coding Dashboard</h1>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Solved
                                </p>
                                <p className="text-2xl font-bold text-green-600">
                                    {stats.solved}
                                </p>
                            </div>
                            <CheckCircle2 className="h-8 w-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Streak
                                </p>
                                <p className="text-2xl font-bold text-orange-600">
                                    {stats.streak} days
                                </p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-orange-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Reputation
                                </p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {stats.reputation}
                                </p>
                            </div>
                            <Award className="h-8 w-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Global Rank
                                </p>
                                <p className="text-2xl font-bold text-purple-600">
                                    #{stats.ranking}
                                </p>
                            </div>
                            <Clock className="h-8 w-8 text-purple-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SolveRateChart data={solveRateData} />
                <SkillsRadarChart data={skillsData} />
            </div>

            {/* Calendar and Rating */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SubmissionCalendar data={[]} />
                <ContestRatingChart
                    data={ratingData}
                    currentRating={1480}
                    peakRating={1500}
                    globalRank={stats.ranking}
                />
            </div>

            {/* Recent Submissions */}
            <RecentSubmissions submissions={mockSubmissions} />
        </div>
    );
}

