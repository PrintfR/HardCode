"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Clock, TrendingUp } from "lucide-react";

interface ProgressStatsProps {
    solved: number;
    attempted: number;
    total: number;
}

export function ProgressStats({ solved, attempted, total }: ProgressStatsProps) {
    const completionRate = total > 0 ? (solved / total) * 100 : 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Solved
                            </p>
                            <p className="text-2xl font-bold text-green-600">
                                {solved}
                            </p>
                        </div>
                        <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                            className="h-full bg-green-600 transition-all"
                            style={{
                                width: `${(solved / total) * 100}%`,
                            }}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Attempted
                            </p>
                            <p className="text-2xl font-bold text-orange-600">
                                {attempted}
                            </p>
                        </div>
                        <Clock className="h-8 w-8 text-orange-600" />
                    </div>
                    <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                            className="h-full bg-orange-600 transition-all"
                            style={{
                                width: `${(attempted / total) * 100}%`,
                            }}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Completion Rate
                            </p>
                            <p className="text-2xl font-bold text-blue-600">
                                {completionRate.toFixed(1)}%
                            </p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-600 transition-all"
                            style={{
                                width: `${completionRate}%`,
                            }}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

