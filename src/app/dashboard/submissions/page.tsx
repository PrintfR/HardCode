"use client";

import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, XCircle, Clock, AlertCircle, Search } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
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
    code?: string;
}

const mockSubmissions: Submission[] = [
    {
        id: "1",
        problemTitle: "Two Sum",
        problemId: "1",
        language: "Python",
        status: "accepted",
        submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        runtime: 45,
        memory: 14.2,
    },
    {
        id: "2",
        problemTitle: "Reverse Linked List",
        problemId: "2",
        language: "JavaScript",
        status: "accepted",
        submittedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
        runtime: 32,
        memory: 12.5,
    },
    {
        id: "3",
        problemTitle: "Merge Intervals",
        problemId: "3",
        language: "Java",
        status: "wrong-answer",
        submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
        id: "4",
        problemTitle: "Binary Search",
        problemId: "4",
        language: "C++",
        status: "runtime-error",
        submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
        id: "5",
        problemTitle: "Valid Parentheses",
        problemId: "5",
        language: "Python",
        status: "accepted",
        submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        runtime: 28,
        memory: 13.8,
    },
];

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

export default function SubmissionsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [languageFilter, setLanguageFilter] = useState<string>("all");

    const filteredSubmissions = mockSubmissions.filter((submission) => {
        const matchesSearch =
            submission.problemTitle
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            submission.language
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
        const matchesStatus =
            statusFilter === "all" || submission.status === statusFilter;
        const matchesLanguage =
            languageFilter === "all" || submission.language === languageFilter;

        return matchesSearch && matchesStatus && matchesLanguage;
    });

    const stats = {
        total: mockSubmissions.length,
        accepted: mockSubmissions.filter((s) => s.status === "accepted").length,
        failed:
            mockSubmissions.filter((s) => s.status !== "accepted").length,
    };

    return (
        <div className="container mx-auto py-6 space-y-6">
            <Breadcrumb items={[{ label: "Submissions" }]} />

            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">My Submissions</h1>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="text-2xl font-bold">{stats.total}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Accepted</p>
                        <p className="text-2xl font-bold text-green-600">
                            {stats.accepted}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Failed</p>
                        <p className="text-2xl font-bold text-red-600">
                            {stats.failed}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by problem or language..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="accepted">Accepted</SelectItem>
                        <SelectItem value="wrong-answer">Wrong Answer</SelectItem>
                        <SelectItem value="runtime-error">Runtime Error</SelectItem>
                        <SelectItem value="time-limit-exceeded">
                            Time Limit Exceeded
                        </SelectItem>
                    </SelectContent>
                </Select>
                <Select value={languageFilter} onValueChange={setLanguageFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Languages</SelectItem>
                        <SelectItem value="Python">Python</SelectItem>
                        <SelectItem value="JavaScript">JavaScript</SelectItem>
                        <SelectItem value="Java">Java</SelectItem>
                        <SelectItem value="C++">C++</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Submissions List */}
            <div className="space-y-4">
                {filteredSubmissions.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        No submissions found.
                    </div>
                ) : (
                    filteredSubmissions.map((submission) => {
                        const Icon = statusIcons[submission.status];
                        return (
                            <Card
                                key={submission.id}
                                className="hover:shadow-md transition-shadow"
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4 flex-1">
                                            <Icon
                                                className={cn(
                                                    "h-5 w-5",
                                                    statusColors[submission.status]
                                                )}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <Link
                                                    href={`/problems/${submission.problemId}`}
                                                    className="font-semibold hover:text-primary transition-colors block"
                                                >
                                                    {submission.problemTitle}
                                                </Link>
                                                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                                                    <Badge variant="outline">
                                                        {submission.language}
                                                    </Badge>
                                                    <span>
                                                        {formatDistanceToNow(
                                                            submission.submittedAt,
                                                            { addSuffix: true }
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
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            asChild
                                        >
                                            <Link
                                                href={`/problems/${submission.problemId}?submission=${submission.id}`}
                                            >
                                                View
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })
                )}
            </div>
        </div>
    );
}

