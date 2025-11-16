"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { format, subDays } from "date-fns";

interface SubmissionData {
    date: string;
    count: number;
}

interface SubmissionCalendarProps {
    data: SubmissionData[];
}

export function SubmissionCalendar({ data }: SubmissionCalendarProps) {
    const endDate = new Date();
    const startDate = subDays(endDate, 365);

    const getClassForValue = (value: { date?: string; count?: number } | null | undefined) => {
        if (!value || !value.count || value.count === 0) return "color-empty";
        if (value.count <= 2) return "color-scale-1";
        if (value.count <= 5) return "color-scale-2";
        if (value.count <= 10) return "color-scale-3";
        return "color-scale-4";
    };

    // Generate mock data for the past year
    const generateMockData = () => {
        const mockData: SubmissionData[] = [];
        for (let i = 0; i < 365; i++) {
            const date = subDays(endDate, i);
            const count = Math.random() > 0.7 ? Math.floor(Math.random() * 15) : 0;
            if (count > 0) {
                mockData.push({
                    date: format(date, "yyyy-MM-dd"),
                    count,
                });
            }
        }
        return mockData;
    };

    const calendarData = data.length > 0 ? data : generateMockData();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Submission Activity</CardTitle>
            </CardHeader>
            <CardContent>
                <TooltipProvider>
                    <CalendarHeatmap
                        startDate={startDate}
                        endDate={endDate}
                        values={calendarData.map((d) => ({
                            date: d.date,
                            count: d.count,
                        }))}
                        classForValue={getClassForValue}
                        tooltipDataAttrs={(value: { date?: string; count?: number } | null | undefined) => {
                            if (!value || !value.date) {
                                return {} as Record<string, string>;
                            }
                            return {
                                "data-tip": `${value.date}: ${value.count || 0} submissions`,
                            } as Record<string, string>;
                        }}
                        showWeekdayLabels
                    />
                </TooltipProvider>
                <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                    <span>Less</span>
                    <div className="flex gap-1">
                        <div className="w-3 h-3 bg-[#ebedf0] rounded" />
                        <div className="w-3 h-3 bg-[#c6e48b] rounded" />
                        <div className="w-3 h-3 bg-[#7bc96f] rounded" />
                        <div className="w-3 h-3 bg-[#239a3b] rounded" />
                    </div>
                    <span>More</span>
                </div>
            </CardContent>
        </Card>
    );
}

