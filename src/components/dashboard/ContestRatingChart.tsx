"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

interface RatingData {
    date: string;
    rating: number;
    peakRating: number;
}

interface ContestRatingChartProps {
    data: RatingData[];
    currentRating: number;
    peakRating: number;
    globalRank: number;
}

export function ContestRatingChart({
    data,
    currentRating,
    peakRating,
    globalRank,
}: ContestRatingChartProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Contest Rating</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                        <p className="text-sm text-muted-foreground">
                            Current Rating
                        </p>
                        <p className="text-2xl font-bold">{currentRating}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">
                            Peak Rating
                        </p>
                        <p className="text-2xl font-bold">{peakRating}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">
                            Global Rank
                        </p>
                        <p className="text-2xl font-bold">#{globalRank}</p>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[1000, 3000]} />
                        <Tooltip />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="rating"
                            stroke="#667eea"
                            strokeWidth={2}
                            name="Rating"
                        />
                        <Line
                            type="monotone"
                            dataKey="peakRating"
                            stroke="#764ba2"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            name="Peak Rating"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

