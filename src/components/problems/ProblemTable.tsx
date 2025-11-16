"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Problem, DIFFICULTY_COLORS } from "@/lib/constants/problems";
import { cn } from "@/lib/utils";

interface ProblemTableProps {
    problems: Problem[];
    onBookmarkToggle: (id: string) => void;
}

export function ProblemTable({ problems, onBookmarkToggle }: ProblemTableProps) {
    const getStatusIcon = (status?: string) => {
        switch (status) {
            case "solved":
                return (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                );
            case "attempted":
                return <XCircle className="h-5 w-5 text-orange-500" />;
            case "todo":
                return <Clock className="h-5 w-5 text-gray-400" />;
            default:
                return null;
        }
    };

    return (
        <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-muted/50">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                Status
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                Title
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                Difficulty
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground hidden md:table-cell">
                                Acceptance
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground hidden lg:table-cell">
                                Frequency
                            </th>
                            <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {problems.map((problem, index) => (
                            <tr
                                key={problem.id}
                                className={cn(
                                    "border-t hover:bg-muted/30 transition-colors cursor-pointer",
                                    index % 2 === 0 && "bg-background"
                                )}
                                onClick={() =>
                                    (window.location.href = `/problems/${problem.id}`)
                                }
                            >
                                <td className="px-4 py-3">
                                    {getStatusIcon(problem.status)}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex flex-col gap-1">
                                        <Link
                                            href={`/problems/${problem.id}`}
                                            className="font-medium hover:text-primary transition-colors"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {problem.number}. {problem.title}
                                        </Link>
                                        <div className="flex flex-wrap gap-1">
                                            {problem.tags.slice(0, 3).map((tag) => (
                                                <Badge
                                                    key={tag}
                                                    variant="secondary"
                                                    className="text-xs"
                                                >
                                                    {tag}
                                                </Badge>
                                            ))}
                                            {problem.tags.length > 3 && (
                                                <Badge
                                                    variant="secondary"
                                                    className="text-xs"
                                                >
                                                    +{problem.tags.length - 3}
                                                </Badge>
                                            )}
                                        </div>
                                        {problem.companies.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {problem.companies
                                                    .slice(0, 3)
                                                    .map((company) => (
                                                        <Badge
                                                            key={company}
                                                            variant="outline"
                                                            className="text-xs"
                                                        >
                                                            {company}
                                                        </Badge>
                                                    ))}
                                                {problem.companies.length > 3 && (
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs"
                                                    >
                                                        +{problem.companies.length - 3}
                                                    </Badge>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <Badge
                                        style={{
                                            backgroundColor:
                                                DIFFICULTY_COLORS[
                                                    problem.difficulty
                                                ] + "20",
                                            color:
                                                DIFFICULTY_COLORS[
                                                    problem.difficulty
                                                ],
                                            borderColor:
                                                DIFFICULTY_COLORS[
                                                    problem.difficulty
                                                ],
                                        }}
                                        variant="outline"
                                    >
                                        {problem.difficulty}
                                    </Badge>
                                </td>
                                <td className="px-4 py-3 text-sm hidden md:table-cell">
                                    {problem.acceptanceRate.toFixed(1)}%
                                </td>
                                <td className="px-4 py-3 hidden lg:table-cell">
                                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary"
                                            style={{
                                                width: `${problem.frequency}%`,
                                            }}
                                        />
                                    </div>
                                </td>
                                <td className="px-4 py-3">
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
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

