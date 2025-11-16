"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Star, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Problem, DIFFICULTY_COLORS } from "@/lib/constants/problems";
import { cn } from "@/lib/utils";

interface ProblemCardProps {
    problem: Problem;
    onBookmarkToggle: (id: string) => void;
}

export function ProblemCard({ problem, onBookmarkToggle }: ProblemCardProps) {
    const getStatusIcon = (status?: string) => {
        switch (status) {
            case "solved":
                return (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                );
            case "attempted":
                return <XCircle className="h-4 w-4 text-orange-500" />;
            case "todo":
                return <Clock className="h-4 w-4 text-gray-400" />;
            default:
                return null;
        }
    };

    return (
        <Card className="hover:shadow-lg transition-all cursor-pointer group">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                        {getStatusIcon(problem.status)}
                        <Link
                            href={`/problems/${problem.id}`}
                            className="font-semibold hover:text-primary transition-colors"
                        >
                            {problem.number}. {problem.title}
                        </Link>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                            e.stopPropagation();
                            onBookmarkToggle(problem.id);
                        }}
                    >
                        <Star
                            className={cn(
                                "h-4 w-4",
                                problem.isBookmarked
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-muted-foreground"
                            )}
                        />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                    <Badge
                        style={{
                            backgroundColor:
                                DIFFICULTY_COLORS[problem.difficulty] + "20",
                            color: DIFFICULTY_COLORS[problem.difficulty],
                            borderColor: DIFFICULTY_COLORS[problem.difficulty],
                        }}
                        variant="outline"
                    >
                        {problem.difficulty}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                        {problem.acceptanceRate.toFixed(1)}% acceptance
                    </span>
                </div>
                <div className="flex flex-wrap gap-1">
                    {problem.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                        </Badge>
                    ))}
                    {problem.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                            +{problem.tags.length - 3}
                        </Badge>
                    )}
                </div>
                {problem.companies.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {problem.companies.slice(0, 3).map((company) => (
                            <Badge
                                key={company}
                                variant="outline"
                                className="text-xs"
                            >
                                {company}
                            </Badge>
                        ))}
                        {problem.companies.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                                +{problem.companies.length - 3}
                            </Badge>
                        )}
                    </div>
                )}
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${problem.frequency}%` }}
                    />
                </div>
            </CardContent>
        </Card>
    );
}

