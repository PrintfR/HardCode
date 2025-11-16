"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface Submission {
    id: string;
    problemTitle: string;
    problemId: string;
    language: string;
    status: "accepted" | "wrong-answer" | "runtime-error" | "time-limit-exceeded";
    submittedAt: Date;
    runtime?: number;
    memory?: number;
}

interface RecentSubmissionsProps {
    submissions: Submission[];
}

const statusIcons = {
    accepted: CheckCircle2,
    "wrong-answer": XCircle,
    "runtime-error": AlertCircle,
    "time-limit-exceeded": Clock,
};

const statusColors = {
    accepted: "text-green-600",
    "wrong-answer": "text-red-600",
    "runtime-error": "text-orange-600",
    "time-limit-exceeded": "text-yellow-600",
};

export function RecentSubmissions({ submissions }: RecentSubmissionsProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Submissions</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {submissions.length === 0 ? (
                        <div className="text-center text-muted-foreground py-8">
                            No submissions yet
                        </div>
                    ) : (
                        submissions.map((submission) => {
                            const Icon =
                                statusIcons[submission.status];
                            return (
                                <div
                                    key={submission.id}
                                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-center gap-3 flex-1">
                                        <Icon
                                            className={cn(
                                                "h-5 w-5",
                                                statusColors[submission.status]
                                            )}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <Link
                                                href={`/problems/${submission.problemId}`}
                                                className="font-medium hover:text-primary transition-colors block truncate"
                                            >
                                                {submission.problemTitle}
                                            </Link>
                                            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                                <Badge variant="outline" className="text-xs">
                                                    {submission.language}
                                                </Badge>
                                                <span>
                                                    {formatDistanceToNow(
                                                        submission.submittedAt,
                                                        {
                                                            addSuffix: true,
                                                        }
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {submission.status === "accepted" &&
                                        submission.runtime && (
                                            <div className="text-right text-sm">
                                                <div className="text-muted-foreground">
                                                    {submission.runtime}ms
                                                </div>
                                                {submission.memory && (
                                                    <div className="text-muted-foreground">
                                                        {submission.memory}MB
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                </div>
                            );
                        })
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

