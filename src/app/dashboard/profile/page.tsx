"use client";

import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    MapPin,
    Briefcase,
    Calendar,
    Award,
    Edit,
    Save,
    X,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { SolveRateChart } from "@/components/dashboard/SolveRateChart";
import { SkillsRadarChart } from "@/components/dashboard/SkillsRadarChart";

export default function ProfilePage() {
    const { data: session } = useSession();
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        bio: "Passionate software engineer with 5+ years of experience in full-stack development.",
        location: "San Francisco, CA",
        title: "Senior Software Engineer",
        company: "Tech Corp",
        joinDate: new Date("2020-01-15"),
    });

    const stats = {
        solved: 245,
        attempted: 89,
        total: 1600,
        streak: 89,
        reputation: 1245,
        ranking: 1234,
    };

    const solveRateData = [
        { name: "Easy", value: 150, total: 450, color: "#00b8a3" },
        { name: "Medium", value: 80, total: 800, color: "#ffc01e" },
        { name: "Hard", value: 15, total: 350, color: "#ef4743" },
    ];

    const skillsData = [
        { topic: "Arrays", score: 85, fullMark: 100 },
        { topic: "DP", score: 70, fullMark: 100 },
        { topic: "Graphs", score: 60, fullMark: 100 },
        { topic: "Trees", score: 75, fullMark: 100 },
        { topic: "Strings", score: 80, fullMark: 100 },
        { topic: "Sorting", score: 90, fullMark: 100 },
        { topic: "Greedy", score: 65, fullMark: 100 },
        { topic: "Hash Tables", score: 88, fullMark: 100 },
    ];

    const achievements = [
        { name: "Century Club", description: "Solved 100 problems", earned: true },
        { name: "100 Day Streak", description: "Maintained 100 day streak", earned: true },
        { name: "Problem Master", description: "Solved 1000 problems", earned: false },
        { name: "Contest Winner", description: "Won a contest", earned: false },
    ];

    return (
        <div className="container mx-auto py-6 space-y-6">
            <Breadcrumb items={[{ label: "Profile" }]} />

            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Profile</h1>
                <Button
                    variant={isEditing ? "outline" : "default"}
                    onClick={() => setIsEditing(!isEditing)}
                >
                    {isEditing ? (
                        <>
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                        </>
                    ) : (
                        <>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Profile
                        </>
                    )}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Profile Info */}
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex flex-col items-center text-center space-y-4">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage
                                        src={session?.user?.image || undefined}
                                    />
                                    <AvatarFallback className="text-2xl">
                                        {session?.user?.name
                                            ?.charAt(0)
                                            .toUpperCase() || "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h2 className="text-2xl font-bold">
                                        {session?.user?.name || "User"}
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        {session?.user?.email}
                                    </p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {isEditing ? (
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="bio">Bio</Label>
                                        <Textarea
                                            id="bio"
                                            value={profile.bio}
                                            onChange={(e) =>
                                                setProfile({
                                                    ...profile,
                                                    bio: e.target.value,
                                                })
                                            }
                                            rows={4}
                                            maxLength={200}
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {profile.bio.length}/200 characters
                                        </p>
                                    </div>
                                    <div>
                                        <Label htmlFor="location">Location</Label>
                                        <Input
                                            id="location"
                                            value={profile.location}
                                            onChange={(e) =>
                                                setProfile({
                                                    ...profile,
                                                    location: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="title">Job Title</Label>
                                        <Input
                                            id="title"
                                            value={profile.title}
                                            onChange={(e) =>
                                                setProfile({
                                                    ...profile,
                                                    title: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="company">Company</Label>
                                        <Input
                                            id="company"
                                            value={profile.company}
                                            onChange={(e) =>
                                                setProfile({
                                                    ...profile,
                                                    company: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <Button
                                        className="w-full"
                                        onClick={() => setIsEditing(false)}
                                    >
                                        <Save className="h-4 w-4 mr-2" />
                                        Save Changes
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                                        <span>{profile.title}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <span>{profile.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span>
                                            Joined{" "}
                                            {profile.joinDate.toLocaleDateString(
                                                "en-US",
                                                {
                                                    month: "long",
                                                    year: "numeric",
                                                }
                                            )}
                                        </span>
                                    </div>
                                    <div className="pt-4 border-t">
                                        <p className="text-sm text-muted-foreground mb-2">
                                            {profile.bio}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Award className="h-5 w-5" />
                                Achievements
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {achievements.map((achievement) => (
                                <div
                                    key={achievement.name}
                                    className={`p-3 border rounded-lg ${
                                        achievement.earned
                                            ? "bg-muted"
                                            : "opacity-50"
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold">
                                                {achievement.name}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {achievement.description}
                                            </p>
                                        </div>
                                        {achievement.earned && (
                                            <Badge variant="default">Earned</Badge>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Stats and Charts */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card>
                            <CardContent className="p-4 text-center">
                                <p className="text-2xl font-bold text-green-600">
                                    {stats.solved}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Solved
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 text-center">
                                <p className="text-2xl font-bold text-orange-600">
                                    {stats.streak}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Day Streak
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 text-center">
                                <p className="text-2xl font-bold text-blue-600">
                                    {stats.reputation}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Reputation
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 text-center">
                                <p className="text-2xl font-bold text-purple-600">
                                    #{stats.ranking}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Global Rank
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <SolveRateChart data={solveRateData} />
                    <SkillsRadarChart data={skillsData} />
                </div>
            </div>
        </div>
    );
}

