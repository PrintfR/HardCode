"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface SolveRateData {
    name: string;
    value: number;
    total: number;
    color: string;
}

interface SolveRateChartProps {
    data: SolveRateData[];
}

const COLORS = {
    Easy: "#00b8a3",
    Medium: "#ffc01e",
    Hard: "#ef4743",
};

export function SolveRateChart({ data }: SolveRateChartProps) {
    const chartData = data.map((item) => ({
        name: item.name,
        value: item.value,
        total: item.total,
        percentage: ((item.value / item.total) * 100).toFixed(1),
    }));

    const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { name: string; value: number; total: number; percentage: string } }> }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-background border rounded-lg p-3 shadow-lg">
                    <p className="font-semibold">{data.name}</p>
                    <p className="text-sm">
                        Solved: {data.value} / {data.total}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {data.percentage}% completion
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Solve Rate by Difficulty</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percentage }) =>
                                `${name}: ${percentage}%`
                            }
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[entry.name as keyof typeof COLORS]}
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

