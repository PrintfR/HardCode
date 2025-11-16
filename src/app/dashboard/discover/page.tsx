"use client";

import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Interview, PaginatedResponse } from "@/lib/types/customTypes";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function DiscoverPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const page = parseInt(searchParams.get("page") || "1");

    const [interviews, setInterviews] = useState<Interview[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInterviews = async () => {
            setLoading(true);
            try {
                const res = await fetch(
                    `/api/interviews/discover?page=${page}`
                );
                if (!res.ok) throw new Error("Failed to fetch");

                const data: PaginatedResponse = await res.json();
                setInterviews(data.data);
                setTotalPages(data.totalPages);
            } catch (err) {
                console.error(err);
                toast.error("Couldn't load interviews");
            } finally {
                setLoading(false);
            }
        };

        fetchInterviews();
    }, [page]);

    const changePage = (newPage: number) =>
        router.push(`/dashboard/discover?page=${newPage}`);

    return (
        <div className="container py-8">
            <h1 className="text-3xl font-bold mb-4">Discover Interviews</h1>

            {loading ? (
                <Loader />
            ) : interviews.length === 0 ? (
                <p className="text-muted-foreground">
                    No interviews available yet.
                </p>
            ) : (
                <div className="grid gap-6">
                    {interviews.map((interview) => (
                        <Card key={interview.id}>
                            <CardHeader>
                                <CardTitle>{interview.title}</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    {interview.position} •{" "}
                                    {interview.difficulty} •
                                    {interview.numberOfQuestions} •{" "}
                                    {interview.type.charAt(0).toUpperCase() +
                                        interview.type.slice(1)}{" "}
                                </p>
                            </CardHeader>
                            <CardContent className="flex justify-between items-center">
                                <div className="text-sm text-muted-foreground">
                                    Stack:{" "}
                                    {Array.isArray(interview.techStack)
                                        ? interview.techStack.join(", ")
                                        : "N/A"}
                                </div>
                                <Button variant="default" asChild>
                                    <Link
                                        href={`/dashboard/discover/${interview.id}`}
                                    >
                                        Attempt
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {totalPages >= 1 && (
                <div className="flex justify-center mt-8 gap-2">
                    <Button
                        variant="outline"
                        onClick={() => changePage(page - 1)}
                        disabled={page <= 1}
                    >
                        Previous
                    </Button>
                    <p className="text-sm text-muted-foreground mt-2">
                        Page {page} of {totalPages}
                    </p>
                    <Button
                        variant="outline"
                        onClick={() => changePage(page + 1)}
                        disabled={page >= totalPages}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
}
