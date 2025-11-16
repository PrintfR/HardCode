"use client";

import { useState, useMemo, useEffect } from "react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { FilterSidebar } from "@/components/problems/FilterSidebar";
import { ProblemTable } from "@/components/problems/ProblemTable";
import { ProblemCard } from "@/components/problems/ProblemCard";
import { ProgressStats } from "@/components/problems/ProgressStats";
import { Pagination } from "@/components/problems/Pagination";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { List, Grid, Filter } from "lucide-react";
import { useFilters } from "@/context/FilterContext";
import { useNotifications } from "@/context/NotificationContext";
import {
    Problem,
    generateMockProblems,
    SortOption,
} from "@/lib/constants/problems";

type ViewMode = "list" | "grid";

const ITEMS_PER_PAGE = 20;

export default function ProblemsPage() {
    const { filters, sortBy, setSortBy } = useFilters();
    const { addNotification } = useNotifications();
    const [problems, setProblems] = useState<Problem[]>([]);
    const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
    const [currentPage, setCurrentPage] = useState(1);
    const [viewMode, setViewMode] = useState<ViewMode>(() => {
        if (typeof window !== "undefined") {
            return (localStorage.getItem("problems-view-mode") as ViewMode) || "list";
        }
        return "list";
    });
    const [showFilters, setShowFilters] = useState(true);

    // Load mock problems
    useEffect(() => {
        const mockProblems = generateMockProblems(200);
        setProblems(mockProblems);
        
        // Load bookmarks from localStorage
        const savedBookmarks = localStorage.getItem("problem-bookmarks");
        if (savedBookmarks) {
            setBookmarkedIds(new Set(JSON.parse(savedBookmarks)));
        }
    }, []);

    // Filter and sort problems
    const filteredAndSortedProblems = useMemo(() => {
        let result = [...problems];

        // Apply filters
        if (filters.difficulties.length > 0) {
            result = result.filter((p) =>
                filters.difficulties.includes(p.difficulty)
            );
        }

        if (filters.statuses.length > 0) {
            result = result.filter((p) =>
                filters.statuses.includes(p.status!)
            );
        }

        if (filters.tags.length > 0) {
            result = result.filter((p) =>
                filters.tags.some((tag) => p.tags.includes(tag))
            );
        }

        if (filters.companies.length > 0) {
            result = result.filter((p) =>
                filters.companies.some((company) =>
                    p.companies.includes(company)
                )
            );
        }

        // Apply sorting
        switch (sortBy) {
            case "acceptance":
                result.sort((a, b) => b.acceptanceRate - a.acceptanceRate);
                break;
            case "difficulty":
                const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };
                result.sort(
                    (a, b) =>
                        difficultyOrder[a.difficulty] -
                        difficultyOrder[b.difficulty]
                );
                break;
            case "frequency":
                result.sort((a, b) => b.frequency - a.frequency);
                break;
            case "newest":
            default:
                result.sort((a, b) => b.number - a.number);
                break;
        }

        return result;
    }, [problems, filters, sortBy]);

    // Apply bookmarks
    const problemsWithBookmarks = useMemo(() => {
        return filteredAndSortedProblems.map((p) => ({
            ...p,
            isBookmarked: bookmarkedIds.has(p.id),
        }));
    }, [filteredAndSortedProblems, bookmarkedIds]);

    // Pagination
    const totalPages = Math.ceil(
        problemsWithBookmarks.length / ITEMS_PER_PAGE
    );
    const paginatedProblems = problemsWithBookmarks.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Calculate stats
    const stats = useMemo(() => {
        const solved = problems.filter((p) => p.status === "solved").length;
        const attempted = problems.filter((p) => p.status === "attempted")
            .length;
        return {
            solved,
            attempted,
            total: problems.length,
        };
    }, [problems]);

    const handleBookmarkToggle = (id: string) => {
        setBookmarkedIds((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
                addNotification("info", "Problem removed from bookmarks");
            } else {
                newSet.add(id);
                addNotification("success", "Problem bookmarked");
            }
            localStorage.setItem(
                "problem-bookmarks",
                JSON.stringify(Array.from(newSet))
            );
            return newSet;
        });
    };

    const handleViewModeChange = (mode: ViewMode) => {
        setViewMode(mode);
        localStorage.setItem("problems-view-mode", mode);
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [filters, sortBy]);

    return (
        <div className="container mx-auto py-6 space-y-6">
            <Breadcrumb items={[{ label: "Problems" }]} />

            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Problems</h1>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowFilters(!showFilters)}
                        className="md:hidden"
                    >
                        <Filter className="h-4 w-4 mr-2" />
                        Filters
                    </Button>
                    <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Newest</SelectItem>
                            <SelectItem value="acceptance">
                                Acceptance Rate
                            </SelectItem>
                            <SelectItem value="difficulty">Difficulty</SelectItem>
                            <SelectItem value="frequency">Frequency</SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="flex border rounded-md">
                        <Button
                            variant={viewMode === "list" ? "default" : "ghost"}
                            size="sm"
                            className="rounded-r-none"
                            onClick={() => handleViewModeChange("list")}
                        >
                            <List className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={viewMode === "grid" ? "default" : "ghost"}
                            size="sm"
                            className="rounded-l-none"
                            onClick={() => handleViewModeChange("grid")}
                        >
                            <Grid className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <ProgressStats
                solved={stats.solved}
                attempted={stats.attempted}
                total={stats.total}
            />

            <div className="flex gap-6">
                {showFilters && (
                    <div className="hidden md:block">
                        <FilterSidebar />
                    </div>
                )}

                {showFilters && (
                    <div className="md:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
                        <div className="h-full w-64 border-r bg-background">
                            <FilterSidebar />
                        </div>
                    </div>
                )}

                <div className="flex-1 space-y-4">
                    {paginatedProblems.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            No problems found. Try adjusting your filters.
                        </div>
                    ) : viewMode === "list" ? (
                        <ProblemTable
                            problems={paginatedProblems}
                            onBookmarkToggle={handleBookmarkToggle}
                        />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {paginatedProblems.map((problem) => (
                                <ProblemCard
                                    key={problem.id}
                                    problem={problem}
                                    onBookmarkToggle={handleBookmarkToggle}
                                />
                            ))}
                        </div>
                    )}

                    {totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

