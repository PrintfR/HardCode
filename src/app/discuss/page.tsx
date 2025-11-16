"use client";

import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    MessageSquare,
    ThumbsUp,
    Clock,
    TrendingUp,
    Search,
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";

interface Discussion {
    id: string;
    title: string;
    content: string;
    author: {
        name: string;
        avatar?: string;
        reputation: number;
    };
    problemId?: string;
    problemTitle?: string;
    upvotes: number;
    replies: number;
    views: number;
    createdAt: Date;
    tags: string[];
    isPinned?: boolean;
}

const mockDiscussions: Discussion[] = [
    {
        id: "1",
        title: "Best approach for Two Sum problem?",
        content: "I've been trying to solve this problem but can't figure out the optimal solution. Any hints?",
        author: {
            name: "John Doe",
            reputation: 1245,
        },
        problemId: "1",
        problemTitle: "Two Sum",
        upvotes: 23,
        replies: 5,
        views: 156,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        tags: ["Array", "Hash Table"],
        isPinned: true,
    },
    {
        id: "2",
        title: "Time complexity analysis for Merge Intervals",
        content: "Can someone explain the time complexity of the optimal solution?",
        author: {
            name: "Jane Smith",
            reputation: 2341,
        },
        problemId: "3",
        problemTitle: "Merge Intervals",
        upvotes: 45,
        replies: 12,
        views: 289,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
        tags: ["Array", "Sorting"],
    },
    {
        id: "3",
        title: "General discussion: How to prepare for coding interviews",
        content: "Share your tips and strategies for acing coding interviews!",
        author: {
            name: "Alice Johnson",
            reputation: 3456,
        },
        upvotes: 67,
        replies: 34,
        views: 567,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        tags: ["Interview", "Tips"],
        isPinned: true,
    },
];

export default function DiscussPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("recent");

    const filteredDiscussions = mockDiscussions.filter((discussion) =>
        discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        discussion.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedDiscussions = [...filteredDiscussions].sort((a, b) => {
        switch (sortBy) {
            case "recent":
                return b.createdAt.getTime() - a.createdAt.getTime();
            case "popular":
                return b.upvotes - a.upvotes;
            case "trending":
                return b.views - a.views;
            default:
                return 0;
        }
    });

    const pinnedDiscussions = sortedDiscussions.filter((d) => d.isPinned);
    const regularDiscussions = sortedDiscussions.filter((d) => !d.isPinned);

    return (
        <div className="container mx-auto py-6 space-y-6">
            <Breadcrumb items={[{ label: "Discuss" }]} />

            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Discussion Forum</h1>
                <Button asChild>
                    <Link href="/discuss/new">New Post</Link>
                </Button>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search discussions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="recent">Most Recent</SelectItem>
                        <SelectItem value="popular">Most Popular</SelectItem>
                        <SelectItem value="trending">Trending</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="all" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="problems">Problem Discussions</TabsTrigger>
                    <TabsTrigger value="general">General</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                    {/* Pinned Discussions */}
                    {pinnedDiscussions.length > 0 && (
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                Pinned
                            </h2>
                            {pinnedDiscussions.map((discussion) => (
                                <DiscussionCard
                                    key={discussion.id}
                                    discussion={discussion}
                                />
                            ))}
                        </div>
                    )}

                    {/* Regular Discussions */}
                    <div className="space-y-4">
                        {pinnedDiscussions.length > 0 && (
                            <h2 className="text-lg font-semibold">Recent</h2>
                        )}
                        {regularDiscussions.map((discussion) => (
                            <DiscussionCard
                                key={discussion.id}
                                discussion={discussion}
                            />
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="problems" className="space-y-4">
                    {sortedDiscussions
                        .filter((d) => d.problemId)
                        .map((discussion) => (
                            <DiscussionCard
                                key={discussion.id}
                                discussion={discussion}
                            />
                        ))}
                </TabsContent>

                <TabsContent value="general" className="space-y-4">
                    {sortedDiscussions
                        .filter((d) => !d.problemId)
                        .map((discussion) => (
                            <DiscussionCard
                                key={discussion.id}
                                discussion={discussion}
                            />
                        ))}
                </TabsContent>
            </Tabs>

            {sortedDiscussions.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    No discussions found. Be the first to start a discussion!
                </div>
            )}
        </div>
    );
}

function DiscussionCard({ discussion }: { discussion: Discussion }) {
    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            {discussion.isPinned && (
                                <Badge variant="default">Pinned</Badge>
                            )}
                            {discussion.problemId && (
                                <Link
                                    href={`/problems/${discussion.problemId}`}
                                    className="text-sm text-primary hover:underline"
                                >
                                    {discussion.problemTitle}
                                </Link>
                            )}
                        </div>
                        <Link href={`/discuss/${discussion.id}`}>
                            <CardTitle className="text-lg hover:text-primary transition-colors">
                                {discussion.title}
                            </CardTitle>
                        </Link>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {discussion.content}
                </p>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                                <AvatarImage
                                    src={discussion.author.avatar}
                                />
                                <AvatarFallback>
                                    {discussion.author.name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="text-sm">
                                <p className="font-medium">
                                    {discussion.author.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {discussion.author.reputation} reputation
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {formatDistanceToNow(discussion.createdAt, {
                                addSuffix: true,
                            })}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-sm">
                            <ThumbsUp className="h-4 w-4" />
                            {discussion.upvotes}
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                            <MessageSquare className="h-4 w-4" />
                            {discussion.replies}
                        </div>
                        <div className="text-sm text-muted-foreground">
                            {discussion.views} views
                        </div>
                    </div>
                </div>

                {discussion.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                        {discussion.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

