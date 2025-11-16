import { SessionWithInterview } from "@/app/dashboard/page";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const InterviewCards = ({
    sessions,
    loading,
}: {
    sessions: SessionWithInterview[];
    loading: boolean;
}) => {
    return (
        <section>
            {loading ? (
                <Loader />
            ) : sessions.length === 0 ? (
                <p className="text-muted-foreground">
                    No interviews available.
                </p>
            ) : (
                <div className="space-y-4">
                    {sessions.map((s) => (
                        <Card key={s.id}>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    {s.interview.title}
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    {s.interview.numberOfQuestions} •{" "}
                                    {s.interview.type.charAt(0).toUpperCase() +
                                        s.interview.type.slice(1)}{" "}
                                    •{" "}
                                    {Array.isArray(s.interview.techStack)
                                        ? s.interview.techStack.join(", ")
                                        : "N/A"}
                                </p>
                            </CardHeader>
                            <CardContent className="flex justify-between items-center gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Score
                                    </p>
                                    <p className="font-medium">
                                        {s.score ? `${s.score}/100` : "N/A"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Date
                                    </p>
                                    <p className="font-medium">
                                        {new Date(s.startedAt).toDateString()}
                                    </p>
                                </div>
                                <Button variant="outline" asChild>
                                    <Link href={`/dashboard/results/${s.id}`}>
                                        View Results
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </section>
    );
};

export default InterviewCards;
