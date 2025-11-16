"use client";

import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Code,
    Video,
    TrendingUp,
    BookOpen,
    Target,
} from "lucide-react";
import Link from "next/link";

export default function InterviewPage() {
    return (
        <div className="container mx-auto py-6 space-y-6">
            <Breadcrumb items={[{ label: "Interview" }]} />

            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Interview Preparation</h1>
            </div>

            <Tabs defaultValue="coding" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="coding">Coding Practice</TabsTrigger>
                    <TabsTrigger value="behavioral">Behavioral</TabsTrigger>
                    <TabsTrigger value="system-design">System Design</TabsTrigger>
                </TabsList>

                <TabsContent value="coding" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-primary/10 rounded-lg">
                                        <Code className="h-6 w-6 text-primary" />
                                    </div>
                                    <CardTitle>Practice Problems</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Solve coding problems similar to those asked in
                                    technical interviews.
                                </p>
                                <Button asChild className="w-full">
                                    <Link href="/problems">Start Practicing</Link>
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-primary/10 rounded-lg">
                                        <Video className="h-6 w-6 text-primary" />
                                    </div>
                                    <CardTitle>Mock Interviews</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Practice with AI-powered mock interviews to get
                                    realistic experience.
                                </p>
                                <Button asChild variant="outline" className="w-full">
                                    <Link href="/dashboard/interviews/new">
                                        Start Mock Interview
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-primary/10 rounded-lg">
                                        <Target className="h-6 w-6 text-primary" />
                                    </div>
                                    <CardTitle>Company-Specific</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Practice problems frequently asked by top tech
                                    companies.
                                </p>
                                <Button asChild variant="outline" className="w-full">
                                    <Link href="/problems?filter=company">
                                        Browse by Company
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                Popular Interview Topics
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    "Arrays",
                                    "Strings",
                                    "Dynamic Programming",
                                    "Trees",
                                    "Graphs",
                                    "Hash Tables",
                                    "Sorting",
                                    "Binary Search",
                                ].map((topic) => (
                                    <Button
                                        key={topic}
                                        variant="outline"
                                        asChild
                                        className="justify-start"
                                    >
                                        <Link href={`/problems?tag=${topic}`}>
                                            {topic}
                                        </Link>
                                    </Button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="behavioral" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-primary/10 rounded-lg">
                                    <BookOpen className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <CardTitle>Behavioral Interview Prep</CardTitle>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Prepare for behavioral and situational interview
                                        questions
                                    </p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <h3 className="font-semibold">
                                    Common Behavioral Questions
                                </h3>
                                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                    <li>Tell me about yourself</li>
                                    <li>Why do you want to work here?</li>
                                    <li>Describe a challenging project</li>
                                    <li>How do you handle conflict?</li>
                                    <li>Where do you see yourself in 5 years?</li>
                                </ul>
                            </div>
                            <Button asChild>
                                <Link href="/dashboard/interviews/new?type=behavioral">
                                    Practice Behavioral Interview
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="system-design" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-primary/10 rounded-lg">
                                    <Code className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <CardTitle>System Design Interview Prep</CardTitle>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Learn to design scalable systems for technical
                                        interviews
                                    </p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <h3 className="font-semibold">System Design Topics</h3>
                                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                    <li>Design a URL shortener</li>
                                    <li>Design a chat system</li>
                                    <li>Design a social media feed</li>
                                    <li>Design a search engine</li>
                                    <li>Design a distributed cache</li>
                                </ul>
                            </div>
                            <Button asChild variant="outline">
                                <Link href="/discuss?tag=system-design">
                                    Browse System Design Discussions
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

