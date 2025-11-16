"use client";

import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, Trophy, Play } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Contest {
    id: string;
    title: string;
    description: string;
    startTime: Date;
    endTime: Date;
    duration: number; // in minutes
    participants: number;
    status: "upcoming" | "ongoing" | "ended";
    difficulty: "Easy" | "Medium" | "Hard";
    prizes?: string[];
}

const mockContests: Contest[] = [
    {
        id: "1",
        title: "Weekly Contest 350",
        description: "Solve 4 problems in 90 minutes",
        startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000),
        duration: 90,
        participants: 1234,
        status: "upcoming",
        difficulty: "Medium",
        prizes: ["$100", "$50", "$25"],
    },
    {
        id: "2",
        title: "Biweekly Contest 105",
        description: "Solve 4 problems in 90 minutes",
        startTime: new Date(Date.now() - 60 * 60 * 1000),
        endTime: new Date(Date.now() + 30 * 60 * 1000),
        duration: 90,
        participants: 2345,
        status: "ongoing",
        difficulty: "Hard",
    },
    {
        id: "3",
        title: "Weekly Contest 349",
        description: "Solve 4 problems in 90 minutes",
        startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        endTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000),
        duration: 90,
        participants: 3456,
        status: "ended",
        difficulty: "Easy",
    },
];

export default function ContestsPage() {
    const getStatusBadge = (status: Contest["status"]) => {
        const variants = {
            upcoming: "default",
            ongoing: "destructive",
            ended: "secondary",
        } as const;

        const labels = {
            upcoming: "Upcoming",
            ongoing: "Ongoing",
            ended: "Ended",
        };

        return (
            <Badge variant={variants[status]}>
                {labels[status]}
            </Badge>
        );
    };

    const getDifficultyColor = (difficulty: Contest["difficulty"]) => {
        const colors = {
            Easy: "text-green-600",
            Medium: "text-yellow-600",
            Hard: "text-red-600",
        };
        return colors[difficulty];
    };

    return (
        <div className="container mx-auto py-6 space-y-6">
            <Breadcrumb items={[{ label: "Contests" }]} />

            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Contests</h1>
                <Button asChild>
                    <Link href="/contests/new">Create Contest</Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockContests.map((contest) => (
                    <Card
                        key={contest.id}
                        className={cn(
                            "hover:shadow-lg transition-all",
                            contest.status === "ongoing" && "ring-2 ring-primary"
                        )}
                    >
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <CardTitle className="text-xl">
                                    {contest.title}
                                </CardTitle>
                                {getStatusBadge(contest.status)}
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">
                                {contest.description}
                            </p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span>
                                        {format(contest.startTime, "MMM dd, yyyy HH:mm")}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span>{contest.duration} minutes</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                    <span>{contest.participants.toLocaleString()} participants</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Trophy className="h-4 w-4 text-muted-foreground" />
                                    <span className={getDifficultyColor(contest.difficulty)}>
                                        {contest.difficulty}
                                    </span>
                                </div>
                            </div>

                            {contest.prizes && (
                                <div className="pt-2 border-t">
                                    <p className="text-sm font-semibold mb-1">Prizes:</p>
                                    <div className="flex gap-2">
                                        {contest.prizes.map((prize, index) => (
                                            <Badge key={index} variant="outline">
                                                {prize}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-2 pt-2">
                                {contest.status === "ongoing" && (
                                    <Button asChild className="flex-1">
                                        <Link href={`/contests/${contest.id}`}>
                                            <Play className="h-4 w-4 mr-2" />
                                            Join Now
                                        </Link>
                                    </Button>
                                )}
                                {contest.status === "upcoming" && (
                                    <Button asChild variant="outline" className="flex-1">
                                        <Link href={`/contests/${contest.id}`}>
                                            View Details
                                        </Link>
                                    </Button>
                                )}
                                {contest.status === "ended" && (
                                    <Button asChild variant="outline" className="flex-1">
                                        <Link href={`/contests/${contest.id}/results`}>
                                            View Results
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {mockContests.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    No contests available at the moment.
                </div>
            )}
        </div>
    );
}

