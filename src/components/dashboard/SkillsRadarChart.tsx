"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
} from "recharts";

interface SkillsData {
    topic: string;
    score: number;
    fullMark: number;
}

interface SkillsRadarChartProps {
    data: SkillsData[];
}

export function SkillsRadarChart({ data }: SkillsRadarChartProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Skills Assessment</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={data}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="topic" />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} />
                        <Radar
                            name="Skills"
                            dataKey="score"
                            stroke="#667eea"
                            fill="#667eea"
                            fillOpacity={0.6}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

