"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Eye, Copy, Check } from "lucide-react";
import { useState } from "react";
import { DIFFICULTY_COLORS } from "@/lib/constants/problems";

interface ProblemDescriptionProps {
    problem: {
        id: string;
        number: number;
        title: string;
        difficulty: "Easy" | "Medium" | "Hard";
        likes: number;
        dislikes: number;
        views: number;
        description: string;
        examples: Array<{
            input: string;
            output: string;
            explanation?: string;
        }>;
        constraints: string[];
        companies: string[];
        tags: string[];
    };
}

export function ProblemDescription({ problem }: ProblemDescriptionProps) {
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const handleCopy = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <div className="h-full overflow-y-auto p-4 space-y-4">
            {/* Header */}
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold">
                        {problem.number}. {problem.title}
                    </h1>
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
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{problem.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <ThumbsDown className="h-4 w-4" />
                        <span>{problem.dislikes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{problem.views} views</span>
                    </div>
                </div>
            </div>

            {/* Description */}
            <Card>
                <CardHeader>
                    <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                    <div
                        className="prose prose-sm dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: problem.description }}
                    />
                </CardContent>
            </Card>

            {/* Examples */}
            <Card>
                <CardHeader>
                    <CardTitle>Examples</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {problem.examples.map((example, index) => (
                        <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <p className="font-semibold">Example {index + 1}</p>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                        handleCopy(
                                            `Input: ${example.input}\nOutput: ${example.output}`,
                                            index
                                        )
                                    }
                                >
                                    {copiedIndex === index ? (
                                        <Check className="h-4 w-4" />
                                    ) : (
                                        <Copy className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                            <div className="bg-muted p-3 rounded-md space-y-2">
                                <div>
                                    <span className="font-semibold">Input: </span>
                                    <code className="text-sm bg-background px-2 py-1 rounded">
                                        {example.input}
                                    </code>
                                </div>
                                <div>
                                    <span className="font-semibold">Output: </span>
                                    <code className="text-sm bg-background px-2 py-1 rounded">
                                        {example.output}
                                    </code>
                                </div>
                                {example.explanation && (
                                    <div>
                                        <span className="font-semibold">Explanation: </span>
                                        <p className="text-sm mt-1">
                                            {example.explanation}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Constraints */}
            <Card>
                <CardHeader>
                    <CardTitle>Constraints</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                        {problem.constraints.map((constraint, index) => (
                            <li key={index}>{constraint}</li>
                        ))}
                    </ul>
                </CardContent>
            </Card>

            {/* Companies */}
            {problem.companies.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Companies</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {problem.companies.map((company) => (
                                <Badge key={company} variant="outline">
                                    {company}
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Tags */}
            <Card>
                <CardHeader>
                    <CardTitle>Related Topics</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {problem.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

